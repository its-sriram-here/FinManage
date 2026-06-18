import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    
    // Steps: 1 = Email submission, 2 = Answer security question & Reset
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Step 1: Fetch Security Question
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await api.post('/auth/forgotpassword/question', { email });
            setSecurityQuestion(res.data.securityQuestion);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Email address not found');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const symbolRegex = /[^a-zA-Z0-9]/;
        if (password.length < 6) {
            setError('New password must be at least 6 characters');
            return false;
        }
        if (!symbolRegex.test(password)) {
            setError('New password must include at least one symbol or special character');
            return false;
        }
        if (password !== confirmPassword) {
            setError('New passwords do not match');
            return false;
        }
        return true;
    };

    // Step 2: Verify Answer and Reset Password
    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const res = await api.post('/auth/forgotpassword/reset', {
                email,
                securityAnswer,
                password
            });
            setMessage(res.data.message || 'Password successfully updated!');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Incorrect security answer');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-md w-full space-y-10 glass-card p-6 sm:p-10 md:p-14 rounded-2xl md:rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-3xl rounded-full"></div>

                <div className="relative z-10">
                    <h2 className="text-center text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                        Recover Account
                    </h2>
                    <p className="mt-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        {step === 1 ? 'Verify your identity to reset password' : 'Answer your security question'}
                    </p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-shake relative z-10">
                        <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        <p className="text-sm font-bold text-rose-700">{error}</p>
                    </div>
                )}

                {message && (
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex flex-col gap-2 relative z-10">
                        <div className="flex items-center gap-3 text-emerald-700">
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            <p className="text-sm font-bold">Password Reset Complete!</p>
                        </div>
                        <p className="text-xs text-emerald-600 font-medium leading-relaxed mt-1">
                            Your password has been securely updated. Redirecting you to the Login page in 3 seconds...
                        </p>
                    </div>
                )}

                {!message && (
                    <>
                        {/* Step 1 Form */}
                        {step === 1 && (
                            <form className="space-y-6 relative z-10" onSubmit={handleEmailSubmit}>
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
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-4 rounded-2xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Checking Email...
                                            </>
                                        ) : 'Next Step'}
                                    </button>
                                </div>
                                <div className="text-center pt-2">
                                    <p className="text-sm font-medium text-slate-500">
                                        Remember password?{' '}
                                        <Link to="/login" className="font-bold text-primary hover:text-secondary underline underline-offset-4 transition-all">
                                            Log In
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        )}

                        {/* Step 2 Form */}
                        {step === 2 && (
                            <form className="space-y-6 relative z-10" onSubmit={handleResetSubmit}>
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">Your Question</span>
                                    <p className="text-sm font-bold text-slate-800 leading-relaxed">
                                        "{securityQuestion}"
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Your Answer</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                        placeholder="Type answer here"
                                        value={securityAnswer}
                                        onChange={(e) => setSecurityAnswer(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                            placeholder="6+ chars"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Confirm Password</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                            placeholder="Confirm"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setStep(1); setSecurityAnswer(''); setPassword(''); setConfirmPassword(''); }}
                                        className="px-6 py-4 bg-white border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`flex-grow py-4 rounded-2xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Updating Password...
                                            </>
                                        ) : 'Verify & Reset'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
