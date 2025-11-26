import { useRef, useState } from 'react';
import { Section, Card } from '../components/ui';
import { Rocket, Users, Zap, Shield, TrendingUp, Sparkles, CheckCircle2, Circle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RoadmapPage = () => {
    const containerRef = useRef(null);
    const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

    useGSAP(() => {
        // Hero animation
        gsap.from('.roadmap-hero', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        });

        // Animated timeline line
        gsap.from('.timeline-line', {
            scaleY: 0,
            transformOrigin: 'top',
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.timeline-line',
                start: 'top 80%',
            },
        });

        // Phase cards animation
        const items = gsap.utils.toArray('.roadmap-item');
        items.forEach((item: any, index) => {
            const isEven = index % 2 === 0;
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                },
                x: isEven ? -100 : 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
            });

            // Pulse animation for nodes
            gsap.to(item.querySelector('.timeline-node'), {
                scale: 1.2,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
            });
        });

        // Floating particles animation
        gsap.to('.floating-particle', {
            y: -20,
            duration: 2,
            stagger: 0.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });
    }, { scope: containerRef });

    const phases = [
        {
            title: 'Phase 1: Foundation',
            subtitle: 'Building the Bedrock',
            date: 'Q1-Q2 2026',
            icon: Shield,
            color: 'from-blue-500/20 to-cyan-500/20',
            borderColor: 'border-blue-500/30',
            iconColor: 'text-blue-400',
            items: [
                { text: 'Smart Contract Audit (Tier-1)', done: false },
                { text: 'Arbitrum Mainnet Deployment', done: false },
                { text: 'Genesis NFT Mint (Angel Round)', done: false },
                { text: 'Community Governance Framework Launch', done: false },
                { text: 'Initial Liquidity Event ($5M Cap)', done: false },
                { text: 'First Community Contributor Rewards', done: false },
            ],
        },
        {
            title: 'Phase 2: Expansion',
            subtitle: 'Growing the Ecosystem',
            date: 'Q3-Q4 2026',
            icon: TrendingUp,
            color: 'from-primary/20 to-secondary/20',
            borderColor: 'border-primary/30',
            iconColor: 'text-primary',
            items: [
                { text: 'Expand to 10+ Strategy Adapters', done: false },
                { text: 'First Governance Proposals to Oracle Protocols', done: false },
                { text: 'Launch Bug Bounty Program', done: false },
                { text: 'Community Voting on Major Decisions', done: false },
                { text: 'First Angel NFT Revenue Distribution', done: false },
                { text: 'Onboard 50+ Active Contributors', done: false },
                { text: 'Multi-language Support & Global Expansion', done: false },
            ],
        },
        {
            title: 'Phase 3: Metamorphosis',
            subtitle: 'The Oracle Layer',
            date: '2027+',
            icon: Rocket,
            color: 'from-purple-500/20 to-pink-500/20',
            borderColor: 'border-purple-500/30',
            iconColor: 'text-purple-400',
            items: [
                { text: 'Kiasma Router Beta (ZK-Proof Integration)', done: false },
                { text: 'Universal Data Router Mainnet Launch', done: false },
                { text: 'Activate Buyback & Burn Mechanism', done: false },
                { text: 'Full DAO Transition (Community-Owned)', done: false },
                { text: 'Cross-Chain Expansion', done: false },
                { text: 'Establish Kiasma as Industry Standard', done: false },
            ],
        },
        {
            title: 'Phase 4: Convergence',
            subtitle: 'The Future State',
            date: '2028+',
            icon: Sparkles,
            color: 'from-yellow-500/20 to-orange-500/20',
            borderColor: 'border-yellow-500/30',
            iconColor: 'text-yellow-400',
            items: [
                { text: 'Become the "1inch of Data"', done: false },
                { text: 'Integrate with Major DeFi Protocols', done: false },
                { text: 'Launch Kiasma SDK for Developers', done: false },
                { text: 'Community-Driven Innovation Lab', done: false },
                { text: 'Establish Kiasma Foundation', done: false },
                { text: 'Global Oracle Infrastructure Standard', done: false },
            ],
        },
    ];

    return (
        <div ref={containerRef} className="overflow-hidden relative">
            {/* Floating particles background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="floating-particle absolute w-2 h-2 rounded-full bg-primary/20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Hero Section */}
            <Section className="text-center pt-32 pb-20 relative">
                <div className="roadmap-hero">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <Rocket className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-sm font-medium text-primary tracking-wider">OUR JOURNEY</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                        The <span className="text-primary">Roadmap</span>
                    </h1>

                    <p className="text-xl text-muted max-w-3xl mx-auto mb-4">
                        From a community-driven financial engine to the universal oracle convergence layer.
                    </p>

                    <p className="text-muted max-w-2xl mx-auto">
                        Built transparently, governed democratically, rewarded meritocratically.
                    </p>
                </div>
            </Section>

            {/* Timeline Section */}
            <Section className="py-20">
                <div className="relative max-w-6xl mx-auto">
                    {/* Animated vertical line */}
                    <div className="timeline-line absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-purple-500 opacity-30" />

                    <div className="space-y-32">
                        {phases.map((phase, index) => {
                            const Icon = phase.icon;
                            const isEven = index % 2 === 0;

                            return (
                                <div
                                    key={index}
                                    className={`roadmap-item relative flex flex-col md:flex-row gap-8 ${isEven ? 'md:flex-row-reverse' : ''
                                        }`}
                                    onMouseEnter={() => setHoveredPhase(index)}
                                    onMouseLeave={() => setHoveredPhase(null)}
                                >
                                    {/* Timeline Node */}
                                    <div className="timeline-node absolute left-8 md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background border-4 border-primary z-20 shadow-[0_0_20px_rgba(0,255,157,0.6)]">
                                        <div className="absolute inset-0 rounded-full bg-primary/50 animate-ping" />
                                    </div>

                                    {/* Content */}
                                    <div className="ml-20 md:ml-0 md:w-1/2 px-4">
                                        <Card
                                            className={`relative overflow-hidden group transition-all duration-500 ${hoveredPhase === index ? 'scale-105 shadow-2xl' : ''
                                                } ${phase.borderColor}`}
                                        >
                                            {/* Background gradient */}
                                            <div
                                                className={`absolute inset-0 bg-gradient-to-br ${phase.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
                                            />

                                            {/* Icon background */}
                                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                                <Icon className="w-32 h-32" />
                                            </div>

                                            <div className="relative z-10">
                                                {/* Header */}
                                                <div className="flex items-start gap-4 mb-6">
                                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center border ${phase.borderColor} group-hover:scale-110 transition-transform`}>
                                                        <Icon className={`w-7 h-7 ${phase.iconColor}`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-primary mb-1 tracking-widest uppercase">
                                                            {phase.date}
                                                        </div>
                                                        <h3 className="text-2xl md:text-3xl font-bold mb-1">
                                                            {phase.title}
                                                        </h3>
                                                        <p className="text-sm text-muted">{phase.subtitle}</p>
                                                    </div>
                                                </div>

                                                {/* Items */}
                                                <ul className="space-y-3">
                                                    {phase.items.map((item, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-start gap-3 text-muted text-sm group/item hover:text-white transition-colors"
                                                        >
                                                            {item.done ? (
                                                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                                                            ) : (
                                                                <Circle className="w-4 h-4 mt-0.5 text-primary/50 flex-shrink-0 group-hover/item:text-primary transition-colors" />
                                                            )}
                                                            <span className="leading-relaxed">{item.text}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                {/* Progress indicator */}
                                                <div className="mt-6 pt-6 border-t border-white/5">
                                                    <div className="flex items-center justify-between text-xs mb-2">
                                                        <span className="text-muted">Progress</span>
                                                        <span className="font-bold text-primary">
                                                            {phase.items.filter((i) => i.done).length} /{' '}
                                                            {phase.items.length}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full bg-gradient-to-r ${phase.color} transition-all duration-500`}
                                                            style={{
                                                                width: `${(phase.items.filter((i) => i.done).length /
                                                                        phase.items.length) *
                                                                    100
                                                                    }%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Empty side for layout balance */}
                                    <div className="hidden md:block md:w-1/2" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Section>

            {/* Community Focus Section */}
            <Section className="py-20 bg-gradient-to-b from-primary/5 to-transparent border-y border-white/5">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">
                        Built <span className="text-primary">Together</span>
                    </h2>
                    <p className="text-muted max-w-2xl mx-auto">
                        Every phase is shaped by our community. Contributors are rewarded transparently,
                        decisions are made democratically, and success is shared meritocratically.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <Card className="text-center group hover:border-primary/30 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                            <Users className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Community-Driven</h3>
                        <p className="text-sm text-muted">
                            Every milestone includes community governance, contributor rewards, and transparent decision-making
                        </p>
                    </Card>

                    <Card className="text-center group hover:border-secondary/30 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                            <Zap className="w-8 h-8 text-secondary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Meritocratic Rewards</h3>
                        <p className="text-sm text-muted">
                            Quality contributions earn tokens, NFTs, and revenue share. Excellence is recognized and rewarded
                        </p>
                    </Card>

                    <Card className="text-center group hover:border-accent/30 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                            <Shield className="w-8 h-8 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Transparent Progress</h3>
                        <p className="text-sm text-muted">
                            All development, funding, and rewards are tracked on-chain. No hidden agendas, pure transparency
                        </p>
                    </Card>
                </div>
            </Section>
        </div>
    );
};

export default RoadmapPage;
