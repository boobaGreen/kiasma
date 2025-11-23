# KIASMA NETWORK

> **The Oracle Convergence Layer.**
> *Where Data Converges. Where Value Compounds.*

![Kiasma Banner](https://via.placeholder.com/1200x400?text=KIASMA+NETWORK)

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
kiasma-core/
├── src/
│   ├── vault/          # Core ERC-4626 Logic
│   ├── adapters/       # Protocol-specific connectors (Link, Pyth)
│   ├── router/         # Phase 2 Data Router Logic
│   └── utils/          # MerkleDistributor, CircuitBreaker
├── test/               # Foundry Test Suite
└── script/             # Deployment Scripts
```

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/kiasma.git

# Install dependencies
forge install

# Run tests
forge test
```

## 📄 Documentation

Read the full **[Whitepaper](./whitepaper.md)** for deep technical details on the Dual Engine mechanism and Tokenomics.

## 🛡️ Security

This project is currently in **Pre-Alpha**.
*   Audits: *Pending*
*   Bug Bounty: *Coming Soon*

---

**License:** MIT
**Copyright:** © 2025 Kiasma DAO
