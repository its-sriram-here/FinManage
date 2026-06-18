import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 animate-fade-in relative overflow-hidden">
            {/* Background decorative blurs */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6s]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[8s]"></div>

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                
                {/* Left Side: Brand Showcase Panel (Visible only on PC/large screens) */}
                <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-8 pr-8 animate-slide-up">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-full border border-primary/20 w-fit text-primary text-xs font-bold uppercase tracking-widest">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Next-Gen Finance Command Center
                    </div>
                    
                    <h1 className="text-5xl xl:text-6xl font-black text-slate-900 font-display tracking-tight leading-[1.1]">
                        Manage Wealth with <br />
                        <span className="premium-gradient-text italic">Absolute Precision</span>
                    </h1>
                    
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                        FinManage empowers you with automated budgeting, real-time spending insights, and outstanding lending logs to structure your financial lifestyle.
                    </p>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Advanced Transaction Analytics</h4>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">Understand your categories and optimize expense outflow instantly.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/10 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Intelligent Savings Goals</h4>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">Configure savings targets, transfer/withdraw funds, and monitor milestones.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 border border-amber-100 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Lending Tracker</h4>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">Record money lent to friends and log repayments in a single place.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Centered Glassmorphic Login Form Card */}
                <div className="lg:col-span-5 flex justify-center w-full">
                    <div className="max-w-md w-full space-y-10 glass-card p-6 sm:p-10 md:p-14 rounded-2xl md:rounded-[3rem] relative overflow-hidden group shadow-2xl border-slate-200/50">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-3xl rounded-full"></div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h2 className="text-center text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                                Welcome Back
                            </h2>
                            <p className="mt-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                Log in to your financial command center
                            </p>
                        </div>

                        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-shake">
                                    <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    <p className="text-sm font-bold text-rose-700">{error}</p>
                                </div>
                            )}

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                        placeholder="name@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2 px-1">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                        <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-secondary underline underline-offset-2 transition-colors">
                                            Forgot?
                                        </Link>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-4 rounded-2xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Authenticating...
                                        </>
                                    ) : 'Sign In'}
                                </button>
                            </div>

                            <div className="text-center pt-2">
                                <p className="text-sm font-medium text-slate-500">
                                    New to FinManage?{' '}
                                    <Link to="/register" className="font-bold text-primary hover:text-secondary underline underline-offset-4 transition-all">
                                        Create Account
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
