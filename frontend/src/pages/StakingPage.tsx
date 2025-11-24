import { useRef, useState } from 'react';
import { Section, Card, Button } from '../components/ui';
import { Wallet, TrendingUp, Lock, History, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const StakingPage = () => {
    const containerRef = useRef(null);
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
    const [amount, setAmount] = useState('');

    useGSAP(() => {
        gsap.from('.stake-card', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-[90vh] pt-24 pb-12 px-4">
            <Section className="py-0 pb-12 text-center">
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                    Kiasma <span className="text-primary">Vault</span>
                </h1>
                <p className="text-muted max-w-2xl mx-auto">
                    Earn passive yield from the Oracle Economy. Auto-compounded, risk-managed, and institutional grade.
                </p>
            </Section>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Stats Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="stake-card bg-primary/5 border-primary/20">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                <span className="text-sm font-bold text-primary">APY</span>
                            </div>
                            <div className="text-3xl font-bold text-white">14.2%</div>
                            <div className="text-xs text-muted mt-1">7-day average</div>
                        </Card>
                        <Card className="stake-card">
                            <div className="flex items-center gap-3 mb-2">
                                <Lock className="w-5 h-5 text-secondary" />
                                <span className="text-sm font-bold text-secondary">TVL</span>
                            </div>
                            <div className="text-3xl font-bold text-white">$2.4M</div>
                            <div className="text-xs text-muted mt-1">Total Value Locked</div>
                        </Card>
                        <Card className="stake-card">
                            <div className="flex items-center gap-3 mb-2">
                                <Wallet className="w-5 h-5 text-accent" />
                                <span className="text-sm font-bold text-accent">My Stake</span>
                            </div>
                            <div className="text-3xl font-bold text-white">$0.00</div>
                            <div className="text-xs text-muted mt-1">0.00 KMA</div>
                        </Card>
                    </div>

                    <Card className="stake-card">
                        <h3 className="font-bold mb-6 flex items-center gap-2">
                            <History className="w-5 h-5 text-muted" /> Recent Activity
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs font-bold">IN</div>
                                    <div>
                                        <div className="font-bold text-sm">Deposit</div>
                                        <div className="text-xs text-muted">2 mins ago</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-sm">+500 USDC</div>
                                    <div className="text-xs text-muted">Success</div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs font-bold">IN</div>
                                    <div>
                                        <div className="font-bold text-sm">Deposit</div>
                                        <div className="text-xs text-muted">15 mins ago</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-sm">+2.5 ETH</div>
                                    <div className="text-xs text-muted">Success</div>
                                </div>
                            </div>
                            <div className="text-center text-sm text-muted pt-2">
                                Connect wallet to see your history
                            </div>
                        </div>
                    </Card>

                    <Card className="stake-card border-yellow-500/20 bg-yellow-500/5">
                        <div className="flex gap-4">
                            <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-yellow-500 mb-1">Circuit Breaker Active</h4>
                                <p className="text-sm text-muted">
                                    Rebalancing is currently paused for API3 due to high volatility. Your funds are safe and earning yield on other assets.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Action Column */}
                <div className="lg:col-span-1">
                    <Card className="stake-card sticky top-24">
                        <div className="flex p-1 bg-white/5 rounded-lg mb-6">
                            <button
                                onClick={() => setActiveTab('deposit')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'deposit' ? 'bg-primary text-black shadow-lg' : 'text-muted hover:text-white'}`}
                            >
                                Deposit
                            </button>
                            <button
                                onClick={() => setActiveTab('withdraw')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'withdraw' ? 'bg-primary text-black shadow-lg' : 'text-muted hover:text-white'}`}
                            >
                                Withdraw
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs text-muted mb-2">
                                    <span>Amount</span>
                                    <span>Balance: 0.00</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="0.0"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-4 text-xl font-bold outline-none focus:border-primary/50 transition-colors"
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary/20 transition-colors">
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Exchange Rate</span>
                                    <span className="font-bold">1 kUSD = 1.02 USDC</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Fee</span>
                                    <span className="font-bold">0.0%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Est. APY</span>
                                    <span className="font-bold text-green-400">14.2%</span>
                                </div>
                            </div>

                            <Button size="lg" className="w-full py-4">
                                {activeTab === 'deposit' ? 'Approve & Deposit' : 'Request Withdrawal'}
                            </Button>

                            <p className="text-xs text-center text-muted">
                                By depositing, you agree to the Terms of Service.
                            </p>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default StakingPage;
