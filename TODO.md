# Kiasma Network - Next Steps

## 1. Vault Testing (Fork Environment)
- [x] **Impersonate Whale:** Create a script to impersonate a WETH holder on Arbitrum Mainnet.
- [x] **Fund Test Account:** Transfer real WETH (forked) to the local test account.
- [x] **Test Deposit:** Verify `KiasmaVault.deposit()` works with real WETH.
- [x] **Test Withdraw:** Verify `KiasmaVault.withdraw()` works.

## 2. Frontend Development
- [x] **Vault Page:** Create a dedicated page for Vault interactions (APY display, Deposit/Withdraw forms).
- [x] **Trade Page:** Fix `useWallet` error and migrate to Wagmi hooks.
- [x] **Landing Page:** Build the main entry point with Hero section, Value Prop, and "Enter App" CTA.
- [x] **Dashboard:** Create a user dashboard showing total value locked, personal yield, and NFT status.

## 3. Smart Contracts
- [ ] **Strategy Implementation:** Flesh out the `rebalance` logic to actually swap tokens on Uniswap (currently basic structure).
- [ ] **Oracle Integration:** Integrate Chainlink/Pyth for real-time asset pricing in the Vault.
- [ ] **Security:** Add reentrancy guards and role-based access control for critical functions.

## 4. Polish & UI/UX
- [ ] **Toast Notifications:** Add success/error toasts for all transactions.
- [ ] **Mobile Responsiveness:** Ensure all pages look good on mobile.
- [ ] **Loading States:** Improve skeleton loaders and transaction pending states.
