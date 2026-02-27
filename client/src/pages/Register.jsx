import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-xl w-full space-y-10 glass-card p-10 md:p-14 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-secondary to-primary"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 blur-3xl rounded-full"></div>

                <div className="relative z-10">
                    <h2 className="text-center text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                        Start Journey
                    </h2>
                    <p className="mt-3 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Join thousands managing wealth with precision
                    </p>
                </div>

                <form className="mt-10 space-y-6 relative z-10" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-shake">
                            <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            <p className="text-sm font-bold text-rose-700">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-50/50 border-2 border-transparent focus:border-secondary/20 focus:bg-white focus:ring-4 focus:ring-secondary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
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
                                className="w-full bg-slate-50/50 border-2 border-transparent focus:border-secondary/20 focus:bg-white focus:ring-4 focus:ring-secondary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <p className="mt-1 text-[10px] text-slate-400 font-bold px-1 uppercase tracking-tight">Only @gmail.com allowed</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-50/50 border-2 border-transparent focus:border-secondary/20 focus:bg-white focus:ring-4 focus:ring-secondary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                placeholder="6+ chars & symbols"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <p className="mt-1 text-[10px] text-slate-400 font-bold px-1 uppercase tracking-tight">Need 6+ chars & 1 symbol</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Confirm Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-50/50 border-2 border-transparent focus:border-secondary/20 focus:bg-white focus:ring-4 focus:ring-secondary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                placeholder="Match password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
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
                            <Link to="/login" className="font-bold text-secondary hover:text-primary underline underline-offset-4 transition-all">
                                Log In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
