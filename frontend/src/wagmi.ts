import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia, hardhat } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'Kiasma',
    projectId: 'YOUR_PROJECT_ID',
    chains: [arbitrum, arbitrumSepolia, hardhat],
    ssr: false, // If your dApp uses server side rendering (SSR)
});
