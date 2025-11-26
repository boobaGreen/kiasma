import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { Wallet, Shield, ArrowRight, Zap, Database, Activity, TrendingUp } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import contractAddresses from '../contract-addresses.json';
import clsx from 'clsx';
import { CustomConnectButton } from '../components/CustomConnectButton';

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
    const containerRef = useRef<HTMLDivElement>(null);
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
    const mockAPY = 12.5;

    // Interactive Animation Handlers
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // "Digital Loom" Parallax
        // Threads move slightly
        gsap.to('.loom-thread', {
            x: (i) => x * 20 * (i % 2 === 0 ? 1 : -1),
            duration: 0.5,
            ease: 'power1.out'
        });

        // Modules shift with weight
        gsap.to('.loom-module', {
            x: x * 10,
            y: y * 10,
            duration: 0.8,
            ease: 'power2.out'
        });
    };

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Weave the background (Warp Threads)
        tl.from('.loom-warp', {
            scaleY: 0,
            transformOrigin: 'top',
            duration: 1,
            stagger: 0.05,
            ease: 'power3.inOut'
        })
            // 2. Draw the connections (Weft Threads)
            .from('.loom-weft', {
                scaleX: 0,
                transformOrigin: 'left',
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.inOut'
            }, '-=0.5')
            // 3. Modules "Type" themselves in (Staccato)
            .from('.loom-module', {
                scale: 0,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'back.out(1.7)' // Pop effect
            }, '-=0.5')
            // 4. Data fills in
            .from('.loom-data', {
                y: 10,
                opacity: 0,
                duration: 0.3,
                stagger: 0.05,
                ease: 'steps(3)' // Typewriter rhythm
            }, '-=0.2');

    }, { scope: containerRef });

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background text-ink pt-32 pb-20 relative overflow-hidden flex items-center justify-center">
                <div className="bg-surface border-2 border-ink p-12 shadow-[16px_16px_0_var(--color-ink)] max-w-md text-center relative z-10">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-background shadow-[0_0_0_4px_var(--color-primary)]">
                        <Wallet className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-display font-bold mb-4 tracking-tight">SYSTEM_LOCKED</h2>
                    <p className="font-mono text-sm text-muted mb-8 leading-relaxed">
                        The machine requires authorization. Insert your digital key to activate the loom.
                    </p>
                    <div className="flex justify-center">
                        <CustomConnectButton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-background text-ink pt-24 pb-20 relative overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* The Digital Loom (Background SVG) */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
                <svg className="w-full h-full" preserveAspectRatio="none">
                    {/* Vertical Warp Threads */}
                    {Array.from({ length: 20 }).map((_, i) => (
                        <rect
                            key={`warp-${i}`}
                            x={`${i * 5 + 2.5}%`}
                            y="0"
                            width="1"
                            height="100%"
                            fill="currentColor"
                            className="loom-warp"
                        />
                    ))}
                </svg>
            </div>

            {/* Main Content Layer */}
            <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center min-h-[80vh]">

                {/* Header Module */}
                <div className="mb-12 loom-module">
                    <div className="flex items-baseline gap-4 mb-2">
                        <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                        <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-ink leading-none">
                            KIASMA<span className="text-secondary">.OS</span>
                        </h1>
                    </div>
                    <div className="h-1 w-32 bg-ink mb-4 loom-weft"></div>
                    <p className="font-mono text-sm text-muted tracking-widest loom-data">
                        OPERATIONAL // UNIT: {address?.slice(0, 8)}
                    </p>
                </div>

                {/* The Machine Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Core Metrics (The Engine) */}
                    <div className="md:col-span-4 space-y-8">
                        {/* TVL Module */}
                        <div className="loom-module group relative">
                            {/* Connecting Line */}
                            <div className="absolute top-1/2 -right-8 w-8 h-1 bg-ink loom-weft hidden md:block"></div>

                            <div className="bg-surface border-2 border-ink p-6 shadow-[8px_8px_0_var(--color-ink)] transition-transform hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-ink text-white flex items-center justify-center rounded-full">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div className="font-mono text-xs font-bold text-muted">METRIC_01</div>
                                </div>
                                <div className="text-4xl font-display font-bold text-ink mb-1 loom-data">
                                    {totalAssetsBigInt ? `${parseFloat(formatEther(totalAssetsBigInt)).toFixed(2)}` : '0.00'}
                                </div>
                                <div className="font-mono text-xs text-muted uppercase tracking-wider">Total Value Locked (ETH)</div>
                            </div>
                        </div>

                        {/* APY Module */}
                        <div className="loom-module group relative">
                            {/* Connecting Line */}
                            <div className="absolute top-1/2 -right-8 w-8 h-1 bg-secondary loom-weft hidden md:block"></div>

                            <div className="bg-surface border-2 border-ink p-6 shadow-[8px_8px_0_var(--color-secondary)] transition-transform hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-secondary text-white flex items-center justify-center rounded-sm rotate-3">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div className="font-mono text-xs font-bold text-muted">METRIC_02</div>
                                </div>
                                <div className="text-4xl font-display font-bold text-primary mb-1 loom-data">
                                    {mockAPY}%
                                </div>
                                <div className="font-mono text-xs text-muted uppercase tracking-wider">Current Yield (APY)</div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column: User Ledger (The Fabric) */}
                    <div className="md:col-span-4 flex flex-col justify-center h-full">
                        <div className="loom-module relative">
                            {/* Vertical Line */}
                            <div className="absolute -top-8 left-1/2 w-1 h-8 bg-ink loom-warp hidden md:block"></div>

                            <div className="bg-ink text-surface p-8 shadow-[12px_12px_0_var(--color-primary)] relative overflow-hidden">
                                {/* Abstract Shapes */}
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full"></div>
                                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full"></div>

                                <div className="relative z-10">
                                    <h3 className="font-display font-bold text-2xl mb-6 flex items-center gap-3">
                                        <Database className="w-6 h-6" />
                                        YOUR_LEDGER
                                    </h3>

                                    <div className="space-y-6 font-mono">
                                        <div>
                                            <div className="text-xs opacity-50 mb-1">DEPOSITED ASSETS</div>
                                            <div className="text-3xl font-bold loom-data">{parseFloat(formatEther(userDeposit)).toFixed(4)} ETH</div>
                                        </div>

                                        <div className="w-full h-px bg-white/20"></div>

                                        <div className="flex justify-between">
                                            <div>
                                                <div className="text-xs opacity-50 mb-1">POOL SHARE</div>
                                                <div className="text-xl font-bold text-secondary loom-data">{userPoolShare.toFixed(2)}%</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs opacity-50 mb-1">EST. YIELD</div>
                                                <div className="text-xl font-bold text-primary loom-data">+{((parseFloat(formatEther(userDeposit)) * mockAPY / 100) / 12).toFixed(4)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Vertical Line */}
                            <div className="absolute -bottom-8 left-1/2 w-1 h-8 bg-ink loom-warp hidden md:block"></div>
                        </div>
                    </div>

                    {/* Right Column: Controls (The Interface) */}
                    <div className="md:col-span-4 space-y-6">

                        {/* Action Buttons */}
                        <div className="loom-module space-y-4">
                            <button
                                onClick={() => navigate('/vault')}
                                className="w-full group relative bg-background border-2 border-ink p-4 flex items-center gap-4 hover:bg-ink hover:text-white transition-all active:translate-y-1"
                            >
                                <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-bold font-display text-xl border-2 border-ink group-hover:border-white transition-colors">
                                    01
                                </div>
                                <div className="text-left flex-1">
                                    <div className="font-bold font-display text-lg">MANAGE VAULT</div>
                                    <div className="text-[10px] font-mono uppercase tracking-widest opacity-70">Deposit / Withdraw</div>
                                </div>
                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </button>

                            <button
                                onClick={() => navigate('/trade')}
                                className="w-full group relative bg-background border-2 border-ink p-4 flex items-center gap-4 hover:bg-ink hover:text-white transition-all active:translate-y-1"
                            >
                                <div className="w-12 h-12 bg-secondary text-white flex items-center justify-center font-bold font-display text-xl border-2 border-ink group-hover:border-white transition-colors">
                                    02
                                </div>
                                <div className="text-left flex-1">
                                    <div className="font-bold font-display text-lg">TRADE ASSETS</div>
                                    <div className="text-[10px] font-mono uppercase tracking-widest opacity-70">Swap / Exchange</div>
                                </div>
                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </button>
                        </div>

                        {/* NFT Access Module */}
                        <div className={clsx(
                            "loom-module border-2 border-dashed p-6 relative overflow-hidden transition-all cursor-pointer hover:bg-surface/50",
                            hasNFT ? "border-primary bg-primary/5" : "border-ink/30"
                        )} onClick={() => !hasNFT && navigate('/nft')}>

                            <div className="flex items-center gap-4 mb-2">
                                <div className={clsx("w-2 h-2 rounded-full animate-pulse", hasNFT ? "bg-primary" : "bg-muted")}></div>
                                <div className="font-mono text-xs font-bold uppercase tracking-widest">Access_Control</div>
                            </div>

                            {hasNFT ? (
                                <div className="flex items-center gap-4">
                                    <Shield className="w-8 h-8 text-primary" />
                                    <div>
                                        <div className="font-bold font-display text-lg">GRANTED</div>
                                        <div className="text-xs font-mono text-muted">Genesis Synapse Active</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 opacity-70">
                                    <Zap className="w-8 h-8 text-muted" />
                                    <div>
                                        <div className="font-bold font-display text-lg">RESTRICTED</div>
                                        <div className="text-xs font-mono text-muted">Mint NFT to Unlock</div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
