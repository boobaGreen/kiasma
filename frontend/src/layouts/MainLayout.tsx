import React, { useRef } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Menu, X, Wallet, ChevronRight, LogOut } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { WalletProvider, useWallet } from '../context/WalletContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const navRef = useRef(null);
    const { isConnected, address, connect, disconnect } = useWallet();

    useGSAP(() => {
        gsap.from(navRef.current, {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        });
    }, []);

    const links = [
        { name: 'About', path: '/about' },
        { name: 'Roadmap', path: '/roadmap' },
        { name: 'NFT', path: '/nft' },
        { name: 'Trade', path: '/trade' },
        { name: 'Staking', path: '/staking' },
    ];

    return (
        <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="text-2xl font-display font-bold tracking-wider text-white">KIASMA</span>
                </NavLink>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                clsx(
                                    'text-sm font-medium tracking-wide transition-colors duration-300 hover:text-primary',
                                    isActive ? 'text-primary' : 'text-muted'
                                )
                            }
                        >
                            {link.name.toUpperCase()}
                        </NavLink>
                    ))}
                </div>

                {/* Connect Wallet & Mobile Menu */}
                <div className="flex items-center gap-4">
                    {isConnected ? (
                        <button
                            onClick={disconnect}
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-red-500/10 border border-primary/20 hover:border-red-500/20 rounded-lg transition-all duration-300 group"
                        >
                            <div className="w-2 h-2 rounded-full bg-primary group-hover:bg-red-500 transition-colors" />
                            <span className="text-sm font-medium text-white group-hover:text-red-500 transition-colors">{address}</span>
                            <LogOut className="w-4 h-4 text-muted group-hover:text-red-500 ml-2 transition-colors" />
                        </button>
                    ) : (
                        <button
                            onClick={connect}
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300 group"
                        >
                            <Wallet className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-white">Connect Wallet</span>
                        </button>
                    )}

                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-white/10 p-6 flex flex-col gap-4">
                    {links.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                clsx(
                                    'text-lg font-medium transition-colors duration-300 flex items-center justify-between',
                                    isActive ? 'text-primary' : 'text-muted'
                                )
                            }
                        >
                            {link.name}
                            <ChevronRight className="w-4 h-4" />
                        </NavLink>
                    ))}
                    <button
                        onClick={() => {
                            isConnected ? disconnect() : connect();
                            setIsOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300 mt-4"
                    >
                        <Wallet className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-white">{isConnected ? 'Disconnect' : 'Connect Wallet'}</span>
                    </button>
                </div>
            )}
        </nav>
    );
};

const Footer = () => {
    return (
        <footer className="bg-surface border-t border-white/5 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-md rotate-45" />
                        <span className="text-xl font-display font-bold text-white">KIASMA</span>
                    </div>
                    <p className="text-muted text-sm max-w-md">
                        The Oracle Convergence Layer. Where Data Converges. Where Value Compounds.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Protocol</h4>
                    <ul className="space-y-2 text-sm text-muted">
                        <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Whitepaper</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Audits</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Community</h4>
                    <ul className="space-y-2 text-sm text-muted">
                        <li><a href="#" className="hover:text-primary transition-colors">Twitter / X</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Medium</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-xs text-muted">
                © 2025 Kiasma Network. All rights reserved.
            </div>
        </footer>
    );
};

const MainLayout = () => {
    return (
        <WalletProvider>
            <div className="min-h-screen bg-background text-text selection:bg-primary/30">
                <Navbar />
                <main className="pt-20 min-h-[calc(100vh-300px)]">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </WalletProvider>
    );
};

export default MainLayout;
