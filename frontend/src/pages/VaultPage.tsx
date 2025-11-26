import { useRef, useState, useEffect } from 'react';
import { Section, Button } from '../components/ui';
import { Lock, Shield, Loader2, Activity, Database, ArrowRight, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { CustomConnectButton } from '../components/CustomConnectButton';
import contractAddresses from '../contract-addresses.json';
import clsx from 'clsx';

// Contract Config
const VAULT_ADDRESS = contractAddresses.KiasmaVault as `0x${string}`;
const WETH_ADDRESS = contractAddresses.WETH as `0x${string}`;

const VAULT_ABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }, { "internalType": "address", "name": "receiver", "type": "address" }],
        "name": "deposit",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }, { "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "address", "name": "owner", "type": "address" }],
        "name": "redeem",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalAssets",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }],
        "name": "convertToAssets",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }, { "internalType": "address", "name": "receiver", "type": "address" }],
        "name": "convertToShares",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const ERC20_ABI = [
    {
        "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }],
        "name": "allowance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const VaultPage = () => {
    const containerRef = useRef(null);
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
    const [amount, setAmount] = useState('');

    // --- Web3 Hooks ---

    // 1. Vault Stats
    const { data: totalAssets } = useReadContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'totalAssets',
        query: { refetchInterval: 5000 }
    });

    const { data: userShares, refetch: refetchShares } = useReadContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'balanceOf',
        args: [address],
        query: { enabled: !!address }
    });

    const { data: userAssets } = useReadContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'convertToAssets',
        args: [userShares || 0n],
        query: { enabled: !!userShares }
    });

    // 2. User Balances
    const { data: wethBalance, refetch: refetchWeth } = useBalance({
        address: address,
        token: WETH_ADDRESS,
    });

    // 3. Allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: WETH_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, VAULT_ADDRESS],
        query: { enabled: !!address }
    });

    // 4. Write Actions
    const { writeContract: writeApprove, isPending: isApproving, data: approveHash } = useWriteContract();
    const { writeContract: writeDeposit, isPending: isDepositing, data: depositHash } = useWriteContract();
    const { writeContract: writeRedeem, isPending: isRedeeming, data: redeemHash } = useWriteContract();

    // 5. Transaction Waiters
    const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } = useWaitForTransactionReceipt({ hash: approveHash });
    const { isLoading: isDepositConfirming, isSuccess: isDepositConfirmed } = useWaitForTransactionReceipt({ hash: depositHash });
    const { isLoading: isRedeemConfirming, isSuccess: isRedeemConfirmed } = useWaitForTransactionReceipt({ hash: redeemHash });

    // --- Effects ---
    useEffect(() => {
        if (isApproveConfirmed) refetchAllowance();
        if (isDepositConfirmed) {
            refetchShares();
            refetchWeth();
            setAmount('');
        }
        if (isRedeemConfirmed) {
            refetchShares();
            refetchWeth();
            setAmount('');
        }
    }, [isApproveConfirmed, isDepositConfirmed, isRedeemConfirmed, refetchAllowance, refetchShares, refetchWeth]);

    // --- Handlers ---
    const handleApprove = () => {
        if (!amount) return;
        writeApprove({
            address: WETH_ADDRESS,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [VAULT_ADDRESS, parseEther(amount)],
        });
    };

    const handleDeposit = () => {
        if (!amount) return;
        writeDeposit({
            address: VAULT_ADDRESS,
            abi: VAULT_ABI,
            functionName: 'deposit',
            args: [parseEther(amount), address],
        });
    };

    const handleWithdraw = () => {
        if (!amount) return;
        writeRedeem({
            address: VAULT_ADDRESS,
            abi: VAULT_ABI,
            functionName: 'redeem',
            args: [parseEther(amount), address, address],
        });
    };

    // --- Animations ---
    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from('.vault-header', {
            y: -20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
            .from('.vault-panel', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out'
            }, '-=0.4');

    }, { scope: containerRef });

    // --- Validation ---
    const currentBalance = activeTab === 'deposit' ? (wethBalance?.value ?? 0n) : ((userShares as bigint) ?? 0n);
    const parsedAmount = amount ? parseEther(amount) : 0n;
    const insufficientBalance = parsedAmount > currentBalance;

    const needsApproval = activeTab === 'deposit' && allowance !== undefined && amount && (allowance as bigint) < parsedAmount;
    const isActionPending = isApproving || isApproveConfirming || isDepositing || isDepositConfirming || isRedeeming || isRedeemConfirming;
    const isButtonDisabled = isActionPending || !amount || parseFloat(amount) <= 0 || insufficientBalance;

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-ink pt-20 pb-20 relative overflow-hidden">
            {/* Background Grid Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-30"
                style={{ backgroundImage: 'linear-gradient(#bfb8a5 1px, transparent 1px), linear-gradient(90deg, #bfb8a5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Header Section - The "Machine Label" */}
            <div className="max-w-7xl mx-auto px-6 mb-12 vault-header relative z-10">
                <div className="border-b-4 border-ink pb-6 flex flex-col md:flex-row justify-between items-end gap-6 bg-background/80 backdrop-blur-sm p-4 border-t-4 border-x-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-mono text-sm font-bold tracking-widest uppercase mb-2">
                            <Database className="w-4 h-4" />
                            <span>System_Module_01</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-ink leading-none">
                            VAULT<span className="text-secondary">.CORE</span>
                        </h1>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-xs font-mono text-muted tracking-widest mb-1">CURRENT_YIELD</div>
                        <div className="text-4xl font-display font-bold text-primary">12.5%</div>
                    </div>
                </div>
            </div>

            <Section className="!py-0 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: The Control Terminal (Interaction) */}
                    <div className="lg:col-span-7 vault-panel">
                        <div className="bg-surface border-2 border-ink p-1 shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] relative">
                            {/* Decorative Screws */}
                            <div className="absolute top-2 left-2 w-2 h-2 border border-ink rounded-full flex items-center justify-center"><div className="w-full h-[1px] bg-ink rotate-45"></div></div>
                            <div className="absolute top-2 right-2 w-2 h-2 border border-ink rounded-full flex items-center justify-center"><div className="w-full h-[1px] bg-ink rotate-45"></div></div>
                            <div className="absolute bottom-2 left-2 w-2 h-2 border border-ink rounded-full flex items-center justify-center"><div className="w-full h-[1px] bg-ink rotate-45"></div></div>
                            <div className="absolute bottom-2 right-2 w-2 h-2 border border-ink rounded-full flex items-center justify-center"><div className="w-full h-[1px] bg-ink rotate-45"></div></div>

                            <div className="border border-ink p-6 md:p-10 bg-background">
                                {/* Tabs as "Physical" Cards */}
                                <div className="flex gap-2 mb-8 border-b-2 border-ink pb-4">
                                    <button
                                        onClick={() => setActiveTab('deposit')}
                                        className={clsx(
                                            "flex-1 py-3 px-4 font-mono font-bold text-sm uppercase tracking-wider border-2 transition-all",
                                            activeTab === 'deposit'
                                                ? "bg-primary text-white border-primary shadow-[4px_4px_0_#1a1a1a] -translate-y-1"
                                                : "bg-transparent text-ink border-ink hover:bg-ink/5"
                                        )}
                                    >
                                        Input / Deposit
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('withdraw')}
                                        className={clsx(
                                            "flex-1 py-3 px-4 font-mono font-bold text-sm uppercase tracking-wider border-2 transition-all",
                                            activeTab === 'withdraw'
                                                ? "bg-secondary text-white border-secondary shadow-[4px_4px_0_#1a1a1a] -translate-y-1"
                                                : "bg-transparent text-ink border-ink hover:bg-ink/5"
                                        )}
                                    >
                                        Output / Withdraw
                                    </button>
                                </div>

                                {/* Interaction Area */}
                                {!isConnected ? (
                                    <div className="text-center py-12 border-2 border-dashed border-ink/20 bg-surface/50">
                                        <Lock className="w-12 h-12 text-muted mx-auto mb-4" />
                                        <p className="font-mono text-sm text-muted mb-6 uppercase tracking-widest">Access Denied // Authentication Required</p>
                                        <div className="flex justify-center">
                                            <CustomConnectButton />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {/* Balance Display */}
                                        <div className="flex justify-between items-end font-mono text-xs uppercase tracking-wider text-muted">
                                            <span>Available Assets</span>
                                            <span className="text-ink font-bold text-base">
                                                {activeTab === 'deposit'
                                                    ? (wethBalance ? parseFloat(wethBalance.formatted).toFixed(4) : '0.00')
                                                    : (userShares ? parseFloat(formatEther(userShares as bigint)).toFixed(4) : '0.00')
                                                } {activeTab === 'deposit' ? 'WETH' : 'stKMA'}
                                            </span>
                                        </div>

                                        {/* Input Field */}
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full bg-surface border-b-4 border-ink px-4 py-6 text-4xl font-display font-bold text-ink placeholder:text-ink/20 focus:outline-none focus:border-primary transition-colors"
                                            />
                                            <div className="absolute right-0 top-0 h-full flex items-center pr-4 gap-3">
                                                <button
                                                    onClick={() => setAmount(activeTab === 'deposit' ? wethBalance?.formatted || '0' : formatEther(userShares as bigint || 0n))}
                                                    className="font-mono text-xs font-bold text-primary hover:bg-primary hover:text-white px-2 py-1 border border-primary transition-colors uppercase"
                                                >
                                                    Max_Val
                                                </button>
                                                <span className="font-display font-bold text-xl text-ink/50">{activeTab === 'deposit' ? 'WETH' : 'stKMA'}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        {activeTab === 'deposit' ? (
                                            <div className="pt-4">
                                                {needsApproval ? (
                                                    <Button className="w-full bg-ink text-white hover:bg-primary border-2 border-transparent" size="lg" onClick={handleApprove} disabled={isActionPending}>
                                                        {isApproving || isApproveConfirming ? <><Loader2 className="mr-2 animate-spin" /> AUTHORIZING...</> : "AUTHORIZE PROTOCOL"}
                                                    </Button>
                                                ) : (
                                                    <Button className="w-full" size="lg" onClick={handleDeposit} disabled={isButtonDisabled}>
                                                        {isDepositing || isDepositConfirming ? <><Loader2 className="mr-2 animate-spin" /> PROCESSING...</> : <>INITIATE DEPOSIT <ArrowRight className="ml-2 w-4 h-4" /></>}
                                                    </Button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="pt-4">
                                                <Button className="w-full bg-secondary text-white hover:bg-ink border-2 border-transparent" size="lg" onClick={handleWithdraw} disabled={isButtonDisabled}>
                                                    {isRedeeming || isRedeemConfirming ? <><Loader2 className="mr-2 animate-spin" /> PROCESSING...</> : <>INITIATE WITHDRAWAL <ArrowLeft className="ml-2 w-4 h-4" /></>}
                                                </Button>
                                            </div>
                                        )}

                                        {/* Status Messages */}
                                        {(isApproveConfirmed || isDepositConfirmed || isRedeemConfirmed) && (
                                            <div className="p-4 bg-primary/10 border-l-4 border-primary text-primary font-mono text-sm">
                                                /// TRANSACTION_CONFIRMED /// BLOCK_HEIGHT_UPDATED
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Data Monitor (Stats) */}
                    <div className="lg:col-span-5 space-y-6 vault-panel">
                        {/* TVL Card */}
                        <div className="bg-primary text-white p-8 border-2 border-ink shadow-[8px_8px_0_#595959] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Shield className="w-24 h-24" />
                            </div>
                            <div className="relative z-10">
                                <div className="font-mono text-xs text-white/80 tracking-widest uppercase mb-2">Total Value Locked</div>
                                <div className="text-5xl font-display font-bold mb-1">
                                    {totalAssets ? parseFloat(formatEther(totalAssets as bigint)).toFixed(2) : '0.00'}
                                </div>
                                <div className="text-sm font-mono opacity-80">ETH ASSETS</div>
                            </div>
                        </div>

                        {/* User Stats */}
                        <div className="bg-surface border-2 border-ink p-8 shadow-[8px_8px_0_#bfb8a5]">
                            <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-secondary" />
                                YOUR_POSITION
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm font-mono mb-1">
                                        <span className="text-muted">DEPOSITED</span>
                                        <span className="font-bold">{userAssets ? parseFloat(formatEther(userAssets as bigint)).toFixed(4) : '0.0000'} ETH</span>
                                    </div>
                                    <div className="w-full h-2 bg-background border border-ink/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-3/4"></div> {/* Mock progress */}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm font-mono mb-1">
                                        <span className="text-muted">SHARES (stKMA)</span>
                                        <span className="font-bold">{userShares ? parseFloat(formatEther(userShares as bigint)).toFixed(4) : '0.0000'} ETH</span>
                                    </div>
                                    <div className="w-full h-2 bg-background border border-ink/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary w-1/2"></div> {/* Mock progress */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="border-2 border-dashed border-ink/30 p-6 font-mono text-xs leading-relaxed text-muted bg-background/50">
                            <strong className="text-ink block mb-2">/// PROTOCOL_NOTE</strong>
                            Assets are auto-compounded daily. Withdrawal requests are processed in the next available block.
                            <br /><br />
                            Contract: <span className="underline decoration-dotted">{VAULT_ADDRESS.slice(0, 6)}...{VAULT_ADDRESS.slice(-4)}</span>
                        </div>
                    </div>

                </div>
            </Section>
        </div>
    );
};

export default VaultPage;
