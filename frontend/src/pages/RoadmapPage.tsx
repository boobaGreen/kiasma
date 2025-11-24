import { useRef } from 'react';
import { Section, Card } from '../components/ui';
import { Circle, Clock } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RoadmapPage = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const items = gsap.utils.toArray('.roadmap-item');
        items.forEach((item: any) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                },
                x: -50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
            });
        });
    }, { scope: containerRef });

    const phases = [
        {
            title: 'Phase 1: The Foundation',
            date: 'Q1-Q2 2026',
            status: 'upcoming',
            items: [
                'Smart Contract Audit',
                'Arbitrum Deployment',
                '"Early Bird" Liquidity Event ($5M Cap)',
                'Security & TVL Growth Focus'
            ]
        },
        {
            title: 'Phase 2: The Expansion',
            date: 'Q3-Q4 2026',
            status: 'upcoming',
            items: [
                'Expand to 10+ Adapters',
                'First Governance Proposals to underlying protocols',
                'Focus on Governance & Lobbying'
            ]
        },
        {
            title: 'Phase 3: The Metamorphosis',
            date: '2027+',
            status: 'upcoming',
            items: [
                'Kiasma Router Beta (ZK-Proof integration)',
                'Mainnet Launch',
                'Activate Buyback & Burn',
                'Full Oracle Layer Transition'
            ]
        }
    ];

    return (
        <div ref={containerRef} className="overflow-hidden">
            <Section className="text-center pt-32 pb-12">
                <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                    The <span className="text-primary">Roadmap</span>
                </h1>
                <p className="text-xl text-muted max-w-2xl mx-auto">
                    Our path from a financial engine to the universal data router.
                </p>
            </Section>

            <Section>
                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-secondary/50 to-transparent" />

                    <div className="space-y-24">
                        {phases.map((phase, index) => (
                            <div key={index} className={`roadmap-item relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Timeline Node */}
                                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary z-10 shadow-[0_0_15px_rgba(0,255,157,0.5)]" />

                                {/* Content */}
                                <div className="ml-20 md:ml-0 md:w-1/2 px-4">
                                    <Card className="relative overflow-hidden group hover:border-primary/50 transition-colors">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Clock className="w-24 h-24" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="text-sm font-bold text-primary mb-2 tracking-wider uppercase">{phase.date}</div>
                                            <h3 className="text-2xl font-bold mb-4">{phase.title}</h3>
                                            <ul className="space-y-3">
                                                {phase.items.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-muted text-sm">
                                                        <Circle className="w-1.5 h-1.5 mt-1.5 fill-current text-primary/50" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Card>
                                </div>

                                {/* Empty side for layout balance */}
                                <div className="hidden md:block md:w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default RoadmapPage;
