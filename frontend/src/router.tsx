import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import VaultPage from './pages/VaultPage';
import TradePage from './pages/TradePage';
import DashboardPage from './pages/DashboardPage';
import NftPage from './pages/NftPage';
import RoadmapPage from './pages/RoadmapPage';
import StakingPage from './pages/StakingPage';
import CommunityPage from './pages/CommunityPage';

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
                path: 'vault',
                element: <VaultPage />,
            },
            {
                path: 'dashboard',
                element: <DashboardPage />,
            },
            {
                path: 'trade',
                element: <TradePage />,
            },
            {
                path: 'community',
                element: <CommunityPage />,
            },
            {
                path: 'nft',
                element: <NftPage />,
            },

            {
                path: 'roadmap',
                element: <RoadmapPage />,
            },
            {
                path: 'staking',
                element: <StakingPage />,
            },
        ],
    },
]);
