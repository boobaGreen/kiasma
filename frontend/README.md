# Kiasma Frontend

The official user interface for **Kiasma Network** - The Oracle Convergence Layer.
Built with modern web technologies to deliver a premium, "cyber-oracle" aesthetic and high-performance trading experience.

## ⚡ Tech Stack

*   **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first configuration)
*   **Animations:** [GSAP](https://gsap.com/) (ScrollTrigger, Timeline)
*   **Charting:** [Lightweight Charts](https://tradingview.github.io/lightweight-charts/) (TradingView)
*   **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Features

*   **Landing Page:** Immersive scroll animations and 3D-style visuals.
*   **Genesis Synapse (NFT):** "Angel Round" investment page with 3D card effects and utility breakdown.
*   **Trade Interface:** Real-time candlestick chart (mock data) with buy/sell swap UI.
*   **Staking Vault:** Dashboard for depositing assets and tracking APY.
*   **Wallet Integration:** Mock `WalletContext` for demonstrating connection states and balance updates.

## 🛠️ Setup & Development

### Prerequisites
*   Node.js (v18+)
*   npm or pnpm

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev
```
The app will be available at `http://localhost:5173`.

### Building for Production

```bash
# Create production build
npm run build

# Preview the build
npm run preview
```

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components (Button, Card, TradeChart)
│   ├── context/        # Global state (WalletContext)
│   ├── layouts/        # Page layouts (MainLayout, Navbar)
│   ├── pages/          # Application pages (Landing, Trade, NFT, etc.)
│   ├── index.css       # Tailwind v4 theme & global styles
│   └── main.tsx        # Entry point
├── public/             # Static assets
└── index.html          # HTML template
```

## 🎨 Design System

The design uses a custom "Cyber-Oracle" theme defined in `src/index.css`:
*   **Primary:** Neon Green (`#00ff9d`)
*   **Secondary:** Deep Purple (`#9d00ff`)
*   **Background:** Dark Void (`#0a0a0a`)
*   **Fonts:** `Outfit` (Headings) & `Inter` (Body)
