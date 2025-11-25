// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IUniswapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockUniswapRouter is IUniswapRouter {
    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external payable override returns (uint256 amountOut) {
        // Mock swap: 1:1 ratio for simplicity
        amountOut = params.amountIn;

        // Burn input (simulate swap)
        // In real mock we would transferFrom, but here we assume allowance is set
        IERC20(params.tokenIn).transferFrom(
            msg.sender,
            address(this),
            params.amountIn
        );

        // Mint/Transfer output (simulate swap)
        // For this mock we need to hold tokens or mint them.
        // Simpler: Just return the amount, assuming the test checks the return value.
        // Or if we want to be more realistic, we need to be able to mint the output token.
        return amountOut;
    }
}
