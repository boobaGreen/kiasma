import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { Menu, X, Terminal, Activity, Database, Layers, Globe, Shield, FileText, Users } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const chassisRef = useRef<HTMLDivElement>(null);

    // Navigation Items
    const navItems = [
        { path: '/', label: 'MANIFESTO', icon: Terminal },
        { path: '/dashboard', label: 'CONSOLE', icon: Activity },
        { path: '/vault', label: 'SAFE', icon: Shield },
        { path: '/trade', label: 'CALCULATOR', icon: Layers },
        { path: '/staking', label: 'GARDEN', icon: Database },
        { path: '/nft', label: 'BOND', icon: FileText },
        { path: '/community', label: 'SWITCHBOARD', icon: Users },
        { path: '/roadmap', label: 'TAPE', icon: Globe },
    ];

    // Toggle Menu Animation
    useGSAP(() => {
        if (isMenuOpen) {
            gsap.to('.menu-overlay', { x: '0%', duration: 0.5, ease: 'power3.out' });
            gsap.from('.menu-item', { x: -50, opacity: 0, duration: 0.4, stagger: 0.1, delay: 0.2 });
        } else {
            gsap.to('.menu-overlay', { x: '-100%', duration: 0.5, ease: 'power3.in' });
        }
    }, [isMenuOpen]);

    // Page Transition Effect (The "Paper Feed")
    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.from('.page-content', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                clearProps: 'all'
            });
        }, chassisRef);
        return () => ctx.revert();
    }, [location.pathname]);

    return (
        <div ref={chassisRef} className="min-h-screen bg-ink p-2 md:p-4 font-mono overflow-hidden relative">
            {/* The Machine Chassis (Outer Frame) */}
            <div className="relative bg-paper min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] rounded-sm shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col border-4 border-olivetti-gray">

                {/* Top Bar: The "Header" */}
                <header className="h-16 border-b-4 border-ink flex items-center justify-between px-6 bg-paper z-50 relative">
                    {/* Logo Area */}
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-olivetti-red rounded-full border-2 border-ink animate-pulse-slow" />
                        <h1 className="text-2xl font-display font-black tracking-tighter uppercase">
                            KIASMA<span className="text-olivetti-red">.OS</span>
                        </h1>
                    </div>

                    {/* System Status Indicators */}
                    <div className="hidden md:flex items-center gap-6 text-xs font-bold tracking-widest text-ink/60">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-olivetti-teal rounded-full animate-blink" />
                            <span>NET_ONLINE</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-olivetti-yellow rounded-full" />
                            <span>MEM_OK</span>
                        </div>
                    </div>

                    {/* Menu Toggle (Mechanical Switch) */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="w-12 h-12 border-2 border-ink bg-olivetti-gray hover:bg-olivetti-red transition-colors flex items-center justify-center shadow-[4px_4px_0_#1a1a1a] active:translate-y-1 active:shadow-none"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </header>

                {/* Main Content Area (The "Paper") */}
                <main className="flex-1 relative overflow-y-auto overflow-x-hidden scroll-smooth page-content">
                    {/* Background Grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                    <Outlet />
                </main>

                {/* Bottom Bar: The "Footer" */}
                <footer className="h-12 border-t-4 border-ink bg-ink text-paper flex items-center justify-between px-6 text-xs font-mono uppercase tracking-widest z-40">
                    <div>System_v2.0 // Olivetti_Reboot</div>
                    <div className="flex gap-4">
                        <span>CPU: 12%</span>
                        <span>RAM: 4GB</span>
                    </div>
                </footer>

                {/* Navigation Overlay (The "Punch Card" Menu) */}
                <div className="menu-overlay absolute inset-y-0 left-0 w-full md:w-96 bg-paper border-r-4 border-ink z-40 transform -translate-x-full shadow-[20px_0_50px_rgba(0,0,0,0.5)] flex flex-col pt-20 pb-8 px-8">
                    <div className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsMenuOpen(false);
                                }}
                                className={`menu-item w-full text-left p-4 border-2 border-ink font-bold text-xl uppercase tracking-widest flex items-center gap-4 transition-all hover:bg-ink hover:text-paper hover:translate-x-2 ${location.pathname === item.path ? 'bg-olivetti-yellow text-ink shadow-[4px_4px_0_#1a1a1a]' : 'bg-transparent text-ink'}`}
                            >
                                <item.icon className="w-6 h-6" />
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <div className="border-t-2 border-ink pt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            Designed by<br />
                            <span className="font-bold text-olivetti-red">ANTIGRAVITY</span>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MainLayout;
