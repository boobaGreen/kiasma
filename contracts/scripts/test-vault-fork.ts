import { ethers, network } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

async function main() {
    console.log("🚀 Starting Vault Fork Test...");

    // 1. Setup
    const [deployer, user] = await ethers.getSigners();
    const WETH_ADDR = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
    // Binance Hot Wallet 20 (Arbitrum) - A likely holder of WETH
    const WHALE_ADDR = "0xF977814e90dA44bFA03b6295A0616a897441aceC";

    // Get contracts
    // Assuming KiasmaVault is already deployed. 
    // If not, we should deploy it here or use the address from the previous deploy.
    // For this script, let's deploy a fresh instance to be sure.

    console.log("\n📦 Deploying fresh Vault for testing...");
    const GenesisSynapse = await ethers.getContractFactory("GenesisSynapse");
    const genesis = await GenesisSynapse.deploy("https://api.kiasma.network/");
    await genesis.waitForDeployment();

    const SWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
    const KiasmaVault = await ethers.getContractFactory("KiasmaVault");
    const vault = await KiasmaVault.deploy(WETH_ADDR, await genesis.getAddress(), SWAP_ROUTER);
    await vault.waitForDeployment();
    const vaultAddr = await vault.getAddress();
    console.log(`   Vault deployed at: ${vaultAddr}`);

    // 2. Impersonate Whale
    console.log(`\n🐋 Impersonating Whale: ${WHALE_ADDR}`);
    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [WHALE_ADDR],
    });
    const whale = await ethers.getSigner(WHALE_ADDR);

    // Check Whale Balance
    const weth = await ethers.getContractAt("IERC20", WETH_ADDR);
    const whaleBal = await weth.balanceOf(WHALE_ADDR);
    console.log(`   Whale WETH Balance: ${ethers.formatEther(whaleBal)} WETH`);

    if (whaleBal < ethers.parseEther("10")) {
        console.log("   ⚠️ Whale has low balance, trying to wrap ETH instead...");
        // Fallback: Wrap ETH if whale is empty
        // WETH contract usually has a receive() function that wraps ETH sent to it.
        // We don't need the IWETH9 interface if we just send ETH.
        await deployer.sendTransaction({
            to: WETH_ADDR,
            value: ethers.parseEther("20")
        });
        console.log("   Wrapped 20 ETH from deployer.");

        // Transfer to test user
        // We need IERC20 interface which we already have in 'weth' variable
        await weth.connect(deployer).transfer(user.address, ethers.parseEther("10"));
    } else {
        // Transfer from Whale to User
        console.log("   Transferring 10 WETH to User...");
        await weth.connect(whale).transfer(user.address, ethers.parseEther("10"));
    }

    const userBal = await weth.balanceOf(user.address);
    console.log(`   User WETH Balance: ${ethers.formatEther(userBal)} WETH`);

    // 3. Deposit
    console.log("\n💰 Testing Deposit...");
    const depositAmount = ethers.parseEther("5");

    await weth.connect(user).approve(vaultAddr, depositAmount);
    console.log("   Approved Vault to spend WETH");

    await vault.connect(user).deposit(depositAmount, user.address);
    console.log(`   Deposited ${ethers.formatEther(depositAmount)} WETH`);

    const shares = await vault.balanceOf(user.address);
    console.log(`   User Shares (stKMA): ${ethers.formatEther(shares)}`);

    // 4. Withdraw
    console.log("\n💸 Testing Withdraw...");
    const withdrawShares = shares / 2n; // Withdraw half

    await vault.connect(user).redeem(withdrawShares, user.address, user.address);
    console.log(`   Redeemed ${ethers.formatEther(withdrawShares)} shares`);

    const finalBal = await weth.balanceOf(user.address);
    console.log(`   Final User WETH Balance: ${ethers.formatEther(finalBal)} WETH`);

    console.log("\n✅ Test Complete!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
