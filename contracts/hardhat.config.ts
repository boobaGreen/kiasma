import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: "0.8.20",
    networks: {

        arbitrumSepolia: {

            url: "https://sepolia-rollup.arbitrum.io/rpc",
            chainId: 421614,
        },
        arbitrumOne: {

            url: "https://arb1.arbitrum.io/rpc",
            chainId: 42161,
        }
    },
};

export default config;
