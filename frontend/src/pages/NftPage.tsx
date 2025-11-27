import { useRef, useEffect, useState } from 'react';
import { Section, Button } from '../components/ui';
import { Shield, Zap, Lock, Unlock, Fingerprint, FileKey } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { CustomConnectButton } from '../components/CustomConnectButton';
import contractAddresses from '../contract-addresses.json';
import clsx from 'clsx';

const CONTRACT_ADDRESS = contractAddresses.GenesisSynapse as `0x${string}`;
const ABI = [
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MINT_PRICE",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

const NftPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isConnected } = useAccount();
    const [isHoveringCard, setIsHoveringCard] = useState(false);

    // Web3 Hooks
    const { data: totalSupply, refetch: refetchSupply } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'totalSupply',
    });

    const { data: mintPrice } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'MINT_PRICE',
    });

    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const handleMint = () => {
        if (!mintPrice) return;
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'mint',
            value: mintPrice as bigint,
        });
    };

    useEffect(() => {
        if (isConfirmed) {
            refetchSupply();
            // Success Animation
            gsap.fromTo('.access-stamp',
                { scale: 2, opacity: 0, rotation: -45 },
                { scale: 1, opacity: 1, rotation: -15, duration: 0.5, ease: 'back.out(1.7)' }
            );
        }
    }, [isConfirmed, refetchSupply]);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from('.security-header', {
            y: -20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
            .from('.security-panel', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out'
            }, '-=0.4');

        // Scanning Line Animation
        gsap.to('.scan-line', {
            top: '100%',
            duration: 3,
            repeat: -1,
            ease: 'linear',
            yoyo: true
        });

    }, { scope: containerRef });

    const currentSupply = totalSupply ? Number(totalSupply) : 0;
    const maxSupply = 300;
    const priceEth = mintPrice ? formatEther(mintPrice as bigint) : "1.0";

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-ink pt-24 pb-20 relative overflow-hidden">
            {/* Background Grid & Lock Motifs */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{ backgroundImage: 'linear-gradient(#bfb8a5 1px, transparent 1px), linear-gradient(90deg, #bfb8a5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-5">
                {[...Array(6)].map((_, i) => (
                    <Lock key={i} className="absolute w-24 h-24" style={{ top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%`, transform: `rotate(${Math.random() * 360}deg)` }} />
                ))}
            </div>

            <Section className="relative z-10">
                {/* Header */}
                <div className="mb-12 security-header text-center">
                    <div className="inline-flex items-center gap-2 text-primary font-mono text-sm font-bold tracking-widest uppercase mb-4 border border-primary px-4 py-1 rounded-full bg-primary/5">
                        <Shield className="w-4 h-4" />
                        <span>Security_Level_Alpha</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-ink mb-6">
                        GENESIS<span className="text-secondary">.ACCESS</span>
                    </h1>
                    <p className="max-w-2xl mx-auto font-mono text-muted">
                        RESTRICTED AREA. Authorized personnel only. Minting a Genesis Synapse NFT grants lifetime clearance to protocol governance and fee waivers.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* LEFT COLUMN: NFT Card (Holographic File) */}
                    <div className="lg:col-span-5 flex justify-center perspective-1000">
                        <div
                            className="security-panel relative w-[320px] h-[480px] group preserve-3d transition-transform duration-500"
                            onMouseEnter={() => setIsHoveringCard(true)}
                            onMouseLeave={() => setIsHoveringCard(false)}
                            style={{ transform: isHoveringCard ? 'rotateY(10deg) rotateX(5deg)' : 'rotateY(0deg) rotateX(0deg)' }}
                        >
                            {/* Card Container */}
                            <div className="absolute inset-0 bg-ink text-background border-4 border-ink shadow-[16px_16px_0_#bfb8a5] flex flex-col overflow-hidden">
                                {/* Header Strip */}
                                <div className="bg-primary p-4 flex justify-between items-center border-b-4 border-ink">
                                    <span className="font-mono font-bold text-xs">CONFIDENTIAL</span>
                                    <Fingerprint className="w-8 h-8 opacity-50" />
                                </div>

                                {/* Main Visual */}
                                <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 opacity-30"
                                        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                                    </div>

                                    {/* Holographic Element */}
                                    <div className="relative z-10 w-40 h-40 border-2 border-primary rounded-full flex items-center justify-center animate-spin-slow">
                                        <div className="absolute inset-0 border-2 border-secondary rounded-full scale-75 animate-reverse-spin" />
                                        <Zap className="w-16 h-16 text-white" />
                                    </div>

                                    {/* Scanning Line */}
                                    <div className="scan-line absolute top-0 left-0 right-0 h-1 bg-green-500 shadow-[0_0_10px_#22c55e] opacity-50"></div>
                                </div>

                                {/* Footer Info */}
                                <div className="p-6 bg-surface border-t-4 border-ink text-ink">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <div className="text-xs font-mono text-muted uppercase">Subject</div>
                                            <div className="font-display font-bold text-xl">SYNAPSE_NODE</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-mono text-muted uppercase">ID</div>
                                            <div className="font-mono font-bold">#{String(currentSupply + 1).padStart(4, '0')}</div>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-ink/10 rounded-full overflow-hidden mt-4">
                                        <div className="h-full bg-primary" style={{ width: `${(currentSupply / maxSupply) * 100}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs font-mono mt-1 text-muted">
                                        <span>MINTED: {currentSupply}/{maxSupply}</span>
                                        <span>STATUS: ACTIVE</span>
                                    </div>
                                </div>
                            </div>

                            {/* Success Stamp */}
                            {isConfirmed && (
                                <div className="access-stamp absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-green-600 text-green-600 px-6 py-2 font-display font-bold text-3xl rotate-[-15deg] bg-white/90 backdrop-blur-sm z-50 whitespace-nowrap">
                                    ACCESS GRANTED
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Minting Interface */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="security-panel bg-surface border-2 border-ink p-8 shadow-[8px_8px_0_#1a1a1a]">
                            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                                <FileKey className="w-6 h-6 text-secondary" />
                                AUTHORIZATION_PROTOCOL
                            </h2>

                            <div className="space-y-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-primary text-white flex items-center justify-center font-bold border border-ink shrink-0">01</div>
                                    <div>
                                        <h3 className="font-bold text-lg">Lifetime Fee Waiver</h3>
                                        <p className="text-sm text-muted font-mono">0% Management Fee on Vault deposits (Standard: 0.50%).</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-secondary text-white flex items-center justify-center font-bold border border-ink shrink-0">02</div>
                                    <div>
                                        <h3 className="font-bold text-lg">Protocol Revenue Share</h3>
                                        <p className="text-sm text-muted font-mono">Receive 20% of all Performance Fees, forever.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-ink text-white flex items-center justify-center font-bold border border-ink shrink-0">03</div>
                                    <div>
                                        <h3 className="font-bold text-lg">Yield Boost Multiplier</h3>
                                        <p className="text-sm text-muted font-mono">1.2x - 1.5x boost on staking weight (Phase 2).</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-accent text-white flex items-center justify-center font-bold border border-ink shrink-0">04</div>
                                    <div>
                                        <h3 className="font-bold text-lg">Governance Council</h3>
                                        <p className="text-sm text-muted font-mono">Veto power on critical security upgrades.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-background border-2 border-ink p-6 mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-mono text-sm font-bold">REQUIRED_CONTRIBUTION</span>
                                    <span className="font-display font-bold text-2xl">{priceEth} ETH</span>
                                </div>
                                <div className="h-px bg-ink/20 w-full mb-4"></div>
                                <div className="flex justify-between items-center text-xs font-mono text-muted">
                                    <span>NETWORK: SEPOLIA</span>
                                    <span>GAS: EST. LOW</span>
                                </div>
                            </div>

                            {!isConnected ? (
                                <CustomConnectButton />
                            ) : (
                                <Button
                                    size="lg"
                                    onClick={handleMint}
                                    disabled={isPending || isConfirming || currentSupply >= maxSupply}
                                    className={clsx(
                                        "w-full py-6 text-lg font-display font-bold border-2 border-ink shadow-[4px_4px_0_#1a1a1a] hover:shadow-none hover:translate-y-1 transition-all flex items-center justify-center gap-3",
                                        isPending || isConfirming ? "bg-muted text-ink cursor-wait" : "bg-primary text-white"
                                    )}
                                >
                                    {isPending ? 'AWAITING_SIGNATURE...' :
                                        isConfirming ? 'VERIFYING_CREDENTIALS...' :
                                            currentSupply >= maxSupply ? 'ACCESS_DENIED (SOLD OUT)' :
                                                <>
                                                    <Unlock className="w-5 h-5" />
                                                    AUTHORIZE_MINT
                                                </>}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default NftPage;
