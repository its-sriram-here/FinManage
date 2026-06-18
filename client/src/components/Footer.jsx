import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full mt-auto bg-slate-900 border-t border-slate-800 text-slate-500 relative overflow-hidden select-none">
            {/* Background soft glow - shrunken */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left: Brand Identity & Status */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                        <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
                            <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center text-white shadow-sm">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span>FinManage</span>
                        </div>
                        <span className="hidden sm:inline text-slate-700">|</span>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                            <span className="flex h-1 w-1 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500"></span>
                            </span>
                            Systems Active
                        </div>
                    </div>

                    {/* Middle: Links */}
                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-black uppercase tracking-wider">
                        <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <Link to="/transactions" className="text-slate-400 hover:text-white transition-colors">
                            Ledger
                        </Link>
                        <Link to="/goals" className="text-slate-400 hover:text-white transition-colors">
                            Savings
                        </Link>
                        <Link to="/settings" className="text-slate-400 hover:text-white transition-colors">
                            Settings
                        </Link>
                        <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                            About
                        </Link>
                    </div>

                    {/* Right: Copyright */}
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center md:text-right">
                        <span>&copy; {new Date().getFullYear()} FinManage Architecture</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
