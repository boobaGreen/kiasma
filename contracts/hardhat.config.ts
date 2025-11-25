import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: "0.8.20",
    networks: {
        hardhat: {
            forking: {
                url: "https://arbitrum-mainnet.infura.io/v3/d6fac829e03a4600bd0f576170be66d2",
                blockNumber: 404098319,
                enabled: true,
            },
            chainId: 31337,
        },
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
