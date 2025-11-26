import { useRef, useState } from 'react';
import { Section, Button, Card } from '../components/ui';
import { Lock, Unlock, TrendingUp, Shield, Clock } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
// import { useAccount, useReadContract, useWriteContract } from 'wagmi';
// import { formatEther, parseEther } from 'viem';
// import { CONTRACT_ADDRESSES } from '../../contract-addresses.json';

// Mock ABI for Staking (Replace with actual ABI)
/* const STAKING_ABI = [
    { inputs: [{ name: "amount", type: "uint256" }], name: "stake", outputs: [], stateMutability: "nonpayable", type: "function" },
    { inputs: [{ name: "amount", type: "uint256" }], name: "withdraw", outputs: [], stateMutability: "nonpayable", type: "function" },
    { inputs: [{ name: "account", type: "address" }], name: "earned", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
    { inputs: [{ name: "account", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
]; */

const StakingPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [amount, setAmount] = useState('');
    const [activeTab, setActiveTab] = useState<'stake' | 'withdraw'>('stake');
    // const { address } = useAccount();
    // const { writeContract, isPending } = useWriteContract();

    // Mock Data (Replace with contract reads)
    const tvl = "4,821,903";
    const apy = "12.4%";
    const userStake = "1,250.00";
    const userRewards = "43.21";

    const { contextSafe } = useGSAP(() => {
        const tl = gsap.timeline();

        // Vault Door Entrance
        tl.from('.vault-door', {
            scale: 0.8,
            rotation: -45,
            opacity: 0,
            duration: 1.5,
            ease: 'power4.out'
        });

        // Tumblers Spin
        tl.from('.tumbler', {
            rotation: 360,
            duration: 2,
            stagger: 0.2,
            ease: 'elastic.out(1, 0.5)'
        }, "-=1");

        // Stats Count Up
        tl.from('.stat-value', {
            textContent: "0",
            duration: 2,
            ease: "power1.out",
            snap: { textContent: 1 },
            stagger: 0.2,
        }, "-=1.5");

    }, { scope: containerRef });

    // Interactive Animations
    const handleVaultMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Calculate rotation (max 15 degrees)
        const rotateY = (mouseX / (rect.width / 2)) * 15;
        const rotateX = -(mouseY / (rect.height / 2)) * 15;

        gsap.to('.vault-door', {
            rotationY: rotateY,
            rotationX: rotateX,
            transformPerspective: 1000,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Parallax for inner parts
        gsap.to('.vault-inner', {
            x: mouseX * 0.05,
            y: mouseY * 0.05,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    const handleVaultLeave = contextSafe(() => {
        gsap.to('.vault-door', {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)'
        });
        gsap.to('.vault-inner', {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)'
        });
    });

    const handleInputFocus = contextSafe((e: React.FocusEvent<HTMLInputElement>) => {
        gsap.to(e.target, {
            scale: 1.02,
            borderColor: 'var(--color-primary)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    const handleInputBlur = contextSafe((e: React.FocusEvent<HTMLInputElement>) => {
        gsap.to(e.target, {
            scale: 1,
            borderColor: 'var(--color-ink)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    const handleAction = contextSafe(() => {
        if (!amount) return;

        // Mechanical "Unlock" Animation
        const tl = gsap.timeline();

        // 1. "Spinner" Effect (Rapid Rotation)
        tl.to('.tumbler', {
            rotation: "+=720", // 2 full spins
            duration: 1.5,
            ease: 'power4.inOut',
            stagger: 0.1
        })
            // 2. Lock pulses
            .to('.lock-icon', {
                scale: 1.2,
                color: activeTab === 'stake' ? 'var(--color-primary)' : 'var(--color-secondary)',
                duration: 0.2,
                yoyo: true,
                repeat: 3 // Flash a few times
            }, "-=0.5")
            // 3. Door "Opens" (Scale up and fade out slightly)
            .to('.vault-door', {
                scale: 1.5,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.in'
            })
            // 4. Reset
            .to('.vault-door', {
                scale: 1,
                opacity: 1,
                rotationY: 0,
                rotationX: 0,
                duration: 0.5,
                ease: 'power2.out',
                delay: 0.5
            });

        console.log(`${activeTab.toUpperCase()} ${amount}`);
    });

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-ink pt-24 pb-20 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-5"
                style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
            </div>

            {/* Hero: The Vault */}
            <Section className="relative z-10 pt-12 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: The Vault Door Visual */}
                    <div className="relative flex justify-center perspective-1000">
                        <div
                            className="vault-door w-80 h-80 md:w-[500px] md:h-[500px] rounded-full border-[20px] border-ink bg-surface shadow-[20px_20px_0_#1a1a1a] flex items-center justify-center relative cursor-pointer transition-transform transform-style-3d"
                            onMouseMove={handleVaultMove}
                            onMouseLeave={handleVaultLeave}
                        >
                            {/* Outer Ring Bolts */}
                            <div className="vault-outer-ring absolute inset-0 rounded-full pointer-events-none">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="absolute w-4 h-4 bg-ink rounded-full"
                                        style={{
                                            top: '50%', left: '50%',
                                            transform: `translate(-50%, -50%) rotate(${i * 30}deg) translate(230px) `
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Inner Mechanism */}
                            <div className="vault-inner w-3/4 h-3/4 rounded-full border-4 border-dashed border-ink/50 flex items-center justify-center relative pointer-events-none">
                                <div className="tumbler w-2/3 h-2/3 rounded-full border-[12px] border-primary flex items-center justify-center shadow-inner">
                                    <div className="tumbler w-1/2 h-1/2 rounded-full border-[8px] border-secondary flex items-center justify-center bg-ink">
                                        <Lock className="lock-icon w-12 h-12 text-white transition-colors" />
                                    </div>
                                </div>
                                {/* Crossbars */}
                                <div className="absolute w-full h-2 bg-ink/20 rotate-45"></div>
                                <div className="absolute w-full h-2 bg-ink/20 -rotate-45"></div>
                            </div>
                        </div>

                        {/* Floating Stats Cards */}
                        <div className="absolute top-0 right-0 md:right-10 bg-background border-2 border-ink p-4 shadow-[8px_8px_0_#1a1a1a] animate-float pointer-events-none">
                            <div className="text-xs font-bold text-muted uppercase">Total Value Locked</div>
                            <div className="text-2xl font-display font-bold text-primary stat-value">${tvl}</div>
                        </div>
                        <div className="absolute bottom-10 left-0 md:left-10 bg-background border-2 border-ink p-4 shadow-[8px_8px_0_#1a1a1a] animate-float-delayed pointer-events-none">
                            <div className="text-xs font-bold text-muted uppercase">Current APY</div>
                            <div className="text-2xl font-display font-bold text-secondary stat-value">{apy}</div>
                        </div>
                    </div>

                    {/* Right: The Interface */}
                    <div className="max-w-xl">
                        <div className="mb-8">
                            <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">
                                THE <span className="text-primary">VAULT</span>
                            </h1>
                            <p className="text-xl font-mono text-muted">
                                Secure your assets. Earn yield. Power the network.
                                <br />
                                <span className="text-sm opacity-70">// PROTOCOL_SECURITY_LEVEL: MAXIMUM</span>
                            </p>
                        </div>

                        {/* Staking Card */}
                        <Card className="bg-surface border-2 border-ink p-8 shadow-[12px_12px_0_#1a1a1a]">
                            {/* Tabs */}
                            <div className="flex border-b-2 border-ink mb-8">
                                <button
                                    onClick={() => setActiveTab('stake')}
                                    className={clsx(
                                        "flex-1 py-4 font-bold font-display text-lg transition-colors flex items-center justify-center gap-2 relative overflow-hidden group",
                                        activeTab === 'stake' ? "bg-primary text-ink" : "hover:bg-ink/5"
                                    )}
                                >
                                    <span className="relative z-10 flex items-center gap-2"><Lock className="w-4 h-4" /> DEPOSIT</span>
                                    {activeTab !== 'stake' && <div className="absolute inset-0 bg-ink/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                                </button>
                                <button
                                    onClick={() => setActiveTab('withdraw')}
                                    className={clsx(
                                        "flex-1 py-4 font-bold font-display text-lg transition-colors flex items-center justify-center gap-2 relative overflow-hidden group",
                                        activeTab === 'withdraw' ? "bg-secondary text-ink" : "hover:bg-ink/5"
                                    )}
                                >
                                    <span className="relative z-10 flex items-center gap-2"><Unlock className="w-4 h-4" /> WITHDRAW</span>
                                    {activeTab !== 'withdraw' && <div className="absolute inset-0 bg-ink/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                                </button>
                            </div>

                            {/* Input */}
                            <div className="mb-8">
                                <div className="flex justify-between mb-2 font-mono text-sm">
                                    <span>AMOUNT</span>
                                    <span>BALANCE: {activeTab === 'stake' ? '1,000.00' : userStake} KSM</span>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        placeholder="0.00"
                                        className="w-full bg-background border-2 border-ink p-4 text-2xl font-bold font-mono focus:outline-none transition-all"
                                    />
                                    <button
                                        onClick={() => setAmount('1000')} // Mock Max
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-ink text-white px-2 py-1 hover:bg-primary hover:text-ink transition-colors active:scale-95"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button
                                onClick={handleAction}
                                className="w-full py-6 text-xl font-bold shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none transition-all hover:brightness-110"
                                variant={activeTab === 'stake' ? 'primary' : 'secondary'}
                            >
                                {activeTab === 'stake' ? 'AUTHORIZE_DEPOSIT' : 'INITIATE_WITHDRAWAL'}
                            </Button>

                            {/* Info */}
                            <div className="mt-6 pt-6 border-t border-ink/10 grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-xs font-bold text-muted uppercase mb-1">Your Stake</div>
                                    <div className="text-xl font-bold font-mono">{userStake} KSM</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-muted uppercase mb-1">Unclaimed Yield</div>
                                    <div className="text-xl font-bold font-mono text-green-600">+{userRewards} KSM</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Section>

            {/* Stats Grid */}
            <Section className="pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Shield, label: "Safety Score", value: "98/100", sub: "Audited by 3 Firms" },
                        { icon: Clock, label: "Lock-up Period", value: "14 Days", sub: "For unstaking" },
                        { icon: TrendingUp, label: "Reward Rate", value: "0.05 KSM", sub: "Per Block" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-surface border-2 border-ink p-6 flex items-start gap-4 hover:bg-ink/5 transition-colors hover:-translate-y-1 duration-300">
                            <div className="w-12 h-12 bg-ink text-white flex items-center justify-center rounded-full shrink-0">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold font-display">{stat.label}</h3>
                                <div className="text-2xl font-mono font-bold text-primary my-1">{stat.value}</div>
                                <p className="text-xs font-mono text-muted">{stat.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default StakingPage;
