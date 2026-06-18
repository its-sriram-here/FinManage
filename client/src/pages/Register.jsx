import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        // Gmail validation
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            setError('Only @gmail.com addresses are allowed');
            return false;
        }

        // Password complexity: 6+ chars and at least one symbol/special char
        const symbolRegex = /[^a-zA-Z0-9]/;
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (!symbolRegex.test(password)) {
            setError('Password must include at least one symbol or special character');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (!securityQuestion) {
            setError('Please select a security question');
            return false;
        }

        if (securityAnswer.trim().length < 2) {
            setError('Security answer must be at least 2 characters');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await register(name, email, password, securityQuestion, securityAnswer);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 animate-fade-in relative overflow-hidden">
            {/* Background decorative blurs */}
            <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[7s]"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[9s]"></div>

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                
                {/* Left Side: Brand Showcase Panel (Visible only on PC/large screens) */}
                <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 pr-6 animate-slide-up">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-secondary/5 rounded-full border border-secondary/20 w-fit text-secondary text-xs font-bold uppercase tracking-widest">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                        </span>
                        Zero Fees. Professional Grade.
                    </div>
                    
                    <h1 className="text-5xl xl:text-6xl font-black text-slate-900 font-display tracking-tight leading-[1.1]">
                        Financial Mastery <br />
                        <span className="premium-gradient-text italic">Starts Right Here</span>
                    </h1>
                    
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                        Join thousands managing wealth with precision. FinManage provides the tools you need to establish strict budgets and visual milestones.
                    </p>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 border border-rose-100 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Advanced Data Security</h4>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">Your password and recovery answers are fully encrypted using bcrypt hashing.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/10 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Real-Time Aggregated Metrics</h4>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">Get immediate category breakdown and monthly income vs expense analytics.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Smart Target Milestones</h4>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">Define savings goals, configure targets, and celebrate milestones.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Centered Glassmorphic Signup Form Card */}
                <div className="lg:col-span-6 flex justify-center w-full">
                    <div className="max-w-xl w-full space-y-8 glass-card p-6 sm:p-10 md:p-12 rounded-2xl md:rounded-[3rem] relative overflow-hidden group shadow-2xl border-slate-200/50">
                        <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-secondary to-primary"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 blur-3xl rounded-full"></div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-5 animate-bounce-slow">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h2 className="text-center text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                                Start Your Journey
                            </h2>
                            <p className="mt-2 text-center text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                Join thousands managing wealth with precision
                            </p>
                        </div>

                        <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-shake">
                                    <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    <p className="text-sm font-bold text-rose-700">{error}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50/40 border border-slate-200 focus:border-secondary/40 focus:bg-white focus:ring-4 focus:ring-secondary/5 rounded-2xl py-3 px-5 text-sm font-semibold text-slate-800 transition-all outline-none placeholder-slate-400"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-50/40 border border-slate-200 focus:border-secondary/40 focus:bg-white focus:ring-4 focus:ring-secondary/5 rounded-2xl py-3 px-5 text-sm font-semibold text-slate-800 transition-all outline-none placeholder-slate-400"
                                        placeholder="example@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <p className="mt-1.5 text-[9px] text-slate-400/80 font-bold px-1 uppercase tracking-wider">Only @gmail.com allowed</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-slate-50/40 border border-slate-200 focus:border-secondary/40 focus:bg-white focus:ring-4 focus:ring-secondary/5 rounded-2xl py-3 px-5 text-sm font-semibold text-slate-800 transition-all outline-none placeholder-slate-400"
                                        placeholder="6+ chars & symbols"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <p className="mt-1.5 text-[9px] text-slate-400/80 font-bold px-1 uppercase tracking-wider">Need 6+ chars & 1 symbol</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-slate-50/40 border border-slate-200 focus:border-secondary/40 focus:bg-white focus:ring-4 focus:ring-secondary/5 rounded-2xl py-3 px-5 text-sm font-semibold text-slate-800 transition-all outline-none placeholder-slate-400"
                                        placeholder="Match password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Security Question</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={securityQuestion}
                                            onChange={(e) => setSecurityQuestion(e.target.value)}
                                            className="w-full bg-slate-50/40 border border-slate-200 focus:border-secondary/40 focus:bg-white focus:ring-4 focus:ring-secondary/5 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-800 transition-all outline-none appearance-none pr-10"
                                        >
                                            <option value="" className="text-slate-400">Select a question...</option>
                                            <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                                            <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                                            <option value="What was the name of your first school?">What was the name of your first school?</option>
                                            <option value="In what city were you born?">In what city were you born?</option>
                                            <option value="What is your favorite movie?">What is your favorite movie?</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Security Answer</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50/40 border border-slate-200 focus:border-secondary/40 focus:bg-white focus:ring-4 focus:ring-secondary/5 rounded-2xl py-3 px-5 text-sm font-semibold text-slate-800 transition-all outline-none placeholder-slate-400"
                                        placeholder="Your answer here (case-insensitive)"
                                        value={securityAnswer}
                                        onChange={(e) => setSecurityAnswer(e.target.value)}
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
                                            Creating Account...
                                        </>
                                    ) : 'Open Your Free Account'}
                                </button>
                            </div>

                            <div className="text-center pt-2">
                                <p className="text-sm font-medium text-slate-500">
                                    Already have an account?{' '}
                                    <Link to="/login" className="font-bold text-primary hover:text-secondary underline underline-offset-4 transition-all">
                                        Log In
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

export default Register;
