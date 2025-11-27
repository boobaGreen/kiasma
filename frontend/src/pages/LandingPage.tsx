import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, Button } from '../components/ui';
import { Layers, Zap, Shield, ArrowRight } from 'lucide-react';
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
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    const { data: totalAssets } = useReadContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'totalAssets',
        query: { refetchInterval: 10000 }
    });

    // Kinetic Line Animation (Shared Logic with AboutPage)
    useGSAP(() => {
        const svg = svgRef.current;
        const path = pathRef.current;
        if (!svg || !path) return;

        let points: { x: number, y: number }[] = [];
        const numPoints = 25;
        const friction = 0.25;
        const spring = 0.05;

        // Initialize points off-screen or at center
        for (let i = 0; i < numPoints; i++) {
            points.push({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        }

        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('mousemove', onMouseMove);

        const update = () => {
            // Move first point to mouse
            points[0].x += (mouse.x - points[0].x) * friction;
            points[0].y += (mouse.y - points[0].y) * friction;

            // Move subsequent points
            for (let i = 1; i < numPoints; i++) {
                points[i].x += (points[i - 1].x - points[i].x) * spring;
                points[i].y += (points[i - 1].y - points[i].y) * spring;
            }

            // Draw curve
            let d = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < numPoints - 1; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2;
                const yc = (points[i].y + points[i + 1].y) / 2;
                d += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
            }
            d += ` T ${points[numPoints - 1].x} ${points[numPoints - 1].y}`;

            path.setAttribute('d', d);
            requestAnimationFrame(update);
        };

        update();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, { scope: containerRef });

    // Entrance Animations
    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from('.hero-char', {
            y: 100,
            opacity: 0,
            stagger: 0.05,
            duration: 1,
            ease: 'power4.out'
        })
            .from('.hero-shape', {
                scale: 0,
                rotation: 180,
                opacity: 0,
                duration: 1.5,
                stagger: 0.2,
                ease: 'elastic.out(1, 0.5)'
            }, '-=0.8');

        // Suspended Shapes Interaction
        gsap.utils.toArray('.suspended-shape').forEach((shape: any, i) => {
            const depth = (i + 1) * 0.1;
            const moveShape = (e: MouseEvent) => {
                const x = (e.clientX - window.innerWidth / 2) * depth;
                const y = (e.clientY - window.innerHeight / 2) * depth;
                gsap.to(shape, { x, y, duration: 1, ease: 'power2.out' });
            };
            window.addEventListener('mousemove', moveShape);
            return () => window.removeEventListener('mousemove', moveShape);
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-ink overflow-hidden relative cursor-none">
            {/* Custom Cursor Hint */}
            <div className="fixed top-4 right-4 z-50 pointer-events-none mix-blend-difference text-white font-mono text-xs">
                // KINETIC_GATEWAY_ACTIVE
            </div>

            {/* Kinetic Line SVG Layer */}
            <svg ref={svgRef} className="fixed inset-0 w-full h-full pointer-events-none z-20" style={{ mixBlendMode: 'multiply' }}>
                <path
                    ref={pathRef}
                    fill="none"
                    stroke="#D1462F"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-90"
                />
            </svg>

            {/* Hero Section */}
            <div className="relative min-h-screen flex flex-col justify-center items-center pt-20 pb-20">

                {/* Suspended Shapes Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="suspended-shape absolute top-[15%] left-[10%] w-32 h-32 bg-secondary/20 rounded-full mix-blend-multiply"></div>
                    <div className="suspended-shape absolute bottom-[20%] right-[15%] w-48 h-48 border-4 border-primary/20 rotate-45"></div>
                    <div className="suspended-shape absolute top-[40%] right-[30%] w-24 h-24 bg-ink/5 rounded-full"></div>
                </div>

                <div className="relative z-10 text-center max-w-5xl px-6">
                    <h1 className="text-7xl md:text-9xl font-display font-bold leading-[0.8] tracking-tighter mb-8 mix-blend-darken">
                        {['T', 'H', 'E', ' ', 'O', 'R', 'A', 'C', 'L', 'E'].map((char, i) => (
                            <span key={i} className="hero-char inline-block">{char === ' ' ? '\u00A0' : char}</span>
                        ))}
                        <br />
                        <span className="text-primary block mt-2">
                            {['M', 'A', 'C', 'H', 'I', 'N', 'E'].map((char, i) => (
                                <span key={i} className="hero-char inline-block">{char}</span>
                            ))}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl font-mono text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
                        Precision data infrastructure for the decentralized age.
                        <br />
                        <span className="text-sm opacity-60 mt-2 block">// SYSTEM V3.0 READY</span>
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <Button
                            size="lg"
                            className="bg-ink text-background hover:bg-primary hover:text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all text-xl px-12 py-8"
                            onClick={() => navigate('/vault')}
                        >
                            INITIATE SEQUENCE
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-ink text-ink hover:bg-secondary hover:text-white hover:border-secondary shadow-[8px_8px_0px_0px_rgba(0,155,119,0.2)] hover:shadow-none text-xl px-12 py-8"
                            onClick={() => window.open('https://github.com/boobaGreen/kiasma', '_blank')}
                        >
                            READ MANUAL
                        </Button>
                    </div>
                </div>
            </div>

            {/* Vision & Principles: Olivetti Inspiration */}
            <Section className="py-24 relative z-10 bg-surface border-y border-ink">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="text-primary font-mono font-bold mb-4">// THE_PHILOSOPHY</div>
                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">COMMUNITY-FIRST INFRASTRUCTURE</h2>
                    <p className="text-xl font-mono text-muted leading-relaxed">
                        Inspired by the vision of <span className="text-ink font-bold">Adriano Olivetti</span>.
                        We believe that technology should serve humanity, not the other way around.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "PEOPLE > PROFIT", desc: "The well-being of our contributors is fundamental to our success." },
                        { title: "RADICAL DEMOCRACY", desc: "Every voice is heard. Decisions are made by the community, for the community." },
                        { title: "TRANSPARENT MERITOCRACY", desc: "Talent and effort determine influence, not capital. Rewards are open and verifiable." },
                        { title: "FAIR COMPENSATION", desc: "We pay with what we have: Equity for believers, Revenue for the long game." }
                    ].map((item, i) => (
                        <div key={i} className="p-6 border border-ink/20 hover:border-ink transition-colors bg-background">
                            <div className="font-mono text-xs font-bold text-primary mb-2">0{i + 1}</div>
                            <h3 className="text-lg font-bold font-display mb-3">{item.title}</h3>
                            <p className="text-sm font-mono text-muted">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Problem/Solution: Fragmentation vs Convergence */}
            <Section className="py-24 relative z-10 bg-background">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                    <div className="p-8 border-l-4 border-primary bg-surface shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-2xl font-bold font-display mb-4">01. FRAGMENTATION</h3>
                        <p className="font-mono text-sm leading-relaxed text-muted">
                            The current state of the Oracle Sector is a tangled mess of disconnected nodes.
                            High fees, siloed data, and broken user experiences.
                        </p>
                    </div>

                    <div className="p-8 border-l-4 border-ink bg-surface shadow-sm hover:shadow-md transition-shadow md:translate-y-12">
                        <h3 className="text-2xl font-bold font-display mb-4">02. CONVERGENCE</h3>
                        <p className="font-mono text-sm leading-relaxed text-muted">
                            Kiasma acts as the lens. We aggregate, optimize, and route data through a single,
                            unified interface. The chaos becomes clarity.
                        </p>
                    </div>
                </div>
            </Section>

            {/* Product Spotlight: The Oracle Basket */}
            <Section className="py-24 relative z-10 bg-surface border-y border-ink">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="text-primary font-mono font-bold mb-4">// THE_PRODUCT</div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">THE ORACLE BASKET</h2>
                        <p className="font-mono text-lg opacity-80 mb-8">
                            We don't just aggregate data. We aggregate value.
                            Our core product is an ERC4626 Vault representing a curated index of the top Oracle protocols.
                        </p>
                        <ul className="space-y-4 font-mono text-sm">
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span>Top 10 Oracle Tokens (LINK, BAND, API3...)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                                <span>Automated Rebalancing & Thresholds</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-ink rounded-full"></div>
                                <span>Native Staking Yield Optimization</span>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Button onClick={() => navigate('/vault')} className="bg-ink text-white hover:bg-primary transition-colors">
                                EXPLORE VAULT <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="relative flex justify-center">
                        <div className="aspect-square w-full max-w-md border-4 border-ink/10 rounded-full flex items-center justify-center animate-spin-slow bg-background">
                            <div className="w-2/3 h-2/3 border-4 border-primary/20 rounded-full flex items-center justify-center">
                                <div className="w-1/2 h-1/2 bg-ink/5 backdrop-blur-md rounded-full flex items-center justify-center border border-ink/10">
                                    <Layers className="w-12 h-12 text-ink" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Features Section */}
            <Section className="py-32 border-t border-ink/10 relative z-10 bg-background">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        {
                            icon: Layers,
                            title: "FINANCIAL ENGINE",
                            desc: "An algorithmically managed ERC-4626 Vault. Aggregating top-tier oracle assets to generate passive, optimized yield.",
                            color: "text-primary",
                            borderColor: "border-primary"
                        },
                        {
                            icon: Zap,
                            title: "PROGRAMMABLE LAYER",
                            desc: "The '1inch of Data'. Routing requests to the best provider at the best price, secured by Zero-Knowledge Proofs.",
                            color: "text-secondary",
                            borderColor: "border-secondary"
                        },
                        {
                            icon: Shield,
                            title: "MULTI-ORACLE SECURITY",
                            desc: "Aggregating multiple oracles for our data and calculations to ensure maximum security and integrity.",
                            color: "text-accent",
                            borderColor: "border-accent"
                        }
                    ].map((feature, i) => (
                        <div key={i} className="group relative p-8 border-2 border-ink bg-surface hover:-translate-y-2 transition-transform duration-300">
                            <div className={`absolute top-0 left-0 w-full h-2 ${feature.borderColor.replace('border', 'bg')}`}></div>
                            <feature.icon className={`w-12 h-12 mb-6 ${feature.color}`} strokeWidth={1.5} />
                            <h3 className="text-2xl font-display font-bold mb-4">{feature.title}</h3>
                            <p className="font-mono text-sm leading-relaxed text-muted">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Stats Band */}
            <div className="bg-ink text-background py-20 border-y-8 border-secondary relative z-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
                    {[
                        { label: 'TVL', value: totalAssets ? `${parseFloat(formatEther(totalAssets as bigint)).toFixed(2)} ETH` : '$0.00' },
                        { label: 'APY', value: '12.5%' },
                        { label: 'ASSETS', value: '3' },
                        { label: 'NET', value: 'ARB' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-5xl md:text-6xl font-display font-bold mb-2">{stat.value}</div>
                            <div className="text-sm font-mono tracking-widest opacity-50 border-t border-white/20 pt-2 inline-block px-4">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Community CTA */}
            <Section className="py-32 text-center relative z-10">
                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute -top-10 -left-10 w-20 h-20 border-t-4 border-l-4 border-primary"></div>
                    <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-4 border-r-4 border-secondary"></div>

                    <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
                        BUILT BY <span className="text-secondary">MERIT</span>.<br />
                        GOVERNED BY <span className="text-primary">YOU</span>.
                    </h2>

                    <p className="text-xl text-muted mb-12 font-mono max-w-2xl mx-auto">
                        Inspired by the Olivetti philosophy. Democracy, meritocracy, and transparent compensation.
                    </p>

                    <Button size="lg" className="bg-primary text-white hover:bg-ink hover:text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all text-xl px-12 py-6" onClick={() => navigate('/community')}>
                        JOIN THE WORKFORCE <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                </div>
            </Section>

        </div >
    );
};

export default LandingPage;
