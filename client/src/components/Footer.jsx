import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const quickLinks = [
        { name: 'Dashboard', path: '/' },
        { name: 'Transactions', path: '/transactions' },
        { name: 'About App', path: '/about' },
    ];

    return (
        <footer className="mt-auto border-t border-slate-200 pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-md">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

                {/* Column 1: App Identity */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold text-slate-900 font-display">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        FinManage
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-xs">
                        Elevate your financial clarity. A premium personal finance manager built for the modern era of digital wealth tracking.
                    </p>
                </div>

                {/* Column 2: Quick Links (Navigation) */}
                <div className="space-y-6 md:text-right md:flex md:flex-col md:items-end">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Navigation</h3>
                    <div className="flex flex-col gap-4">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-sm font-bold text-slate-600 hover:text-primary transition-all flex items-center gap-2 group md:justify-end"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors md:order-last"></div>
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                <p>&copy; {new Date().getFullYear()} FinManage Architecture</p>
            </div>
        </footer>
    );
};

export default Footer;
