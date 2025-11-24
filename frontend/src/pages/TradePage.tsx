import { useRef, useState } from 'react';
import { Card, Button } from '../components/ui';
import { ArrowDownUp, Settings, Info, TrendingUp } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TradeChart from '../components/TradeChart';
import { useWallet } from '../context/WalletContext';

const TradePage = () => {
    const containerRef = useRef(null);
    const [amount, setAmount] = useState('');
    const { isConnected } = useWallet();

    useGSAP(() => {
        gsap.from('.trade-card', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-[90vh] pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="trade-card h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-surface" />
                                    <div className="w-8 h-8 rounded-full bg-primary border-2 border-surface" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">ETH / KMA</h3>
                                    <div className="text-sm text-primary flex items-center gap-1">
                                        $2,450.50 <TrendingUp className="w-3 h-3" /> <span className="text-green-400">+5.2%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {['1H', '1D', '1W', '1M', '1Y'].map((tf) => (
                                    <button key={tf} className="px-3 py-1 text-xs rounded-md hover:bg-white/5 text-muted hover:text-white transition-colors">
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="flex-1 bg-gradient-to-t from-primary/5 to-transparent rounded-lg border border-white/5 relative overflow-hidden p-2">
                            <TradeChart />
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="trade-card">
                            <h4 className="font-bold mb-4 text-sm text-muted uppercase">Market Stats</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">24h Volume</span>
                                    <span className="font-bold">$12.5M</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Liquidity</span>
                                    <span className="font-bold">$45.2M</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Market Cap</span>
                                    <span className="font-bold">$120M</span>
                                </div>
                            </div>
                        </Card>
                        <Card className="trade-card">
                            <h4 className="font-bold mb-4 text-sm text-muted uppercase">Your Position</h4>
                            <div className="flex flex-col items-center justify-center h-32 text-muted text-sm">
                                {isConnected ? (
                                    <div className="w-full space-y-2">
                                        <div className="flex justify-between">
                                            <span>KMA Balance</span>
                                            <span className="font-bold text-white">1,250.00 KMA</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Value</span>
                                            <span className="font-bold text-white">$3,062.50</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>P&L</span>
                                            <span className="font-bold text-green-400">+12.5%</span>
                                        </div>
                                    </div>
                                ) : (
                                    'Connect wallet to view position'
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Swap Interface */}
                <div className="lg:col-span-1">
                    <Card className="trade-card sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Swap</h2>
                            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <Settings className="w-5 h-5 text-muted" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* From Input */}
                            <div className="bg-background/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex justify-between text-xs text-muted mb-2">
                                    <span>From</span>
                                    <span>Balance: {isConnected ? '14.5' : '0.00'}</span>
                                </div>
                                <div className="flex gap-4">
                                    <input
                                        type="number"
                                        placeholder="0.0"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="bg-transparent text-2xl font-bold outline-none w-full placeholder-white/20"
                                    />
                                    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full transition-colors">
                                        <div className="w-5 h-5 rounded-full bg-blue-500" />
                                        <span className="font-bold">ETH</span>
                                    </button>
                                </div>
                            </div>

                            {/* Swap Arrow */}
                            <div className="flex justify-center -my-2 relative z-10">
                                <button className="p-2 bg-surface border border-white/10 rounded-lg hover:border-primary transition-colors">
                                    <ArrowDownUp className="w-4 h-4 text-primary" />
                                </button>
                            </div>

                            {/* To Input */}
                            <div className="bg-background/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex justify-between text-xs text-muted mb-2">
                                    <span>To</span>
                                    <span>Balance: {isConnected ? '1,250.00' : '0.00'}</span>
                                </div>
                                <div className="flex gap-4">
                                    <input
                                        type="number"
                                        placeholder="0.0"
                                        readOnly
                                        className="bg-transparent text-2xl font-bold outline-none w-full placeholder-white/20"
                                    />
                                    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full transition-colors">
                                        <div className="w-5 h-5 rounded-full bg-primary" />
                                        <span className="font-bold">KMA</span>
                                    </button>
                                </div>
                            </div>

                            {/* Price Info */}
                            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex justify-between items-center text-xs text-primary">
                                <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Best price via Kiasma Router</span>
                                <span>1 ETH = 2,450.5 KMA</span>
                            </div>

                            <Button size="lg" className="w-full py-6 text-lg">
                                {isConnected ? 'Swap' : 'Connect Wallet'}
                            </Button>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default TradePage;
