// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GenesisSynapse
 * @dev The "Angel Round" NFT for Kiasma Network.
 *      Provides fee waivers and revenue share rights.
 */
contract GenesisSynapse is ERC721Enumerable, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 300;
    uint256 public constant MINT_PRICE = 1 ether;

    // Revenue Share Variables
    uint256 public ethPerTokenStored;
    mapping(uint256 => uint256) public lastEthPerToken;

    // Track funds available for admin withdrawal (Mint proceeds)
    uint256 public adminBalance;

    event RewardsDeposited(uint256 amount);
    event RewardClaimed(
        uint256 indexed tokenId,
        address indexed claimer,
        uint256 amount
    );
    event AdminWithdrawal(uint256 amount);

    // Base URI for metadata
    string private _baseTokenURI;

    constructor(
        string memory baseURI
    ) ERC721("Kiasma Genesis Synapse", "KGS") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    /**
     * @notice Mints a new Genesis Synapse NFT.
     * @dev Requires payment of MINT_PRICE.
     */
    function mint() external payable nonReentrant {
        uint256 supply = totalSupply();
        require(supply < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= MINT_PRICE, "Insufficient ETH sent");

        // Track mint proceeds separately from rewards
        adminBalance += msg.value;

        _safeMint(msg.sender, supply + 1);

        // New tokens start with the current accumulated rewards offset,
        // so they can't claim past rewards.
        lastEthPerToken[supply + 1] = ethPerTokenStored;
    }

    /**
     * @notice Deposits ETH as rewards for NFT holders.
     * @dev Distributes the msg.value equally among current holders.
     */
    function depositRewards() external payable {
        uint256 supply = totalSupply();
        require(supply > 0, "No tokens minted yet");
        require(msg.value > 0, "No ETH sent");

        ethPerTokenStored += (msg.value * 1e18) / supply; // Use 1e18 precision
        emit RewardsDeposited(msg.value);
    }

    /**
     * @notice Claims accumulated rewards for a specific Token ID.
     * @param tokenId The ID of the token to claim for.
     */
    function claimReward(uint256 tokenId) external nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");

        uint256 owed = getUnclaimedReward(tokenId);
        require(owed > 0, "No rewards to claim");

        lastEthPerToken[tokenId] = ethPerTokenStored;

        payable(msg.sender).transfer(owed);
        emit RewardClaimed(tokenId, msg.sender, owed);
    }

    /**
     * @notice View unclaimed rewards for a Token ID.
     */
    function getUnclaimedReward(uint256 tokenId) public view returns (uint256) {
        // In OpenZeppelin v5, _exists is removed. We can check ownerOf but it reverts.
        // We can use _ownerOf which is internal.
        if (_ownerOf(tokenId) == address(0)) return 0;
        uint256 diff = ethPerTokenStored - lastEthPerToken[tokenId];
        // We used 1e18 precision for the rate, so we just multiply by 1 (token unit)
        // but we need to divide back by 1e18?
        // Wait, ethPerTokenStored is (ETH * 1e18) / Supply.
        // Reward = 1 * diff / 1e18.
        return diff / 1e18;
    }

    /**
     * @notice Checks if a user holds a Genesis Synapse NFT.
     * @dev Used by KiasmaVault to determine if management fee should be waived.
     * @param user The address to check.
     * @return bool True if the user holds at least one NFT.
     */
    function checkFeeWaiver(address user) external view returns (bool) {
        return balanceOf(user) > 0;
    }

    /**
     * @notice Allows the owner to withdraw collected Mint Proceeds.
     */
    function withdraw() external onlyOwner {
        uint256 amount = adminBalance;
        require(amount > 0, "No funds to withdraw");

        adminBalance = 0;
        payable(owner()).transfer(amount);
        emit AdminWithdrawal(amount);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
}
