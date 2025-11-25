import { expect } from "chai";
import { ethers } from "hardhat";
import { KiasmaVault, GenesisSynapse, IERC20 } from "../typechain-types";

describe("KiasmaVault (Fork Testing)", function () {
    // Arbitrum One Addresses
    const WETH_ADDR = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
    const USDC_ADDR = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
    const LINK_ADDR = "0xf97f4df75117a78c1A5a0DBb88F4330CAf01234F";
    const SWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

    let vault: KiasmaVault;
    let genesisSynapse: GenesisSynapse;
    let weth: any; // Use any to allow raw calls if needed, or cast to interface
    let usdc: IERC20;
    let owner: any;

    before(async function () {
        // Only run if forking is enabled
        if (process.env.HARDHAT_NETWORK !== 'hardhat') {
            // console.log("Skipping fork tests on non-hardhat network");
        }

        [owner] = await ethers.getSigners();

        // Connect to Tokens
        // We use a minimal ABI for WETH to ensure we have the deposit function
        const wethAbi = [
            "function deposit() payable",
            "function withdraw(uint wad)",
            "function totalSupply() view returns (uint)",
            "function approve(address guy, uint wad) returns (bool)",
            "function transfer(address dst, uint wad) returns (bool)",
            "function transferFrom(address src, address dst, uint wad) returns (bool)",
            "function balanceOf(address guy) view returns (uint)"
        ];
        weth = await ethers.getContractAt(wethAbi, WETH_ADDR);
        usdc = await ethers.getContractAt("IERC20", USDC_ADDR);

        // Deploy Genesis Synapse
        const GenesisSynapseFactory = await ethers.getContractFactory("GenesisSynapse");
        genesisSynapse = await GenesisSynapseFactory.deploy("https://api.kiasma.network/");

        // Deploy Vault (Base Asset: WETH)
        const VaultFactory = await ethers.getContractFactory("KiasmaVault");
        vault = await VaultFactory.deploy(WETH_ADDR, await genesisSynapse.getAddress(), SWAP_ROUTER);
    });

    it("Should execute a real swap on Uniswap V3 (WETH -> USDC)", async function () {
        // 1. Get WETH by depositing ETH
        const amountIn = ethers.parseEther("1.0"); // 1 WETH

        // Ensure we have enough ETH
        const balance = await ethers.provider.getBalance(owner.address);
        if (balance < amountIn * 2n) {
            await ethers.provider.send("hardhat_setBalance", [
                owner.address,
                "0x1000000000000000000", // ~18 ETH
            ]);
        }

        // Deposit ETH to get WETH
        await weth.connect(owner).deposit({ value: amountIn });

        // Verify we got WETH
        expect(await weth.balanceOf(owner.address)).to.be.gte(amountIn);

        // Transfer to Vault
        await weth.connect(owner).transfer(await vault.getAddress(), amountIn);
        expect(await weth.balanceOf(await vault.getAddress())).to.equal(amountIn);

        // 2. Set Target Weights to force a rebalance
        // We want to sell WETH to buy USDC.
        // Let's say we want 50% WETH, 50% USDC.

        // Note: The current rebalance function is manual (tokenIn -> tokenOut).
        // So we just need to authorize USDC as a target.

        await vault.connect(owner).setTargetWeights(
            [WETH_ADDR, USDC_ADDR],
            [5000, 5000],
            [500, 500] // WETH: 0.05%, USDC: 0.05% (Using 500 fee tier for WETH/USDC pool)
        );

        // 3. Execute Rebalance
        // Sell 0.5 WETH for USDC
        const swapAmount = ethers.parseEther("0.5");

        // Check USDC balance before
        const usdcBalBefore = await usdc.balanceOf(await vault.getAddress());
        expect(usdcBalBefore).to.equal(0);

        await vault.connect(owner).rebalance(
            WETH_ADDR,
            USDC_ADDR,
            swapAmount,
            0 // Accept any amount for test
        );

        // 4. Verify Swap
        const usdcBalAfter = await usdc.balanceOf(await vault.getAddress());
        const wethBalAfter = await weth.balanceOf(await vault.getAddress());

        // console.log("USDC Received:", ethers.formatUnits(usdcBalAfter, 6));

        expect(usdcBalAfter).to.be.gt(0);
        expect(wethBalAfter).to.equal(ethers.parseEther("0.5"));
    });
});
