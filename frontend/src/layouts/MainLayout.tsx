import React, { useRef } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { CustomConnectButton } from '../components/CustomConnectButton';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const navRef = useRef(null);
    const location = useLocation();

    useGSAP(() => {
        gsap.from(navRef.current, {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        });
    }, []);

    const links = [
        { name: 'NFT', path: '/nft' },
        { name: 'Community', path: '/community' },
        { name: 'Trade', path: '/trade' },
        { name: 'Vault', path: '/vault' },
        { name: 'Staking', path: '/staking' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Roadmap', path: '/roadmap' },
    ];


    // Check if we are on a "Demo" page
    const isDemoPage = !['/', '/nft', '/vault', '/dashboard', '/about', '/community', '/roadmap'].includes(location.pathname);


    return (
        <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
            {/* Demo Mode Banner */}
            {isDemoPage && (
                <div className="bg-yellow-500/10 border-b border-yellow-500/20 py-1 text-center">
                    <p className="text-xs font-medium text-yellow-500 tracking-wide">
                        ⚠️ DEMO MODE: DATA IS SIMULATED
                    </p>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="text-2xl font-display font-bold tracking-wider text-ink">KIASMA</span>
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
                    <div className="hidden md:block">
                        <CustomConnectButton />
                    </div>

                    <button
                        className="md:hidden p-2 text-ink"
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
                    <div className="mt-4 flex justify-center">
                        <CustomConnectButton />
                    </div>
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
                        <span className="text-xl font-display font-bold text-ink">KIASMA</span>
                    </div>
                    <p className="text-muted text-sm max-w-md">
                        The Oracle Convergence Layer. Where Data Converges. Where Value Compounds.
                    </p>
                </div>

                <div>
                    <h4 className="text-ink font-bold mb-4">Protocol</h4>
                    <ul className="space-y-2 text-sm text-muted">
                        <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Whitepaper</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Audits</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-ink font-bold mb-4">Community</h4>
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
        <div className="min-h-screen bg-background text-text selection:bg-primary/30">
            <Navbar />
            <main className="pt-20 min-h-[calc(100vh-300px)]">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
