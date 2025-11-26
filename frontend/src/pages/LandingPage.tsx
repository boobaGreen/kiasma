import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, Button, Card } from '../components/ui';
import { ArrowRight, Shield, Zap, Layers } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import contractAddresses from '../contract-addresses.json';

gsap.registerPlugin(ScrollTrigger);

const VAULT_ADDRESS = contractAddresses.KiasmaVault as `0x${string}`;
const VAULT_ABI = [
    {
        "inputs": [],
        "name": "totalAssets",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const LandingPage = () => {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const featuresRef = useRef(null);

    const { data: totalAssets } = useReadContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'totalAssets',
        query: { refetchInterval: 10000 }
    });

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(titleRef.current, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out',
        })
            .from('.hero-text', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
            }, '-=0.8')
            .from('.hero-btn', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'back.out(1.7)',
            }, '-=0.5');

        gsap.from('.feature-card', {
            scrollTrigger: {
                trigger: featuresRef.current,
                start: 'top 80%',
            },
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
        });
    }, []);

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <Section className="min-h-[90vh] flex flex-col justify-center items-center text-center relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] animate-spin-slow" />
                </div>

                <div ref={heroRef} className="relative z-10 max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 hero-text">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-medium text-primary tracking-wider">V3.0 DEFINITIVE EDITION</span>
                    </div>

                    <h1 ref={titleRef} className="text-6xl md:text-8xl font-display font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                        The Oracle<br />
                        <span className="text-primary">Convergence</span> Layer
                    </h1>

                    <p className="text-xl md:text-2xl text-muted mb-12 max-w-3xl mx-auto hero-text">
                        Where <span className="text-white font-bold">Real Data</span> Converges. Where Value Compounds.<br />
                        Invest in the infrastructure that powers the Blockchain.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 hero-text">
                        <Button size="lg" className="hero-btn group" onClick={() => navigate('/vault')}>
                            Launch App <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="lg" className="hero-btn" onClick={() => window.open('https://github.com/boobaGreen/kiasma', '_blank')}>
                            Read the Vision
                        </Button>
                    </div>
                </div>
            </Section>

            {/* Features Section */}
            <Section ref={featuresRef} className="py-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="feature-card group">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                            <Layers className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">The Financial Engine</h3>
                        <p className="text-muted leading-relaxed">
                            An algorithmically managed ERC-4626 Vault. We aggregate top-tier oracle assets to generate passive, optimized yield while accumulating lobbying power.
                        </p>
                    </Card>

                    <Card className="feature-card group">
                        <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                            <Zap className="w-6 h-6 text-secondary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Programmable Layer</h3>
                        <p className="text-muted leading-relaxed">
                            The "1inch of Data". We route data requests to the best provider at the best price, secured by Zero-Knowledge Proofs.
                        </p>
                    </Card>

                    <Card className="feature-card group">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                            <Shield className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Multi-Oracle Security</h3>
                        <p className="text-muted leading-relaxed">
                            We aggregate multiple oracles for our data and calculations to ensure maximum security and integrity. Real data, real value.
                        </p>
                    </Card>
                </div>
            </Section>

            {/* Community Opportunities Section */}
            <Section className="py-32 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent pointer-events-none" />

                <div className="relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-sm font-medium text-primary tracking-wider">PEOPLE-FIRST APPROACH</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
                            Built <span className="text-primary">By the Community</span>,<br />
                            For the Community
                        </h2>

                        <p className="text-xl text-muted max-w-3xl mx-auto">
                            Inspired by <span className="text-white font-bold">Olivetti's philosophy</span>, we believe in democracy,
                            meritocracy, and transparent compensation. Every contribution—from design to development,
                            marketing to moderation—is valued and rewarded fairly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <Card className="group hover:border-primary/30 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <Layers className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Open Opportunities</h3>
                            <p className="text-muted text-sm leading-relaxed">
                                Design, development, marketing, security, moderation, governance—we need talented people across all disciplines.
                                Opportunities are transparent and accessible to everyone.
                            </p>
                        </Card>

                        <Card className="group hover:border-secondary/30 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                                <Zap className="w-6 h-6 text-secondary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Meritocratic Rewards</h3>
                            <p className="text-muted text-sm leading-relaxed">
                                Your work is evaluated transparently by the community. Quality contributions earn tokens,
                                NFTs, and even revenue share through special "Angel Contributor" NFTs.
                            </p>
                        </Card>

                        <Card className="group hover:border-accent/30 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                                <Shield className="w-6 h-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Democratic Governance</h3>
                            <p className="text-muted text-sm leading-relaxed">
                                Every voice matters. Contributors participate in decision-making through transparent,
                                on-chain governance. Build influence through consistent, quality work.
                            </p>
                        </Card>
                    </div>

                    <div className="text-center">
                        <Button size="lg" className="group" onClick={() => navigate('/community')}>
                            Explore Opportunities <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </Section>

            {/* Stats Section */}
            <Section className="py-20 border-y border-white/5 bg-surface/30">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {[
                        { label: 'Total Value Locked', value: totalAssets ? `${parseFloat(formatEther(totalAssets as bigint)).toFixed(2)} ETH` : '$0.00' },
                        { label: 'APY', value: '12.5%' },
                        { label: 'Oracle Assets', value: '3' },
                        { label: 'Networks', value: 'Arbitrum' },
                    ].map((stat, i) => (
                        <div key={i}>
                            <div className="text-4xl font-bold text-white mb-2 font-display">{stat.value}</div>
                            <div className="text-sm text-muted uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default LandingPage;
