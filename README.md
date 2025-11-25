# KIASMA NETWORK

> **The Oracle Convergence Layer.**
> *Where Data Converges. Where Value Compounds.*

## 🌌 Vision

**Kiasma** is the infrastructure layer for the on-chain economy. We unify the fragmented Oracle Sector into a single, efficient protocol.

*   **Phase 1 (The Vault):** An **ERC-4626** smart vault that aggregates oracle tokens (LINK, PYTH, API3) to generate optimized, auto-compounding yield.
*   **Phase 2 (The Router):** A **ZK-Data Router** that leverages the vault's liquidity to route data requests to the best provider at the best price.

## ⚡ Key Features

*   **Algorithmic Rebalancing:** Scientifically weighted basket (60% Oracles / 20% ETH / 20% Stable).
*   **Circuit Breakers:** Auto-pause buying if an asset drops >20% in 24h.
*   **Merkle Exit Queue:** Gas-efficient (O(1)) withdrawals even during high congestion.
*   **Zero-Founder Allocation:** 100% Fair Launch. No pre-mine.

## 🛠️ Tech Stack

*   **Core:** Solidity (ERC-4626 standard)
*   **Network:** Arbitrum One / Optimism
*   **Security:** OpenZeppelin AccessControl, Pausable
*   **Oracles:** Chainlink Automation (Keepers), Pyth Feeds

## 📂 Repository Structure

```
kiasma/
├── contracts/          # Smart Contracts (Hardhat)
│   ├── contracts/      # Solidity Source Code
│   ├── test/           # Tests
│   └── scripts/        # Deployment Scripts
├── frontend/           # Web Application (Vite/React)
│   ├── src/            # Frontend Source Code
│   └── public/         # Static Assets
└── README.md           # Project Overview
```

## 🚀 Getting Started

This is a monorepo containing both the Smart Contracts and the Frontend.

### Smart Contracts (Local Fork)
The project is configured to fork Arbitrum Mainnet for local development using Hardhat.

1. **Start the Local Node (Fork):**
   ```bash
   cd contracts
   npx hardhat node
   ```
   *This will start a local blockchain that forks Arbitrum Mainnet state via Infura.*

2. **Deploy Contracts:**
   Open a new terminal and run:
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.ts --network localhost
   ```
   *This script will deploy `GenesisSynapse` and `KiasmaVault` and automatically export the addresses to `frontend/src/contract-addresses.json`.*

### Frontend
The frontend automatically picks up the deployed contract addresses.

1. **Start the Dev Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   *Open http://localhost:5173 to view the app.*

2. **Connect Wallet:**
   - Network: **Hardhat Local** (Chain ID: 31337)
   - RPC URL: `http://127.0.0.1:8545/`
   - Import a test account from the `npx hardhat node` output using its private key.

## 📄 Documentation

Read the full **[Whitepaper](./whitepaper.md)** for deep technical details on the Dual Engine mechanism and Tokenomics.

## 🛡️ Security

This project is currently in **Pre-Alpha**.
*   Audits: *Pending*
*   Bug Bounty: *Coming Soon*

---

**License:** MIT
**Copyright:** © 2025 Kiasma DAO
