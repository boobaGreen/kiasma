import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy Genesis Synapse
    const GenesisSynapse = await ethers.getContractFactory("GenesisSynapse");
    const genesisSynapse = await GenesisSynapse.deploy("https://api.kiasma.network/");
    await genesisSynapse.waitForDeployment();
    const genesisAddr = await genesisSynapse.getAddress();
    console.log("GenesisSynapse deployed to:", genesisAddr);

    // 2. Deploy Kiasma Vault
    // 2. Deploy Kiasma Vault
    // Arbitrum One Addresses
    let WETH_ADDR = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
    let SWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

    // Check if we are on a network that needs mocks (no code at WETH address)
    const wethCode = await ethers.provider.getCode(WETH_ADDR);
    if (wethCode === "0x") {
        console.log("Deploying Mocks...");

        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const weth = await MockERC20.deploy("Wrapped Ether", "WETH");
        await weth.waitForDeployment();
        WETH_ADDR = await weth.getAddress();
        console.log("Mock WETH deployed to:", WETH_ADDR);

        const MockRouter = await ethers.getContractFactory("MockUniswapRouter");
        const router = await MockRouter.deploy();
        await router.waitForDeployment();
        SWAP_ROUTER = await router.getAddress();
        console.log("Mock Router deployed to:", SWAP_ROUTER);
    }

    const KiasmaVault = await ethers.getContractFactory("KiasmaVault");
    const vault = await KiasmaVault.deploy(WETH_ADDR, genesisAddr, SWAP_ROUTER);
    await vault.waitForDeployment();
    console.log("KiasmaVault deployed to:", await vault.getAddress());

    // 3. Initial Setup (Optional)
    // Set target weights, etc.

    // 4. Export Addresses for Frontend
    const addresses = {
        GenesisSynapse: genesisAddr,
        KiasmaVault: await vault.getAddress(),
        WETH: WETH_ADDR,
        SwapRouter: SWAP_ROUTER
    };

    const frontendDir = path.join(__dirname, "../../frontend/src");
    if (!fs.existsSync(frontendDir)) {
        console.warn("Frontend directory not found, skipping address export.");
    } else {
        fs.writeFileSync(
            path.join(frontendDir, "contract-addresses.json"),
            JSON.stringify(addresses, null, 2)
        );
        console.log("Contract addresses exported to frontend/src/contract-addresses.json");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
