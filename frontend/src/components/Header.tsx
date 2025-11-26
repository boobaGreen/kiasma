
import { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Activity, Zap, Clock } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { CustomConnectButton } from './CustomConnectButton';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef(null);
    const location = useLocation();

    useGSAP(() => {
        gsap.from(navRef.current, {
            y: -100,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
        });
    }, []);

    const links = [
        { name: 'About', path: '/about' },
        { name: 'NFT', path: '/nft' },
        { name: 'Community', path: '/community' },
        { name: 'Trade', path: '/trade' },
        { name: 'Vault', path: '/vault' },
        { name: 'Staking', path: '/staking' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Roadmap', path: '/roadmap' },
    ];

    // Check if we are on a "Demo" page
    const isDemoPage = !['/', '/nft', '/vault', '/dashboard', '/about', '/community', '/roadmap', '/staking', '/trade'].includes(location.pathname);

    return (
        <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-background border-b-4 border-ink shadow-lg font-mono">
            {/* Top Status Bar - The "Machine Status" */}
            <div className="bg-ink text-background py-1 px-4 flex justify-between items-center text-[10px] uppercase tracking-widest border-b border-gray-700">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-primary"><Activity className="w-3 h-3" /> System_Online</span>
                    <span className="flex items-center gap-1 text-accent"><Zap className="w-3 h-3" /> Gas: 12 Gwei</span>
                </div>
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> UTC {new Date().toISOString().slice(11, 16)}</span>
                    <span className="text-gray-400">v1.0.4-beta</span>
                </div>
            </div>

            {/* Demo Mode Banner */}
            {isDemoPage && (
                <div className="bg-accent border-b-2 border-ink py-1 text-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                    <p className="font-mono text-xs font-bold text-ink tracking-[0.2em] uppercase animate-pulse relative z-10">
                        /// DEMO_MODE_ACTIVE /// DATA_SIMULATED ///
                    </p>
                </div>
            )}

            <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo - Mechanical Plate */}
                <NavLink to="/" className="flex items-center gap-3 group relative">
                    <div className="absolute -inset-2 bg-ink opacity-0 group-hover:opacity-5 transition-opacity rounded-lg" />
                    <div className="w-10 h-10 bg-secondary rounded-sm border-2 border-ink flex items-center justify-center shadow-[2px_2px_0_#1a1a1a] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
                        <span className="font-display font-bold text-white text-xl">K</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-display font-bold tracking-tighter text-ink leading-none">KIASMA</span>
                        <span className="text-[10px] font-mono text-muted tracking-[0.3em] uppercase leading-none">Network</span>
                    </div>
                </NavLink>

                {/* Desktop Links - Typewriter Keys */}
                <div className="hidden xl:flex items-center gap-2 bg-surface p-1 rounded-md border border-border shadow-inner">
                    {links.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                clsx(
                                    'px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 rounded-sm border-2',
                                    isActive
                                        ? 'bg-ink text-background border-ink shadow-[2px_2px_0_#666] translate-y-[1px]'
                                        : 'bg-background text-ink border-transparent hover:border-border hover:shadow-[2px_2px_0_#ccc] hover:-translate-y-[1px]'
                                )
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                {/* Connect Wallet & Mobile Menu */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <CustomConnectButton />
                    </div>

                    <button
                        className="xl:hidden p-2 text-ink border-2 border-ink rounded-sm hover:bg-ink hover:text-background transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - Slide Down Panel */}
            {isOpen && (
                <div className="xl:hidden absolute top-full left-0 right-0 bg-background border-b-4 border-ink p-6 flex flex-col gap-4 shadow-2xl z-50">
                    {links.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                clsx(
                                    'text-lg font-mono font-bold uppercase p-4 border-2 border-ink transition-all duration-200 flex items-center justify-between group',
                                    isActive ? 'bg-ink text-background' : 'bg-white text-ink hover:bg-surface'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className="flex items-center gap-3">
                                        <div className={clsx("w-2 h-2 rounded-full", isActive ? "bg-secondary" : "bg-border group-hover:bg-primary")} />
                                        {link.name}
                                    </span>
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </NavLink>
                    ))}
                    <div className="mt-4 flex justify-center border-t-2 border-border pt-6">
                        <CustomConnectButton />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
