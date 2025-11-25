import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import RoadmapPage from './pages/RoadmapPage';
import NftPage from './pages/NftPage';
import TradePage from './pages/TradePage';
import StakingPage from './pages/StakingPage';
import VaultPage from './pages/VaultPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <LandingPage />,
            },
            {
                path: 'about',
                element: <AboutPage />,
            },
            {
                path: 'roadmap',
                element: <RoadmapPage />,
            },
            {
                path: 'nft',
                element: <NftPage />,
            },
            {
                path: 'trade',
                element: <TradePage />,
            },
            {
                path: 'staking',
                element: <StakingPage />,
            },
            {
                path: 'vault',
                element: <VaultPage />,
            },
        ],
    },
]);
