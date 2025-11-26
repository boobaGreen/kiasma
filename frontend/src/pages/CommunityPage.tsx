import { useRef } from 'react';
import { Section, Card, Button } from '../components/ui';

import { Users, Briefcase, Heart, TrendingUp, Code, Palette, Shield, MessageSquare, Vote, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CommunityPage = () => {
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

        const cards = gsap.utils.toArray('.opportunity-card');
        cards.forEach((card: any) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
            });
        });
    }, { scope: containerRef });

    const opportunities = [
        {
            icon: Palette,
            title: 'Design & Creative',
            description: 'UI/UX design, graphic design, branding, NFT art, visual storytelling',
            color: 'from-purple-500/20 to-pink-500/20',
            borderColor: 'border-purple-500/20',
            iconColor: 'text-purple-400'
        },
        {
            icon: Code,
            title: 'Development',
            description: 'Smart contracts, frontend development, tooling, integrations, testing',
            color: 'from-primary/20 to-secondary/20',
            borderColor: 'border-primary/20',
            iconColor: 'text-primary'
        },
        {
            icon: Briefcase,
            title: 'Marketing & Growth',
            description: 'Content creation, social media, community building, partnerships, storytelling',
            color: 'from-blue-500/20 to-cyan-500/20',
            borderColor: 'border-blue-500/20',
            iconColor: 'text-blue-400'
        },
        {
            icon: Shield,
            title: 'Security & Auditing',
            description: 'Smart contract auditing, security research, bug bounties, risk assessment',
            color: 'from-red-500/20 to-orange-500/20',
            borderColor: 'border-red-500/20',
            iconColor: 'text-red-400'
        },
        {
            icon: MessageSquare,
            title: 'Moderation & Support',
            description: 'Discord/forum moderation, user support, documentation, community management',
            color: 'from-green-500/20 to-emerald-500/20',
            borderColor: 'border-green-500/20',
            iconColor: 'text-green-400'
        },
        {
            icon: Vote,
            title: 'Governance & Strategy',
            description: 'Proposal creation, voting, strategic planning, DAO operations, organization',
            color: 'from-yellow-500/20 to-amber-500/20',
            borderColor: 'border-yellow-500/20',
            iconColor: 'text-yellow-400'
        }
    ];

    return (
        <div ref={containerRef} className="overflow-hidden">
            {/* Hero Section */}
            <Section className="text-center pt-32 pb-20">
                <div className="reveal-section">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <Heart className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-sm font-medium text-primary tracking-wider">PEOPLE-FIRST PHILOSOPHY</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                        Build <span className="text-primary">With Us</span>
                    </h1>

                    <p className="text-xl text-muted max-w-3xl mx-auto mb-8">
                        Inspired by <span className="text-white font-bold">Adriano Olivetti's</span> philosophy:
                        we believe in putting people first, transparent meritocracy, and democratic governance.
                    </p>

                    <p className="text-lg text-muted max-w-2xl mx-auto">
                        Every contribution matters. Every voice is heard. Every contributor is fairly compensated.
                    </p>
                </div>
            </Section>

            {/* Philosophy Section */}
            <Section className="reveal-section bg-surface/30 border-y border-white/5">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Our Philosophy</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="text-center">
                            <Users className="w-10 h-10 text-primary mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Democracy</h3>
                            <p className="text-sm text-muted">
                                Decisions are made collectively. Every contributor has a voice in shaping the project's future.
                            </p>
                        </Card>

                        <Card className="text-center">
                            <TrendingUp className="w-10 h-10 text-secondary mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Meritocracy</h3>
                            <p className="text-sm text-muted">
                                Your impact determines your influence. Quality work is recognized and rewarded transparently.
                            </p>
                        </Card>

                        <Card className="text-center">
                            <Heart className="w-10 h-10 text-accent mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Transparency</h3>
                            <p className="text-sm text-muted">
                                All contributions, evaluations, and rewards are visible on-chain. No hidden agendas.
                            </p>
                        </Card>
                    </div>
                </div>
            </Section>

            {/* Opportunities Section */}
            <Section className="reveal-section">
                <h2 className="text-4xl font-bold mb-4 text-center">Contribution Opportunities</h2>
                <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
                    We need talented people across all disciplines. Whether you're a designer, developer, marketer,
                    or community builder—there's a place for you in Kiasma.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opportunities.map((opp, index) => {
                        const Icon = opp.icon;
                        return (
                            <Card key={index} className={`opportunity-card group hover:border-opacity-50 ${opp.borderColor} relative overflow-hidden`}>
                                <div className={`absolute inset-0 bg-gradient-to-br ${opp.color} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                                        <Icon className={`w-6 h-6 ${opp.iconColor}`} />
                                    </div>

                                    <h3 className="text-xl font-bold mb-3">{opp.title}</h3>
                                    <p className="text-sm text-muted leading-relaxed">{opp.description}</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </Section>

            {/* How It Works Section */}
            <Section className="reveal-section bg-surface/30 border-y border-white/5">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>

                    <div className="space-y-8">
                        <div className="flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                                <span className="text-xl font-bold text-primary">1</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Join the Community</h3>
                                <p className="text-muted">
                                    Connect with us on Discord or GitHub. Introduce yourself and explore current opportunities.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 border border-secondary/20">
                                <span className="text-xl font-bold text-secondary">2</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Start Contributing</h3>
                                <p className="text-muted">
                                    Pick a task that matches your skills. Submit your work for community review. All contributions are tracked transparently.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 border border-accent/20">
                                <span className="text-xl font-bold text-accent">3</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Get Evaluated & Rewarded</h3>
                                <p className="text-muted">
                                    Your work is reviewed by the community using transparent criteria. Quality contributions earn you rewards in tokens, NFTs, or revenue share.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                                <span className="text-xl font-bold text-primary">4</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Grow Your Influence</h3>
                                <p className="text-muted">
                                    Consistent, high-quality contributions increase your governance power. Top contributors can earn special "Angel NFTs" with revenue share benefits.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Angel NFT Section */}
            <Section className="reveal-section">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Angel Contributor NFTs</h2>
                    <p className="text-muted mb-8 max-w-2xl mx-auto">
                        Exceptional contributors who help build Kiasma from the ground up can earn special <span className="text-white font-bold">Angel NFTs</span>.
                        These NFTs grant permanent revenue share from protocol fees and enhanced governance rights.
                    </p>

                    <Card className="border-primary/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 blur-[80px]" />

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-primary mb-2">% TBD</div>
                                <div className="text-sm text-muted">Protocol Revenue Share</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-secondary mb-2">Limited</div>
                                <div className="text-sm text-muted">Supply (Earned Only)</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-accent mb-2">Forever</div>
                                <div className="text-sm text-muted">Lifetime Benefits</div>
                            </div>
                        </div>
                    </Card>

                    <p className="text-sm text-muted mt-6">
                        <span className="text-primary">*</span> Revenue share percentage and distribution criteria will be decided democratically by the community.
                    </p>
                </div>
            </Section>

            {/* CTA Section */}
            <Section className="reveal-section text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6">Ready to Build the Future?</h2>
                    <p className="text-muted mb-8">
                        Join a community that values your work, respects your voice, and rewards your contributions fairly.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Button size="lg" className="group" onClick={() => window.open('https://discord.gg/kiasma', '_blank')}>
                            Join Discord <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => window.open('https://github.com/boobaGreen/kiasma', '_blank')}>
                            View on GitHub
                        </Button>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default CommunityPage;
