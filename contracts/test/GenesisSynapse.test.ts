import { expect } from "chai";
import { ethers } from "hardhat";
import { GenesisSynapse } from "../typechain-types";

describe("GenesisSynapse", function () {
    let genesisSynapse: GenesisSynapse;
    let owner: any;
    let addr1: any;
    let addr2: any;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const GenesisSynapseFactory = await ethers.getContractFactory("GenesisSynapse");
        genesisSynapse = await GenesisSynapseFactory.deploy("https://api.kiasma.network/metadata/");
    });

    it("Should mint a new NFT and update admin balance", async function () {
        await genesisSynapse.connect(addr1).mint({ value: ethers.parseEther("1.0") });
        expect(await genesisSynapse.balanceOf(addr1.address)).to.equal(1);
        expect(await genesisSynapse.adminBalance()).to.equal(ethers.parseEther("1.0"));
    });

    it("Should fail if insufficient ETH sent", async function () {
        await expect(
            genesisSynapse.connect(addr1).mint({ value: ethers.parseEther("0.5") })
        ).to.be.revertedWith("Insufficient ETH sent");
    });

    it("Should correctly report fee waiver eligibility", async function () {
        expect(await genesisSynapse.checkFeeWaiver(addr1.address)).to.be.false;
        await genesisSynapse.connect(addr1).mint({ value: ethers.parseEther("1.0") });
        expect(await genesisSynapse.checkFeeWaiver(addr1.address)).to.be.true;
    });

    it("Should distribute rewards correctly", async function () {
        // Mint 2 NFTs
        await genesisSynapse.connect(addr1).mint({ value: ethers.parseEther("1.0") });
        await genesisSynapse.connect(addr2).mint({ value: ethers.parseEther("1.0") });

        // Deposit 10 ETH rewards
        // Total Supply = 2. Reward per token = 5 ETH.
        await genesisSynapse.connect(owner).depositRewards({ value: ethers.parseEther("10.0") });

        // Check unclaimed rewards
        expect(await genesisSynapse.getUnclaimedReward(1)).to.equal(ethers.parseEther("5.0"));
        expect(await genesisSynapse.getUnclaimedReward(2)).to.equal(ethers.parseEther("5.0"));

        // Claim rewards for Token 1
        const initialBalance = await ethers.provider.getBalance(addr1.address);
        const tx = await genesisSynapse.connect(addr1).claimReward(1);
        const receipt = await tx.wait();

        // Calculate gas cost
        const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
        const finalBalance = await ethers.provider.getBalance(addr1.address);

        // Balance should increase by 5 ETH - gas
        // In Ethers v6, these are all BigInts. 
        // If TypeScript complains, it might be because of strict checking or version mismatch.
        // We can use explicit BigInt arithmetic or just verify the types.
        // The error 'Operator + cannot be applied to types bigint and number' implies one is number.
        // Let's assume they are BigInts and maybe the linter is confused, or cast if needed.
        expect(finalBalance + gasUsed - initialBalance).to.equal(ethers.parseEther("5.0"));

        // Unclaimed should be 0 now
        expect(await genesisSynapse.getUnclaimedReward(1)).to.equal(0);
    });

    it("Should not distribute past rewards to new minters", async function () {
        // Mint 1 NFT
        await genesisSynapse.connect(addr1).mint({ value: ethers.parseEther("1.0") });

        // Deposit 10 ETH rewards
        await genesisSynapse.connect(owner).depositRewards({ value: ethers.parseEther("10.0") });

        // Mint 2nd NFT
        await genesisSynapse.connect(addr2).mint({ value: ethers.parseEther("1.0") });

        // Token 1 should have 10 ETH reward
        expect(await genesisSynapse.getUnclaimedReward(1)).to.equal(ethers.parseEther("10.0"));

        // Token 2 should have 0 ETH reward
        expect(await genesisSynapse.getUnclaimedReward(2)).to.equal(0);
    });

    it("Should allow admin to withdraw mint proceeds but NOT rewards", async function () {
        // Mint 1 NFT (1 ETH)
        await genesisSynapse.connect(addr1).mint({ value: ethers.parseEther("1.0") });

        // Deposit 10 ETH rewards
        await genesisSynapse.connect(owner).depositRewards({ value: ethers.parseEther("10.0") });

        // Contract Balance = 11 ETH
        expect(await ethers.provider.getBalance(await genesisSynapse.getAddress())).to.equal(ethers.parseEther("11.0"));

        // Admin Withdraw
        const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
        const tx = await genesisSynapse.withdraw();
        const receipt = await tx.wait();
        const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
        const finalOwnerBalance = await ethers.provider.getBalance(owner.address);

        // Should receive 1 ETH (Mint price), not 11 ETH
        expect(finalOwnerBalance + gasUsed - initialOwnerBalance).to.equal(ethers.parseEther("1.0"));

        // Contract should still have 10 ETH
        expect(await ethers.provider.getBalance(await genesisSynapse.getAddress())).to.equal(ethers.parseEther("10.0"));
    });
});
