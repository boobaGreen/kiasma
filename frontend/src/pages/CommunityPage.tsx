import { useRef, useState } from 'react';
import { Section, Button, Card } from '../components/ui';
import { Users, Vote, Star, Award, ArrowUpRight, Shield, Coins } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';

gsap.registerPlugin(ScrollTrigger);

const CommunityPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredContributor, setHoveredContributor] = useState<number | null>(null);

    // Mock Data for Contributors (Updated roles)
    const contributors = [
        { id: 1, name: "0xAlpha", role: "Liquidity Provider", contributions: "GENESIS", avatarColor: "bg-primary" },
        { id: 2, name: "BetaBuilder", role: "Governance", contributions: "VOTER", avatarColor: "bg-secondary" },
        { id: 3, name: "GammaRay", role: "Strategist", contributions: "PROPOSER", avatarColor: "bg-ink" },
        { id: 4, name: "DeltaForce", role: "Security", contributions: "AUDITOR", avatarColor: "bg-accent" },
        { id: 5, name: "EpsilonNode", role: "Operator", contributions: "NODE", avatarColor: "bg-primary" },
        { id: 6, name: "ZetaMod", role: "Community", contributions: "MOD", avatarColor: "bg-secondary" },
        { id: 7, name: "EtaDev", role: "Core Dev", contributions: "CODE", avatarColor: "bg-ink" },
        { id: 8, name: "ThetaData", role: "Analyst", contributions: "DATA", avatarColor: "bg-accent" },
    ];

    // Mock Data for Proposals (Aligned with Whitepaper)
    const proposals = [
        { id: "KIP-1", title: "Phase 2: Activate Lobbying", status: "Active", votes: "85%" },
        { id: "KIP-2", title: "Add Pyth Network Adapter", status: "Pending", votes: "40%" },
        { id: "KIP-3", title: "Treasury Rebalancing Q3", status: "Passed", votes: "92%" },
    ];

    useGSAP(() => {
        const tl = gsap.timeline();

        // Hero Entrance
        tl.from('.hero-text', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // Mosaic Animation
        gsap.utils.toArray('.mosaic-item').forEach((item: any, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0,
                rotation: i % 2 === 0 ? 15 : -15,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(1.7)'
            });
        });

        // Infographic Animation (Bar Chart)
        gsap.from('.chart-bar', {
            scrollTrigger: {
                trigger: '.chart-container',
                start: 'top 80%'
            },
            height: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: 'power4.out'
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-ink pt-24 pb-20 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-5"
                style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {/* Hero: The Collective */}
            <Section className="relative z-10 pt-12 pb-24 text-center">
                <div className="inline-block border-2 border-ink px-4 py-1 mb-6 bg-surface shadow-[4px_4px_0_#1a1a1a] hero-text">
                    <span className="font-mono text-sm font-bold uppercase tracking-widest">Community Governance</span>
                    <h2 className="text-3xl font-display font-bold">ACTIVE MEMBERS</h2>
                    <div className="font-mono text-sm text-muted">ROLE: GENESIS_CONTRIBUTOR</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {contributors.map((contributor, i) => (
                        <div
                            key={contributor.id}
                            className="mosaic-item relative aspect-square group cursor-pointer"
                            onMouseEnter={() => setHoveredContributor(contributor.id)}
                            onMouseLeave={() => setHoveredContributor(null)}
                        >
                            <div className={clsx(
                                "absolute inset-0 border-2 border-ink transition-all duration-300",
                                contributor.avatarColor,
                                hoveredContributor === contributor.id ? "translate-x-[-4px] translate-y-[-4px] shadow-[8px_8px_0_#1a1a1a]" : ""
                            )}>
                                {/* Abstract Avatar Visual */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                    {i % 3 === 0 ? <Users className="w-16 h-16" /> :
                                        i % 3 === 1 ? <Shield className="w-16 h-16" /> :
                                            <Coins className="w-16 h-16" />}
                                </div>

                                {/* Info Overlay */}
                                <div className="absolute inset-0 p-4 flex flex-col justify-between bg-surface/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="text-right">
                                        <ArrowUpRight className="w-6 h-6 ml-auto" />
                                    </div>
                                    <div>
                                        <div className="font-bold font-display text-xl">{contributor.name}</div>
                                        <div className="font-mono text-xs text-muted uppercase">{contributor.role}</div>
                                        <div className="mt-2 font-mono text-sm font-bold text-primary">
                                            {contributor.contributions}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* The Economic Engine */}
            <Section className="pb-32">
                <div className="mb-16">
                    <h2 className="text-4xl font-display font-bold mb-4">THE ECONOMIC ENGINE</h2>
                    <p className="font-mono text-muted max-w-2xl">
                        A transparent, meritocratic distribution model designed for long-term alignment.
                        We pay with what we have: Equity (NFTs) for early believers, Revenue for the long game.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Chart 1: Token Distribution (50/30/20) */}
                    <div className="chart-container border-2 border-ink p-8 bg-surface shadow-[8px_8px_0_#1a1a1a]">
                        <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-2">
                            <Coins className="w-5 h-5 text-primary" />
                            INITIAL_TOKEN_DISTRIBUTION
                        </h3>

                        <div className="relative h-64 flex items-end gap-8 px-4 border-b border-ink/20">
                            {/* Founder */}
                            <div className="flex-1 flex flex-col justify-end group relative">
                                <div className="w-full bg-primary transition-all duration-500 hover:opacity-90 relative" style={{ height: '50%' }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono font-bold">50%</div>
                                </div>
                                <div className="mt-4 text-center font-mono text-xs font-bold uppercase">Founder</div>
                                <div className="text-center font-mono text-[10px] text-muted">(Vesting)</div>
                            </div>

                            {/* Angel Contributors */}
                            <div className="flex-1 flex flex-col justify-end group relative">
                                <div className="w-full bg-secondary transition-all duration-500 hover:opacity-90 relative" style={{ height: '30%' }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono font-bold">30%</div>
                                </div>
                                <div className="mt-4 text-center font-mono text-xs font-bold uppercase">Angels</div>
                                <div className="text-center font-mono text-[10px] text-muted">(NFT Equity)</div>
                            </div>

                            {/* Treasury */}
                            <div className="flex-1 flex flex-col justify-end group relative">
                                <div className="w-full bg-ink transition-all duration-500 hover:opacity-90 relative" style={{ height: '20%' }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono font-bold text-ink">20%</div>
                                </div>
                                <div className="mt-4 text-center font-mono text-xs font-bold uppercase">Treasury</div>
                                <div className="text-center font-mono text-[10px] text-muted">(Growth)</div>
                            </div>
                        </div>
                    </div>

                    {/* Chart 2: Contributor Roles Matrix */}
                    <div className="border-2 border-ink p-8 bg-surface shadow-[8px_8px_0_#1a1a1a]">
                        <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-2">
                            <Users className="w-5 h-5 text-secondary" />
                            CONTRIBUTOR_ROLES
                        </h3>
                        <div className="space-y-6">
                            {/* Angel Contributor */}
                            <div className="group border border-ink/20 p-4 hover:bg-ink/5 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="font-bold font-display text-lg">ANGEL CONTRIBUTOR</div>
                                    <div className="bg-primary text-ink text-xs font-bold px-2 py-1">WORK FOR EQUITY</div>
                                </div>
                                <p className="text-xs font-mono text-muted mb-2">
                                    Early devs, marketers, and community builders who work for future value.
                                </p>
                                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                                    <Award className="w-4 h-4" /> REWARD: ANGEL NFT (Governance + Yield)
                                </div>
                            </div>

                            {/* Angel Investor */}
                            <div className="group border border-ink/20 p-4 hover:bg-ink/5 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="font-bold font-display text-lg">ANGEL INVESTOR</div>
                                    <div className="bg-secondary text-ink text-xs font-bold px-2 py-1">CAPITAL FOR EQUITY</div>
                                </div>
                                <p className="text-xs font-mono text-muted mb-2">
                                    External backers who provide early capital (ETH/Stable) to fund operations.
                                </p>
                                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                                    <Star className="w-4 h-4" /> REWARD: ANGEL NFT (Governance + Yield)
                                </div>
                            </div>

                            {/* Core Team (Phase 2+) */}
                            <div className="group border border-ink/20 p-4 hover:bg-ink/5 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="font-bold font-display text-lg">CORE TEAM</div>
                                    <div className="bg-ink text-white text-xs font-bold px-2 py-1">WORK FOR REVENUE</div>
                                </div>
                                <p className="text-xs font-mono text-muted mb-2">
                                    Operational team paid in tokens or stablecoins as revenue scales.
                                </p>
                                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                                    <Coins className="w-4 h-4" /> REWARD: SALARY + TOKENS
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Governance / Voting */}
            <Section className="pb-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-display font-bold mb-4">ACTIVE PROPOSALS</h2>
                    <p className="font-mono text-muted">Shape the protocol. Cast your vote.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {proposals.map((prop, i) => (
                        <Card key={i} className="group border-2 border-ink p-6 hover:bg-ink hover:text-white transition-colors duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <span className="font-mono text-xs font-bold border border-current px-2 py-1">
                                    {prop.id}
                                </span>
                                <span className={clsx(
                                    "text-xs font-bold uppercase px-2 py-1",
                                    prop.status === 'Active' ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                                )}>
                                    {prop.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold font-display mb-4 group-hover:text-white">{prop.title}</h3>

                            <div className="mb-6">
                                <div className="flex justify-between text-xs font-mono mb-1 opacity-70">
                                    <span>Approval</span>
                                    <span>{prop.votes}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: prop.votes }}></div>
                                </div>
                            </div>

                            <Button className="w-full border-2 border-current bg-transparent text-current hover:bg-white hover:text-black hover:border-white transition-all">
                                <Vote className="w-4 h-4 mr-2" /> VOTE NOW
                            </Button>
                        </Card>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default CommunityPage;
