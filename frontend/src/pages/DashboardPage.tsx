import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { Section, Card, Button } from '../components/ui';
import { TrendingUp, Wallet, Shield, ArrowRight, Zap } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import contractAddresses from '../contract-addresses.json';

const VAULT_ADDRESS = contractAddresses.KiasmaVault as `0x${string}`;
const NFT_ADDRESS = contractAddresses.GenesisSynapse as `0x${string}`;

const VAULT_ABI = [
    {
        "inputs": [],
        "name": "totalAssets",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const NFT_ABI = [
    {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const DashboardPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { address, isConnected } = useAccount();

    // Fetch vault data
    const { data: totalAssets } = useReadContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'totalAssets',
        query: { refetchInterval: 10000 }
    });

    const { data: userShares } = useReadContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address, refetchInterval: 10000 }
    });

    const { data: totalSupply } = useReadContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'totalSupply',
        query: { refetchInterval: 10000 }
    });

    const { data: nftBalance } = useReadContract({
        address: NFT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address, refetchInterval: 10000 }
    });

    // Calculate user stats
    const userSharesBigInt = userShares as bigint | undefined;
    const totalAssetsBigInt = totalAssets as bigint | undefined;
    const totalSupplyBigInt = totalSupply as bigint | undefined;

    const userDeposit = userSharesBigInt && totalAssetsBigInt && totalSupplyBigInt && totalSupplyBigInt > 0n
        ? (userSharesBigInt * totalAssetsBigInt) / totalSupplyBigInt
        : 0n;

    const userPoolShare = userSharesBigInt && totalSupplyBigInt && totalSupplyBigInt > 0n
        ? Number((userSharesBigInt * 10000n) / totalSupplyBigInt) / 100
        : 0;

    const hasNFT = nftBalance ? (nftBalance as bigint) > 0n : false;

    // Mock APY - in production this would come from contract or backend
    const mockAPY = 12.5;

    useGSAP(() => {
        gsap.from('.stat-card', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
        });

        gsap.from('.action-btn', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.4,
            ease: 'back.out(1.7)',
        });
    }, { scope: containerRef });

    if (!isConnected) {
        return (
            <Section className="min-h-[80vh] flex items-center justify-center">
                <Card className="text-center max-w-md">
                    <Wallet className="w-16 h-16 text-primary mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
                    <p className="text-muted mb-6">
                        Connect your wallet to view your dashboard and portfolio stats.
                    </p>
                </Card>
            </Section>
        );
    }

    return (
        <div ref={containerRef}>
            <Section className="pt-32 pb-20">
                <div className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                        Your <span className="text-primary">Dashboard</span>
                    </h1>
                    <p className="text-xl text-muted">
                        Track your portfolio performance and manage your investments
                    </p>
                </div>

                {/* Global Stats */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Protocol Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="stat-card">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted mb-2">Total Value Locked</p>
                                    <p className="text-3xl font-bold font-display">
                                        {totalAssetsBigInt ? `${parseFloat(formatEther(totalAssetsBigInt)).toFixed(4)} ETH` : '0.00 ETH'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </Card>

                        <Card className="stat-card">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted mb-2">Current APY</p>
                                    <p className="text-3xl font-bold font-display text-green-400">
                                        {mockAPY}%
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-green-400" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* User Stats */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Your Portfolio</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="stat-card">
                            <p className="text-sm text-muted mb-2">Your Deposit</p>
                            <p className="text-2xl font-bold font-display">
                                {parseFloat(formatEther(userDeposit)).toFixed(4)} ETH
                            </p>
                        </Card>

                        <Card className="stat-card">
                            <p className="text-sm text-muted mb-2">Pool Share</p>
                            <p className="text-2xl font-bold font-display text-secondary">
                                {userPoolShare.toFixed(2)}%
                            </p>
                        </Card>

                        <Card className="stat-card">
                            <p className="text-sm text-muted mb-2">Estimated Yearly Yield</p>
                            <p className="text-2xl font-bold font-display text-green-400">
                                {(parseFloat(formatEther(userDeposit)) * mockAPY / 100).toFixed(4)} ETH
                            </p>
                        </Card>
                    </div>
                </div>

                {/* NFT Status */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Genesis Synapse NFT</h2>
                    <Card className={`stat-card ${hasNFT ? 'border-accent' : 'border-white/10'}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted mb-2">NFT Status</p>
                                {hasNFT ? (
                                    <>
                                        <p className="text-2xl font-bold text-accent mb-4">✓ NFT Holder</p>
                                        <ul className="space-y-2 text-sm text-muted">
                                            <li>• 0% Protocol Fees</li>
                                            <li>• Revenue Share Access</li>
                                            <li>• Governance Rights</li>
                                            <li>• Priority Support</li>
                                        </ul>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold mb-4">No NFT</p>
                                        <p className="text-sm text-muted mb-4">
                                            Mint the Genesis Synapse NFT to unlock exclusive benefits and fee waivers.
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate('/nft')}
                                        >
                                            Mint NFT <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-accent" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Button
                            className="action-btn h-auto py-6 flex-col gap-2"
                            onClick={() => navigate('/vault')}
                        >
                            <Wallet className="w-8 h-8" />
                            <span className="text-lg font-bold">Manage Vault</span>
                            <span className="text-sm opacity-80">Deposit or Withdraw</span>
                        </Button>

                        <Button
                            className="action-btn h-auto py-6 flex-col gap-2"
                            variant="outline"
                            onClick={() => navigate('/trade')}
                        >
                            <TrendingUp className="w-8 h-8" />
                            <span className="text-lg font-bold">Trade Assets</span>
                            <span className="text-sm opacity-80">Swap Oracle Tokens</span>
                        </Button>

                        {!hasNFT && (
                            <Button
                                className="action-btn h-auto py-6 flex-col gap-2"
                                variant="outline"
                                onClick={() => navigate('/nft')}
                            >
                                <Shield className="w-8 h-8" />
                                <span className="text-lg font-bold">Mint NFT</span>
                                <span className="text-sm opacity-80">Unlock Benefits</span>
                            </Button>
                        )}
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default DashboardPage;
