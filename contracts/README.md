# Kiasma Contracts

The smart contract layer for **Kiasma Network**. Built with Hardhat and Solidity.

## 🛠️ Tech Stack

*   **Framework:** [Hardhat](https://hardhat.org/)
*   **Language:** Solidity (0.8.27)
*   **Testing:** Mocha / Chai / Ethers.js
*   **Type Generation:** Typechain

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18+)
*   npm

### Installation

```bash
# Navigate to the contracts directory
cd contracts

# Install dependencies
npm install
```

### Commands

#### Compile
Compile the smart contracts and generate Typechain types:
```bash
npx hardhat compile
```

#### Test
Run the test suite:
```bash
npx hardhat test
```

#### Deploy
Deploy contracts to a network (configure in `hardhat.config.ts`):
```bash
npx hardhat run scripts/deploy.ts --network <network-name>
```

## 📂 Structure

*   `contracts/`: Solidity source files.
*   `test/`: TypeScript test files.
*   `scripts/`: Deployment and maintenance scripts.
*   `hardhat.config.ts`: Hardhat configuration.
