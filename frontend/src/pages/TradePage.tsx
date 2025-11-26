import { useRef, useState, useEffect } from 'react';
import { Card, Button, Section } from '../components/ui';
import { ArrowDownUp, Settings, Activity, RefreshCw, Layers, Cpu, Hash, MoveRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TradeChart from '../components/TradeChart';
import { useAccount } from 'wagmi';
import { CustomConnectButton } from '../components/CustomConnectButton';
import clsx from 'clsx';

const TradePage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [amount, setAmount] = useState('');
    const { isConnected } = useAccount();
    const [isSwapping, setIsSwapping] = useState(false);

    // Mock Order Book Data
    const asks = Array.from({ length: 6 }).map((_, i) => ({
        price: (2450.5 + (i * 0.5)).toFixed(2),
        amount: (Math.random() * 5).toFixed(2),
        total: (Math.random() * 10000).toFixed(2)
    })).reverse();

    const bids = Array.from({ length: 6 }).map((_, i) => ({
        price: (2450.5 - ((i + 1) * 0.5)).toFixed(2),
        amount: (Math.random() * 5).toFixed(2),
        total: (Math.random() * 10000).toFixed(2)
    }));

    useGSAP(() => {
        const tl = gsap.timeline();

        // Entrance: "Weaving" effect
        tl.from('.loom-strand', {
            scaleY: 0,
            transformOrigin: 'top',
            duration: 1,
            stagger: 0.05,
            ease: 'power3.inOut'
        })
            .from('.trade-module', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'back.out(1.2)'
            }, '-=0.5');

        // Order Book 3D Float
        gsap.to('.order-row', {
            x: 'random(-5, 5)',
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: {
                each: 0.1,
                from: 'center'
            }
        });

        // Pen Plotter Simulation (Chart Border)
        gsap.to('.plotter-arm', {
            x: '100%',
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: 'linear'
        });

    }, { scope: containerRef });

    const handleSwap = () => {
        if (!amount) return;
        setIsSwapping(true);

        // Mechanical "Crunch" Animation
        const tl = gsap.timeline({
            onComplete: () => {
                setIsSwapping(false);
                setAmount('');
            }
        });

        tl.to('.swap-gear', { rotation: 360, duration: 1, ease: 'back.inOut(1.7)' })
            .to('.loom-container', { scale: 0.98, duration: 0.1, yoyo: true, repeat: 3 }, '-=0.8')
            .to('.success-light', { opacity: 1, duration: 0.2, yoyo: true, repeat: 1 });
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-ink pt-24 pb-20 relative overflow-hidden loom-container">
            {/* Background: The Loom */}
            <div className="absolute inset-0 pointer-events-none flex justify-between opacity-10">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="loom-strand w-px h-full bg-primary" />
                ))}
            </div>

            {/* Horizontal Weave */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-5">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-full h-px bg-secondary" />
                ))}
            </div>

            <Section className="relative z-10">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-ink text-background font-mono text-xs font-bold mb-4">
                            <Cpu className="w-4 h-4" />
                            <span>ALGORITHMIC_LOOM_V2</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-ink leading-none">
                            LIQUIDITY<span className="text-primary">.WEAVE</span>
                        </h1>
                    </div>

                    {/* Market Ticker (Mechanical Style) */}
                    <div className="flex gap-4 font-mono text-sm">
                        <div className="bg-surface border-2 border-ink p-2 shadow-[4px_4px_0_#1a1a1a]">
                            <span className="text-muted">ETH/USD</span>
                            <span className="block font-bold text-lg">$2,450.50</span>
                        </div>
                        <div className="bg-surface border-2 border-ink p-2 shadow-[4px_4px_0_#1a1a1a]">
                            <span className="text-muted">GAS</span>
                            <span className="block font-bold text-lg">12 GWEI</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT: The Plotter (Chart) */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="trade-module bg-surface border-2 border-ink p-1 shadow-[8px_8px_0_#1a1a1a] relative group">
                            {/* Plotter Arm Visual */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 z-20 plotter-arm pointer-events-none">
                                <div className="absolute top-0 -left-1 w-3 h-4 bg-primary" />
                                <div className="absolute bottom-0 -left-1 w-3 h-4 bg-primary" />
                            </div>

                            <div className="border border-ink bg-background p-6 h-[500px] flex flex-col relative overflow-hidden">
                                <div className="flex justify-between items-center mb-6 z-10">
                                    <h3 className="font-bold font-display text-xl flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-secondary" />
                                        PRICE_ACTION_PLOT
                                    </h3>
                                    <div className="flex gap-2">
                                        {['1H', '4H', '1D', '1W'].map(tf => (
                                            <button key={tf} className="w-8 h-8 flex items-center justify-center font-mono text-xs border border-ink/20 hover:bg-ink hover:text-white transition-colors">
                                                {tf}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 relative z-10">
                                    <TradeChart />
                                </div>

                                {/* Grid Overlay */}
                                <div className="absolute inset-0 pointer-events-none opacity-10"
                                    style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                                </div>
                            </div>
                        </div>

                        {/* Order Book (3D Stack) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="trade-module">
                                <h3 className="font-mono text-xs font-bold uppercase mb-4 text-muted">Order_Book.Asks</h3>
                                <div className="space-y-1 perspective-500">
                                    {asks.map((order, i) => (
                                        <div key={i} className="order-row flex justify-between text-xs font-mono p-2 bg-red-500/5 border-l-2 border-red-500 hover:bg-red-500/10 transition-colors cursor-pointer">
                                            <span className="text-red-600">{order.price}</span>
                                            <span className="text-muted">{order.amount}</span>
                                            <span className="text-ink">{order.total}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="trade-module">
                                <h3 className="font-mono text-xs font-bold uppercase mb-4 text-muted">Order_Book.Bids</h3>
                                <div className="space-y-1 perspective-500">
                                    {bids.map((order, i) => (
                                        <div key={i} className="order-row flex justify-between text-xs font-mono p-2 bg-green-500/5 border-l-2 border-green-500 hover:bg-green-500/10 transition-colors cursor-pointer">
                                            <span className="text-green-600">{order.price}</span>
                                            <span className="text-muted">{order.amount}</span>
                                            <span className="text-ink">{order.total}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: The Mechanism (Swap) */}
                    <div className="lg:col-span-4">
                        <div className="trade-module sticky top-24 bg-surface border-2 border-ink p-6 shadow-[12px_12px_0_#bfb8a5]">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-display font-bold flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-primary swap-gear" />
                                    EXECUTION_UNIT
                                </h2>
                                <div className="w-3 h-3 rounded-full bg-green-500 success-light opacity-20 transition-opacity" />
                            </div>

                            {/* Input Module */}
                            <div className="space-y-6">
                                <div className="bg-background border-2 border-ink p-1">
                                    <div className="bg-surface/50 p-3 border border-ink/10">
                                        <div className="flex justify-between text-xs font-mono text-muted mb-2">
                                            <span>INPUT_STREAM</span>
                                            <span>MAX: {isConnected ? '14.5' : '0.00'}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full bg-transparent text-3xl font-mono font-bold outline-none placeholder-ink/20"
                                            />
                                            <div className="px-2 py-1 bg-ink text-white font-bold font-mono text-xs">ETH</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center -my-3 relative z-10">
                                    <div className="bg-surface border-2 border-ink rounded-full p-2 shadow-md">
                                        <ArrowDownUp className="w-4 h-4 text-muted" />
                                    </div>
                                </div>

                                <div className="bg-background border-2 border-ink p-1">
                                    <div className="bg-surface/50 p-3 border border-ink/10">
                                        <div className="flex justify-between text-xs font-mono text-muted mb-2">
                                            <span>OUTPUT_ESTIMATE</span>
                                            <span>SLIPPAGE: &lt;0.1%</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                readOnly
                                                value={amount ? (parseFloat(amount) * 2450.5).toFixed(2) : ''}
                                                className="w-full bg-transparent text-3xl font-mono font-bold outline-none text-primary placeholder-ink/20"
                                            />
                                            <div className="px-2 py-1 bg-primary text-white font-bold font-mono text-xs">KMA</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Route Visualization */}
                            <div className="mt-8 mb-8 p-4 bg-ink/5 border border-ink/10 rounded-sm">
                                <div className="flex items-center justify-between text-xs font-mono text-muted mb-2">
                                    <span>ROUTING_PATH</span>
                                    <RefreshCw className="w-3 h-3 animate-spin-slow" />
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold">
                                    <span>ETH</span>
                                    <div className="flex-1 h-px bg-ink/20 relative">
                                        <div className="absolute top-1/2 left-0 w-2 h-2 bg-primary -translate-y-1/2 animate-slide-right" />
                                    </div>
                                    <span className="bg-white border border-ink px-1">USDC</span>
                                    <div className="flex-1 h-px bg-ink/20 relative">
                                        <div className="absolute top-1/2 left-0 w-2 h-2 bg-secondary -translate-y-1/2 animate-slide-right" style={{ animationDelay: '0.5s' }} />
                                    </div>
                                    <span>KMA</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {!isConnected ? (
                                <CustomConnectButton />
                            ) : (
                                <Button
                                    size="lg"
                                    onClick={handleSwap}
                                    disabled={!amount || isSwapping}
                                    className={clsx(
                                        "w-full py-6 text-lg font-display font-bold border-2 border-ink shadow-[4px_4px_0_#1a1a1a] hover:shadow-none hover:translate-y-1 transition-all relative overflow-hidden",
                                        isSwapping ? "bg-secondary text-white" : "bg-ink text-white hover:bg-primary"
                                    )}
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-2">
                                        {isSwapping ? (
                                            <>PROCESSING <RefreshCw className="w-4 h-4 animate-spin" /></>
                                        ) : (
                                            <>INITIATE_SWAP <MoveRight className="w-4 h-4" /></>
                                        )}
                                    </div>
                                    {/* Progress Bar Background */}
                                    {isSwapping && (
                                        <div className="absolute inset-0 bg-black/10 origin-left animate-progress" />
                                    )}
                                </Button>
                            )}
                        </div>

                        {/* Market Stats */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="trade-module bg-surface border-2 border-ink p-4 shadow-[4px_4px_0_#bfb8a5]">
                                <div className="text-xs font-mono text-muted uppercase mb-1">24h Vol</div>
                                <div className="font-bold text-xl">$12.5M</div>
                            </div>
                            <div className="trade-module bg-surface border-2 border-ink p-4 shadow-[4px_4px_0_#bfb8a5]">
                                <div className="text-xs font-mono text-muted uppercase mb-1">Liquidity</div>
                                <div className="font-bold text-xl">$45.2M</div>
                            </div>
                        </div>
                    </div>

                </div>
            </Section>
        </div>
    );
};

export default TradePage;
