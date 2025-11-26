import { useRef } from 'react';
import { Section, Card } from '../components/ui';
import { Brain, Database, TrendingUp, Lock, Network, Share2, ArrowRight } from 'lucide-react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const sections = gsap.utils.toArray('.reveal-section');
        sections.forEach((section: any) => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
            });
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="overflow-hidden">
            <Section className="text-center pt-32 pb-20">
                <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 reveal-section">
                    The <span className="text-primary">Vision</span>
                </h1>
                <p className="text-xl text-muted max-w-3xl mx-auto reveal-section">
                    In the human brain, the Optic Chiasm is where optic nerves cross to create a single, perfect vision.
                    In the Blockchain, <span className="text-white font-bold">Kiasma</span> is where the fragmented Oracle Sector converges.
                </p>
            </Section>

            <Section className="reveal-section">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">The Problem: Fragmentation</h2>
                        <p className="text-muted mb-6 leading-relaxed">
                            The Oracle Sector is the nervous system of crypto, feeding data to DeFi and RWAs. Yet, for investors and developers, it is broken: fragmented, expensive, and complex.
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Owning the "Oracle Narrative" requires managing 10+ tokens.',
                                'Running nodes is technical and capital intensive.',
                                'Prohibitive gas fees for rebalancing portfolios.',
                                '"Vendor lock-in" forces dApps to choose one oracle.'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-muted">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-[80px] rounded-full" />
                        <Card className="relative border-red-500/20">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-lg text-center">
                                    <Database className="w-8 h-8 text-red-400 mx-auto mb-2" />
                                    <div className="text-sm font-bold">Fragmented Data</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg text-center">
                                    <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                    <div className="text-sm font-bold">High Fees</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg text-center">
                                    <Lock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                    <div className="text-sm font-bold">Vendor Lock-in</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg text-center">
                                    <Network className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                                    <div className="text-sm font-bold">Complex UX</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Section>

            <Section className="reveal-section">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-[80px] rounded-full" />
                        <Card className="relative border-primary/20">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-lg text-center">
                                    <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
                                    <div className="text-sm font-bold">Unified Vision</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg text-center">
                                    <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                    <div className="text-sm font-bold">Optimized Yield</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg text-center">
                                    <Share2 className="w-8 h-8 text-secondary mx-auto mb-2" />
                                    <div className="text-sm font-bold">Data Routing</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg text-center">
                                    <Lock className="w-8 h-8 text-accent mx-auto mb-2" />
                                    <div className="text-sm font-bold">ZK Security</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-3xl font-bold mb-6">The Solution: Convergence</h2>
                        <p className="text-muted mb-6 leading-relaxed">
                            Kiasma is not just a fund; it is a Trojan Horse that enters the market as liquidity and evolves into infrastructure.
                        </p>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Phase 1: The Financial Engine</h3>
                                <p className="text-sm text-muted">
                                    A decentralized ERC-4626 Vault that aggregates top-tier oracle assets. It abstracts away complexity to generate passive, optimized yield for investors.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Phase 2: The Programmable Layer</h3>
                                <p className="text-sm text-muted">
                                    Leveraging accumulated influence, Kiasma launches the Universal Data Router—an "Oracle Aggregator" that routes data requests to the best provider.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Why Real Data Matters</h3>
                                <p className="text-sm text-muted">
                                    Web3 needs real value, and real value comes from real data. We use <span className="text-white">multiple oracles</span> for our data and calculations to ensure absolute security and integrity. No single point of failure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Community Philosophy Section - Olivetti Inspired */}
            <Section className="reveal-section bg-gradient-to-b from-primary/5 to-transparent border-y border-white/5">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-medium text-primary tracking-wider">CORE PHILOSOPHY</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-6">
                        People <span className="text-primary">First</span>
                    </h2>
                    <p className="text-muted max-w-3xl mx-auto mb-8">
                        Inspired by <span className="text-white font-bold">Adriano Olivetti</span>, we believe technology should serve humanity,
                        not the other way around. Kiasma is built on the principles of <span className="text-primary">democracy</span>,
                        <span className="text-secondary"> meritocracy</span>, and <span className="text-accent">transparency</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <Card className="border-primary/20">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Share2 className="w-5 h-5 text-primary" />
                            </div>
                            Democratic Governance
                        </h3>
                        <p className="text-muted leading-relaxed mb-4">
                            Every major decision is made collectively by the community. Contributors vote on proposals,
                            roadmap priorities, and protocol upgrades. Your voice matters, regardless of your investment size.
                        </p>
                        <ul className="space-y-2 text-sm text-muted">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                                On-chain voting for transparency
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                                Community-driven roadmap
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                                Open proposal system
                            </li>
                        </ul>
                    </Card>

                    <Card className="border-secondary/20">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-secondary" />
                            </div>
                            Meritocratic Rewards
                        </h3>
                        <p className="text-muted leading-relaxed mb-4">
                            Your contributions—not your capital—determine your influence and rewards.
                            Quality work in design, development, marketing, security, and governance is recognized and compensated fairly.
                        </p>
                        <ul className="space-y-2 text-sm text-muted">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5" />
                                Transparent evaluation criteria
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5" />
                                Fair compensation for all roles
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5" />
                                Angel NFTs for exceptional contributors
                            </li>
                        </ul>
                    </Card>
                </div>

                <div className="text-center">
                    <p className="text-lg text-muted mb-6 max-w-2xl mx-auto">
                        <span className="text-white font-bold">We're building more than a protocol</span>—we're creating a
                        community where talent is discovered, nurtured, and rewarded. Where everyone has the opportunity
                        to contribute and earn, from the ground up.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <a
                            href="/community"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-background font-bold hover:bg-primary/90 transition-colors"
                        >
                            Explore Opportunities <ArrowRight className="ml-2 w-5 h-5" />
                        </a>
                        <a
                            href="https://github.com/boobaGreen/kiasma"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/10 hover:border-primary/50 transition-colors"
                        >
                            Read the Vision
                        </a>
                    </div>
                </div>
            </Section>
        </div>

    );
};

export default AboutPage;
