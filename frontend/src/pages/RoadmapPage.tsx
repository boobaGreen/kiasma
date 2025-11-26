import { useRef } from 'react';
import { Section, Card } from '../components/ui';
import { CheckCircle2, Circle, Hammer, Rocket, Search, Settings, ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';

gsap.registerPlugin(ScrollTrigger);

const RoadmapPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // Initial Header Animation
        tl.from('.header-char', {
            y: -50,
            opacity: 0,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            duration: 1
        });

        // The Conveyor Belt Line Animation
        // The line grows as you scroll
        gsap.fromTo(lineRef.current,
            { height: '0%' },
            {
                height: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                }
            }
        );

        // Phase Cards Animation
        const phases = gsap.utils.toArray('.phase-card');
        phases.forEach((phase: any, i) => {
            // Card Entrance
            gsap.from(phase, {
                scrollTrigger: {
                    trigger: phase,
                    start: 'top 80%',
                    end: 'top 50%',
                    toggleActions: 'play none none reverse'
                },
                x: i % 2 === 0 ? -100 : 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            // Connector Line Animation
            gsap.from(phase.querySelector('.connector'), {
                scrollTrigger: {
                    trigger: phase,
                    start: 'top 80%'
                },
                scaleX: 0,
                transformOrigin: i % 2 === 0 ? 'right center' : 'left center',
                duration: 0.5,
                delay: 0.2
            });
        });

        // "Construction" Icons Rotation
        gsap.to('.gear-icon', {
            rotation: 360,
            repeat: -1,
            duration: 10,
            ease: 'none'
        });

    }, { scope: containerRef });

    const phases = [
        {
            id: "01",
            title: "THE GARAGE (0-6M)",
            status: "completed",
            icon: Search,
            desc: "Bootstrapped by Founder & Angel Contributors. Zero Initial Capital.",
            items: [
                "Capital: Founder + Angel Contributors (Work for Equity)",
                "Workforce: Dev, Marketing, Community (Equity-based)",
                "Distribution: 50% Founder, 30% Angels, 20% Treasury",
                "Milestone: Whitepaper & Genesis Community"
            ]
        },
        {
            id: "02",
            title: "THE FACTORY (6-18M)",
            status: "in-progress",
            icon: Hammer,
            desc: "Expansion phase. External Angels and First Revenue.",
            items: [
                "Capital: External Angel Investors (NFT Sales)",
                "Workforce: Team paid in Tokens/Stablecoins",
                "Distribution: Founder quota reduces to 35%",
                "Milestone: Frontend V1 & Staking Vault Deployment"
            ]
        },
        {
            id: "03",
            title: "THE NETWORK (18-36M+)",
            status: "upcoming",
            icon: Rocket,
            desc: "Scalability and Sustainability. Revenue-driven growth.",
            items: [
                "Capital: Protocol Revenue & Institutional Partners",
                "Workforce: Sustainable payments from Revenue",
                "Distribution: Controlled Emission & Staking Rewards",
                "Milestone: Mainnet Launch & DAO Governance"
            ]
        },
        {
            id: "04",
            title: "EXPANSION",
            status: "upcoming",
            icon: Settings,
            desc: "Cross-chain integration and advanced features.",
            items: ["L2 Scaling Solutions", "Cross-chain Bridge", "Advanced Analytics Suite", "Mobile App Beta"]
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-ink pt-24 pb-20 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-5"
                style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <Section className="relative z-10 text-center pt-12 pb-24">
                <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 flex justify-center gap-2">
                    {['T', 'H', 'E', '_', 'P', 'L', 'A', 'N'].map((char, i) => (
                        <span key={i} className="header-char inline-block">{char === '_' ? '\u00A0' : char}</span>
                    ))}
                </h1>
                <p className="text-xl font-mono text-muted max-w-2xl mx-auto">
                    // SYSTEM_STATUS: ASSEMBLY_IN_PROGRESS
                    <br />
                    Constructing the future of decentralized data.
                </p>
                <div className="mt-8 animate-bounce">
                    <ArrowDown className="w-8 h-8 mx-auto text-primary" />
                </div>
            </Section>

            <div className="relative max-w-5xl mx-auto px-4 pb-40">
                {/* Central Conveyor Belt Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-ink/10 -translate-x-1/2">
                    <div ref={lineRef} className="w-full bg-primary shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                </div>

                {phases.map((phase, index) => (
                    <div key={index} className={clsx(
                        "phase-card relative mb-24 md:mb-40 flex flex-col md:flex-row items-center w-full",
                        index % 2 === 0 ? "md:flex-row-reverse" : ""
                    )}>
                        {/* Spacer for the other side */}
                        <div className="flex-1 hidden md:block"></div>

                        {/* Central Node */}
                        <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-12 h-12 bg-background border-4 border-ink rounded-full flex items-center justify-center z-10 shadow-[4px_4px_0_#1a1a1a]">
                            {phase.status === 'completed' ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : phase.status === 'in-progress' ? (
                                <Settings className="gear-icon w-6 h-6 text-primary" />
                            ) : (
                                <Circle className="w-6 h-6 text-muted" />
                            )}
                        </div>

                        {/* Content Card */}
                        <div className={clsx(
                            "flex-1 w-full pl-12 md:pl-0",
                            index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                        )}>
                            <div className="connector absolute top-6 h-1 bg-ink w-8 md:w-16 hidden md:block"
                                style={{
                                    [index % 2 === 0 ? 'right' : 'left']: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                            ></div>

                            <Card className={clsx(
                                "relative p-8 border-2 border-ink bg-surface shadow-[8px_8px_0_#1a1a1a] hover:translate-y-[-4px] transition-transform duration-300",
                                phase.status === 'in-progress' ? "border-primary" : ""
                            )}>
                                <div className="absolute -top-4 -right-4 bg-ink text-white px-3 py-1 font-mono text-xs font-bold shadow-sm">
                                    PHASE_{phase.id}
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className={clsx(
                                        "w-12 h-12 rounded-full border-2 border-ink flex items-center justify-center",
                                        phase.status === 'in-progress' ? "bg-primary text-ink" : "bg-ink/5 text-ink"
                                    )}>
                                        <phase.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-display font-bold">{phase.title}</h3>
                                        <span className={clsx(
                                            "text-xs font-mono font-bold uppercase px-2 py-0.5 border border-ink/20",
                                            phase.status === 'completed' ? "bg-green-100 text-green-700" :
                                                phase.status === 'in-progress' ? "bg-orange-100 text-orange-700" :
                                                    "bg-gray-100 text-gray-500"
                                        )}>
                                            {phase.status}
                                        </span>
                                    </div>
                                </div>

                                <p className="font-mono text-sm text-muted mb-6 border-b border-ink/10 pb-4">
                                    {phase.desc}
                                </p>

                                <ul className="space-y-2">
                                    {phase.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 font-mono text-sm">
                                            <span className="text-primary mt-1">&gt;</span>
                                            <span className={phase.status === 'completed' ? "line-through opacity-50" : ""}>
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoadmapPage;
