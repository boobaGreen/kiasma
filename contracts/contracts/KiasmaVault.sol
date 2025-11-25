// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./GenesisSynapse.sol";
import "./interfaces/IUniswapRouter.sol";

/**
 * @title KiasmaVault
 * @dev ERC-4626 Vault for Kiasma Network.
 *      Aggregates Oracle tokens, manages rebalancing, and integrates with Genesis Synapse for fee waivers.
 */
contract KiasmaVault is ERC4626, Ownable, Pausable {
    using SafeERC20 for IERC20;

    // --- Configuration ---
    GenesisSynapse public immutable genesisSynapse;
    IUniswapRouter public immutable uniswapRouter;

    // Fee Configuration (Basis Points: 100 = 1%)
    uint256 public managementFeeBps = 200; // 2% Annual
    uint256 public performanceFeeBps = 2000; // 20% on Profits

    // Rebalancing Configuration
    mapping(address => uint256) public targetWeights; // Token -> Weight (Bps)
    mapping(address => uint24) public poolFees; // Token -> Uniswap Pool Fee Tier
    address[] public assetsList;

    // State
    uint256 public lastFeeTimestamp;
    uint256 public highWaterMark;

    // Events
    event Rebalanced(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );
    event FeesCollected(uint256 managementFee, uint256 performanceFee);
    event TargetWeightsUpdated();

    constructor(
        IERC20 _asset, // Base asset (e.g., WETH or USDC)
        address _genesisSynapse,
        address _uniswapRouter
    ) ERC4626(_asset) ERC20("Kiasma Vault Share", "stKMA") Ownable(msg.sender) {
        genesisSynapse = GenesisSynapse(_genesisSynapse);
        uniswapRouter = IUniswapRouter(_uniswapRouter);
        lastFeeTimestamp = block.timestamp;
    }

    // --- Core ERC4626 Overrides ---

    /**
     * @dev See {IERC4626-deposit}.
     * Adds Fee Waiver check: If user holds Genesis Synapse, we could potentially mint extra shares
     * or discount entry fees (if any). Currently standard ERC4626 doesn't have entry fees,
     * but we can use this hook for future logic.
     */
    function deposit(
        uint256 assets,
        address receiver
    ) public override whenNotPaused returns (uint256) {
        // Collect pending management fees before state change
        _mintManagementFee();
        return super.deposit(assets, receiver);
    }

    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public override returns (uint256) {
        _mintManagementFee();
        return super.withdraw(assets, receiver, owner);
    }

    // --- Fee Logic ---

    /**
     * @notice Mints management fees to the owner (Treasury).
     * @dev Fee is calculated based on time elapsed and total assets.
     */
    function _mintManagementFee() internal {
        uint256 timeElapsed = block.timestamp - lastFeeTimestamp;
        if (timeElapsed == 0) return;

        // Annual rate: 2% -> rate per second
        // Fee = TotalAssets * (Rate * Time / 365 days)
        uint256 total = totalAssets();
        uint256 feeAssets = (total * managementFeeBps * timeElapsed) /
            (365 days * 10000);

        if (feeAssets > 0) {
            // Mint shares equivalent to the fee assets
            uint256 shares = convertToShares(feeAssets);
            if (shares > 0) {
                _mint(owner(), shares);
                emit FeesCollected(feeAssets, 0);
            }
        }
        lastFeeTimestamp = block.timestamp;
    }

    /**
     * @notice Checks if a user is eligible for Fee Waiver.
     */
    function isFeeExempt(address user) public view returns (bool) {
        return genesisSynapse.checkFeeWaiver(user);
    }

    // --- Rebalancing Logic ---

    /**
     * @notice Sets target weights for the portfolio.
     * @param assets The addresses of the tokens.
     * @param weights The target weights in Bps (must sum to 10000).
     * @param fees The Uniswap pool fees for swapping (e.g., 3000 for 0.3%).
     */
    function setTargetWeights(
        address[] calldata assets,
        uint256[] calldata weights,
        uint24[] calldata fees
    ) external onlyOwner {
        require(
            assets.length == weights.length && assets.length == fees.length,
            "Length mismatch"
        );

        delete assetsList;
        uint256 totalWeight = 0;

        for (uint256 i = 0; i < assets.length; i++) {
            targetWeights[assets[i]] = weights[i];
            poolFees[assets[i]] = fees[i];
            assetsList.push(assets[i]);
            totalWeight += weights[i];
        }

        require(totalWeight == 10000, "Weights must sum to 100%");
        emit TargetWeightsUpdated();
    }

    /**
     * @notice Executes a rebalance swap.
     * @dev Only callable by owner (or Keeper in future).
     */
    function rebalance(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external onlyOwner {
        require(targetWeights[tokenOut] > 0, "TokenOut not in basket");

        IERC20(tokenIn).safeIncreaseAllowance(address(uniswapRouter), amountIn);

        IUniswapRouter.ExactInputSingleParams memory params = IUniswapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFees[tokenIn], // Assuming fee is same for pair, or need mapping pair->fee
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: minAmountOut,
                sqrtPriceLimitX96: 0
            });

        uint256 amountOut = uniswapRouter.exactInputSingle(params);
        emit Rebalanced(tokenIn, tokenOut, amountIn, amountOut);
    }

    // --- Admin ---

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Distributes protocol revenue to Genesis Synapse holders.
     */
    function distributeRewardsToNFTs() external payable onlyOwner {
        genesisSynapse.depositRewards{value: msg.value}();
    }
}
