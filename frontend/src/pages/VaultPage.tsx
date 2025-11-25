import { useRef, useState, useEffect } from 'react';
import { Section, Card, Button } from '../components/ui';
import { Wallet, ArrowRight, ArrowLeft, Lock, TrendingUp, Shield, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import contractAddresses from '../contract-addresses.json';

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
        "name": "convertToShares",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
        "name": "convertToAssets",
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
        gsap.from('.vault-card', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
        });
    }, { scope: containerRef });

    // --- Render Helpers ---
    // --- Validation ---
    const currentBalance = activeTab === 'deposit' ? (wethBalance?.value ?? 0n) : ((userShares as bigint) ?? 0n);
    const parsedAmount = amount ? parseEther(amount) : 0n;
    const insufficientBalance = parsedAmount > currentBalance;

    const needsApproval = activeTab === 'deposit' && allowance !== undefined && amount && (allowance as bigint) < parsedAmount;
    const isActionPending = isApproving || isApproveConfirming || isDepositing || isDepositConfirming || isRedeeming || isRedeemConfirming;
    const isButtonDisabled = isActionPending || !amount || parseFloat(amount) <= 0 || insufficientBalance;

    return (
        <div ref={containerRef} className="pt-32 pb-20 min-h-screen">
            <Section>
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 vault-card">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <Lock className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-primary tracking-wider">KIASMA VAULT</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                            Smart <span className="text-primary">Yield</span>
                        </h1>
                        <p className="text-xl text-muted max-w-2xl mx-auto">
                            Auto-compounding yield from a diversified basket of Oracle tokens.
                            Risk-managed by the Kiasma Protocol.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Card className="p-6 bg-surface/50 border-white/5 vault-card">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <span className="text-muted">APY (Est.)</span>
                            </div>
                            <div className="text-3xl font-bold font-display">12.5%</div>
                        </Card>
                        <Card className="p-6 bg-surface/50 border-white/5 vault-card">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <span className="text-muted">TVL</span>
                            </div>
                            <div className="text-3xl font-bold font-display">
                                {totalAssets ? parseFloat(formatEther(totalAssets as bigint)).toFixed(2) : '0.00'} ETH
                            </div>
                        </Card>
                        <Card className="p-6 bg-surface/50 border-white/5 vault-card">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <span className="text-muted">Your Position</span>
                            </div>
                            <div className="text-3xl font-bold font-display">
                                {userAssets ? parseFloat(formatEther(userAssets as bigint)).toFixed(4) : '0.0000'} ETH
                            </div>
                            <div className="text-sm text-muted mt-1">
                                ({userShares ? parseFloat(formatEther(userShares as bigint)).toFixed(4) : '0.0000'} stKMA)
                            </div>
                        </Card>
                    </div>

                    {/* Interaction Card */}
                    <Card className="max-w-xl mx-auto overflow-hidden border-primary/20 vault-card">
                        {/* Tabs */}
                        <div className="flex border-b border-white/10">
                            <button
                                onClick={() => setActiveTab('deposit')}
                                className={`flex-1 py-4 text-sm font-bold tracking-wider transition-colors ${activeTab === 'deposit' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted hover:text-white hover:bg-white/5'}`}
                            >
                                DEPOSIT
                            </button>
                            <button
                                onClick={() => setActiveTab('withdraw')}
                                className={`flex-1 py-4 text-sm font-bold tracking-wider transition-colors ${activeTab === 'withdraw' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted hover:text-white hover:bg-white/5'}`}
                            >
                                WITHDRAW
                            </button>
                        </div>

                        <div className="p-8">
                            {!isConnected ? (
                                <div className="text-center py-8">
                                    <p className="text-muted mb-6">Connect your wallet to interact with the Vault.</p>
                                    <div className="flex justify-center">
                                        <ConnectButton />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between text-sm text-muted">
                                        <span>Asset</span>
                                        <span>
                                            Balance: {activeTab === 'deposit'
                                                ? (wethBalance ? parseFloat(wethBalance.formatted).toFixed(4) : '0.00')
                                                : (userShares ? parseFloat(formatEther(userShares as bigint)).toFixed(4) : '0.00')
                                            } {activeTab === 'deposit' ? 'WETH' : 'stKMA'}
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-2xl font-bold focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            <button
                                                onClick={() => setAmount(activeTab === 'deposit' ? wethBalance?.formatted || '0' : formatEther(userShares as bigint || 0n))}
                                                className="text-xs font-bold text-primary hover:text-primary/80 px-2 py-1 rounded bg-primary/10"
                                            >
                                                MAX
                                            </button>
                                            <span className="font-bold text-muted">{activeTab === 'deposit' ? 'WETH' : 'stKMA'}</span>
                                        </div>
                                    </div>

                                    {activeTab === 'deposit' ? (
                                        <div className="space-y-3">
                                            {needsApproval ? (
                                                <Button
                                                    className="w-full"
                                                    size="lg"
                                                    onClick={handleApprove}
                                                    disabled={isActionPending}
                                                >
                                                    {isApproving || isApproveConfirming ? (
                                                        <>Approving <Loader2 className="ml-2 w-4 h-4 animate-spin" /></>
                                                    ) : (
                                                        <>Approve WETH <Lock className="ml-2 w-4 h-4" /></>
                                                    )}
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="w-full"
                                                    size="lg"
                                                    onClick={handleDeposit}
                                                    disabled={isButtonDisabled}
                                                >
                                                    {insufficientBalance ? (
                                                        "Insufficient Balance"
                                                    ) : isDepositing || isDepositConfirming ? (
                                                        <>Depositing <Loader2 className="ml-2 w-4 h-4 animate-spin" /></>
                                                    ) : (
                                                        <>Deposit <ArrowRight className="ml-2 w-4 h-4" /></>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <Button
                                            className="w-full"
                                            size="lg"
                                            onClick={handleWithdraw}
                                            disabled={isButtonDisabled}
                                        >
                                            {insufficientBalance ? (
                                                "Insufficient Balance"
                                            ) : isRedeeming || isRedeemConfirming ? (
                                                <>Withdrawing <Loader2 className="ml-2 w-4 h-4 animate-spin" /></>
                                            ) : (
                                                <>Withdraw <ArrowLeft className="ml-2 w-4 h-4" /></>
                                            )}
                                        </Button>
                                    )}

                                    {/* Transaction Status Messages */}
                                    {(isApproveConfirmed || isDepositConfirmed || isRedeemConfirmed) && (
                                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center animate-in fade-in">
                                            Transaction Successful!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </Section>
        </div>
    );
};

export default VaultPage;
