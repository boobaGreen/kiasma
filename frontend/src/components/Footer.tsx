import { Github, Twitter, Disc, FileText, Shield, Code } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-ink text-background border-t-8 border-secondary relative overflow-hidden pt-20 pb-12 mt-20">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

            {/* Screw Heads (Corners) */}
            <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center shadow-inner"><div className="w-full h-[1px] bg-gray-900 rotate-45" /></div>
            <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center shadow-inner"><div className="w-full h-[1px] bg-gray-900 rotate-45" /></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-secondary rounded-sm border-2 border-background flex items-center justify-center">
                                <span className="font-display font-bold text-ink">K</span>
                            </div>
                            <span className="text-4xl font-display font-bold tracking-tighter text-background">KIASMA</span>
                        </div>
                        <div className="font-mono text-sm text-gray-400 leading-relaxed border-l-2 border-gray-700 pl-4">
                            // ORACLE_CONVERGENCE_LAYER<br />
                            // EST. 2025<br />
                            // POWERED_BY_COMMUNITY
                        </div>
                        <div className="flex gap-4 pt-4">
                            <a href="#" className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:bg-background hover:text-ink transition-colors group">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:bg-background hover:text-ink transition-colors group">
                                <Disc className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:bg-background hover:text-ink transition-colors group">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Schematics Column (Links) */}
                    <div className="md:col-span-4">
                        <h4 className="font-mono font-bold text-accent mb-8 uppercase tracking-widest flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Schematics
                        </h4>
                        <ul className="space-y-4 font-mono text-sm">
                            <li>
                                <a href="#" className="flex items-center gap-3 hover:text-primary transition-colors group">
                                    <div className="w-1 h-1 bg-gray-500 group-hover:bg-primary" />
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-3 hover:text-primary transition-colors group">
                                    <div className="w-1 h-1 bg-gray-500 group-hover:bg-primary" />
                                    Whitepaper_v1.pdf
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-3 hover:text-primary transition-colors group">
                                    <div className="w-1 h-1 bg-gray-500 group-hover:bg-primary" />
                                    Brand_Assets.zip
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Technical Data Column */}
                    <div className="md:col-span-4">
                        <h4 className="font-mono font-bold text-primary mb-8 uppercase tracking-widest flex items-center gap-2">
                            <Code className="w-4 h-4" /> System_Data
                        </h4>
                        <div className="space-y-4 font-mono text-xs text-gray-400">
                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                <span>STATUS</span>
                                <span className="text-primary font-bold">OPERATIONAL</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                <span>NETWORK</span>
                                <span className="text-white">ETHEREUM MAINNET</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                <span>CONTRACT</span>
                                <span className="text-white font-mono">0x7a...3d21</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                <span>AUDIT</span>
                                <span className="text-accent flex items-center gap-1"><Shield className="w-3 h-3" /> PASSED</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Plate */}
                <div className="border-t-2 border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs text-gray-600 uppercase tracking-widest">
                    <div>
                        © 2025 KIASMA NETWORK // ALL RIGHTS RESERVED
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Terms_of_Service</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy_Protocol</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
