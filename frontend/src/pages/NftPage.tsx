import { useRef } from 'react';
import { Section, Card, Button } from '../components/ui';
import { Diamond, ShieldCheck, Zap, Crown, Coins, Vote, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const NftPage = () => {
    const containerRef = useRef(null);
    const cardRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from('.hero-text', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
        })
            .from(cardRef.current, {
                y: 50,
                opacity: 0,
                duration: 1.5,
                ease: 'power3.out',
            }, '-=0.8');

        gsap.to('.nft-glow', {
            opacity: 0.6,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

        gsap.from('.benefit-card', {
            scrollTrigger: {
                trigger: '.benefits-grid',
                start: 'top 80%',
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
        });
    }, { scope: containerRef });

    const benefits = [
        {
            icon: <ShieldCheck className="w-8 h-8 text-primary" />,
            title: "0% Management Fees",
            description: "Lifetime waiver on all Vault deposits. For a $100k position, this saves $500/year forever.",
            color: "border-primary/20 bg-primary/5"
        },
        {
            icon: <Coins className="w-8 h-8 text-secondary" />,
            title: "Revenue Share",
            description: "The collection receives 20% of all Protocol Performance Fees. The NFT pays you a salary.",
            color: "border-secondary/20 bg-secondary/5"
        },
        {
            icon: <Vote className="w-8 h-8 text-accent" />,
            title: "Governance Council",
            description: "Veto power on critical security upgrades. Exclusive access to the 'Alpha Channel' with devs.",
            color: "border-accent/20 bg-accent/5"
        },
        {
            icon: <Zap className="w-8 h-8 text-yellow-400" />,
            title: "Yield Boost",
            description: "1.2x - 1.5x Multiplier on governance rewards when the Data Router goes live.",
            color: "border-yellow-400/20 bg-yellow-400/5"
        }
    ];

    return (
        <div ref={containerRef} className="overflow-hidden">
            {/* Hero Section */}
            <Section className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-center gap-16 pt-32">
                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 hero-text">
                        <Crown className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-primary tracking-wider">ANGEL ROUND</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 hero-text">
                        Genesis <span className="text-primary">Synapse</span>
                    </h1>

                    <p className="text-xl text-muted mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 hero-text">
                        Not just art. A seat at the table. <br />
                        Fund the protocol launch and secure lifetime utilities that compound with Kiasma's success.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start hero-text">
                        <Button size="lg" className="group">
                            Mint Synapse <Sparkles className="ml-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
                        </Button>
                        <Button variant="outline" size="lg">
                            Read Manifesto
                        </Button>
                    </div>

                    <div className="mt-8 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted hero-text">
                        <div>
                            <div className="font-bold text-white text-lg">300</div>
                            <div>Total Supply</div>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div>
                            <div className="font-bold text-white text-lg">1 ETH</div>
                            <div>Mint Price</div>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div>
                            <div className="font-bold text-white text-lg">0%</div>
                            <div>Fees Forever</div>
                        </div>
                    </div>
                </div>

                {/* NFT Preview Card */}
                <div className="flex-1 flex justify-center perspective-1000 z-10">
                    <div ref={cardRef} className="relative w-[350px] h-[500px] group preserve-3d hover:rotate-y-12 transition-transform duration-500">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-[80px] opacity-30 nft-glow -z-10" />

                        <Card className="w-full h-full p-0 overflow-hidden border-primary/30 bg-black/80 backdrop-blur-xl flex flex-col shadow-2xl">
                            {/* Image Placeholder */}
                            <div className="h-[65%] bg-gradient-to-br from-surface to-black relative overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
                                <div className="relative z-10 w-32 h-32">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-slow" />
                                    <Diamond className="w-full h-full text-primary drop-shadow-[0_0_15px_rgba(0,255,157,0.5)]" />
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                    <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                                        #001
                                    </div>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 flex-1 flex flex-col justify-between bg-surface/50">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-display font-bold text-white">Synapse Node</h3>
                                        <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold border border-primary/20">FOUNDER</span>
                                    </div>
                                    <p className="text-sm text-muted">Kiasma Genesis Collection</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="w-[85%] h-full bg-gradient-to-r from-primary to-secondary" />
                                    </div>
                                    <div className="flex justify-between text-xs text-muted">
                                        <span>Minted: 255/300</span>
                                        <span className="text-primary">Live Now</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Section>

            {/* Utilities Grid */}
            <Section className="py-20 benefits-grid">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                        Hard-Coded <span className="text-primary">Utility</span>
                    </h2>
                    <p className="text-muted max-w-2xl mx-auto">
                        These are not promises. These are smart contract rights programmed into the NFT.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {benefits.map((benefit, index) => (
                        <Card key={index} className={`benefit-card p-8 border hover:border-opacity-50 transition-colors ${benefit.color}`}>
                            <div className="mb-6 inline-block p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5">
                                {benefit.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                            <p className="text-muted leading-relaxed">
                                {benefit.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default NftPage;
