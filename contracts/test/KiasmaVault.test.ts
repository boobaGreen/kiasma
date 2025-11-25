import { expect } from "chai";
import { ethers } from "hardhat";
import { KiasmaVault, GenesisSynapse, MockERC20, MockUniswapRouter } from "../typechain-types";

describe("KiasmaVault", function () {
    let vault: KiasmaVault;
    let genesisSynapse: GenesisSynapse;
    let asset: MockERC20;
    let router: MockUniswapRouter;
    let owner: any;
    let user1: any;
    let user2: any;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy Mock Asset (WETH)
        const MockERC20Factory = await ethers.getContractFactory("MockERC20");
        asset = await MockERC20Factory.deploy("Wrapped Ether", "WETH");

        // Deploy Genesis Synapse
        const GenesisSynapseFactory = await ethers.getContractFactory("GenesisSynapse");
        genesisSynapse = await GenesisSynapseFactory.deploy("https://api.kiasma.network/");

        // Deploy Mock Router
        const MockRouterFactory = await ethers.getContractFactory("MockUniswapRouter");
        router = await MockRouterFactory.deploy();

        // Deploy Vault
        const VaultFactory = await ethers.getContractFactory("KiasmaVault");
        vault = await VaultFactory.deploy(await asset.getAddress(), await genesisSynapse.getAddress(), await router.getAddress());
    });

    it("Should allow deposits and mint shares", async function () {
        // Mint assets to user
        await asset.mint(user1.address, ethers.parseEther("10"));
        await asset.connect(user1).approve(await vault.getAddress(), ethers.parseEther("10"));

        // Deposit
        await vault.connect(user1).deposit(ethers.parseEther("10"), user1.address);

        // Check shares
        expect(await vault.balanceOf(user1.address)).to.equal(ethers.parseEther("10"));
        expect(await vault.totalAssets()).to.equal(ethers.parseEther("10"));
    });

    it("Should collect management fees over time", async function () {
        // Mint assets to user
        await asset.mint(user1.address, ethers.parseEther("100"));
        await asset.connect(user1).approve(await vault.getAddress(), ethers.parseEther("100"));
        await vault.connect(user1).deposit(ethers.parseEther("100"), user1.address);

        // Fast forward 1 year
        await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine", []);

        // Trigger fee collection (e.g. via deposit/withdraw or manual call if public)
        // We'll use a small deposit to trigger it
        await asset.mint(user2.address, ethers.parseEther("1"));
        await asset.connect(user2).approve(await vault.getAddress(), ethers.parseEther("1"));
        await vault.connect(user2).deposit(ethers.parseEther("1"), user2.address);

        // Fee should be approx 2% of 100 = 2 shares
        const ownerShares = await vault.balanceOf(owner.address);
        // Allow small margin for time precision
        expect(ownerShares).to.be.closeTo(ethers.parseEther("2"), ethers.parseEther("0.1"));
    });

    it("Should check fee waiver eligibility", async function () {
        expect(await vault.isFeeExempt(user1.address)).to.be.false;

        // Mint Genesis Synapse to user1
        await genesisSynapse.connect(user1).mint({ value: ethers.parseEther("1") });

        expect(await vault.isFeeExempt(user1.address)).to.be.true;
    });

    it("Should set target weights", async function () {
        const assets = [await asset.getAddress()];
        const weights = [10000];
        const fees = [3000];

        await vault.setTargetWeights(assets, weights, fees);

        expect(await vault.targetWeights(await asset.getAddress())).to.equal(10000);
    });
});
