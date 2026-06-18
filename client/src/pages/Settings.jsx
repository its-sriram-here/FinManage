import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const Settings = () => {
    const { user, updatePassword } = useAuth();
    const [activeTab, setActiveTab] = useState('password');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Security Question States
    const [securityPassword, setSecurityPassword] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [errorQuestion, setErrorQuestion] = useState('');
    const [successQuestion, setSuccessQuestion] = useState('');
    const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

    const handleSecuritySubmit = async (e) => {
        e.preventDefault();
        setErrorQuestion('');
        setSuccessQuestion('');

        if (!securityQuestion) {
            setErrorQuestion('Please select a security question');
            return;
        }

        if (securityAnswer.trim().length < 2) {
            setErrorQuestion('Security answer must be at least 2 characters');
            return;
        }

        setIsLoadingQuestion(true);
        try {
            await api.put('/auth/updatesecurity', {
                password: securityPassword,
                securityQuestion,
                securityAnswer
            });
            setSuccessQuestion('Recovery question updated successfully!');
            setSecurityPassword('');
            setSecurityQuestion('');
            setSecurityAnswer('');
        } catch (err) {
            setErrorQuestion(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to update recovery question');
        } finally {
            setIsLoadingQuestion(false);
        }
    };

    const validateForm = () => {
        const symbolRegex = /[^a-zA-Z0-9]/;
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return false;
        }
        if (!symbolRegex.test(newPassword)) {
            setError('New password must include at least one symbol or special character');
            return false;
        }
        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await updatePassword(currentPassword, newPassword);
            setSuccess('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
            <div className="space-y-8">
                {/* Header title */}
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-display">Account Settings</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Manage your security credentials and account preferences.</p>
                </div>

                {/* Horizontal Profile Header */}
                {user && (
                    <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200/50 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden bg-white shadow-sm">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-indigo-500 to-secondary"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none"></div>
                        
                        {/* Avatar with dynamic glow */}
                        <div className="relative group/avatar">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-35 group-hover/avatar:opacity-60 transition duration-500"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        
                        {/* Profile Information */}
                        <div className="flex-grow text-center sm:text-left space-y-2 relative z-10">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
                                <h2 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">{user.name}</h2>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full w-fit mx-auto sm:mx-0 border border-emerald-100">
                                    Active Account
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-slate-500">{user.email}</p>
                            {user.createdAt && (
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Tabbed Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                    {/* Left Column Navigation */}
                    <div className="md:col-span-1 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-none">
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`flex-grow md:flex-initial flex items-center justify-center md:justify-start gap-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                                activeTab === 'password'
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                    : 'bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-slate-200/40'
                            }`}
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="truncate">Password</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('recovery')}
                            className={`flex-grow md:flex-initial flex items-center justify-center md:justify-start gap-3 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                                activeTab === 'recovery'
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                    : 'bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-slate-200/40'
                            }`}
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="truncate">Recovery</span>
                        </button>
                    </div>

                    {/* Right Column Forms */}
                    <div className="md:col-span-3">
                        {activeTab === 'password' ? (
                            /* Password Edit Panel */
                            <div className="glass-card p-6 md:p-10 rounded-[2rem] border border-slate-200/50 bg-white relative overflow-hidden animate-slide-up shadow-sm">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-2xl rounded-full pointer-events-none"></div>

                                <div className="mb-8 relative z-10">
                                    <h3 className="text-xl font-extrabold text-slate-800 font-display">Update Password</h3>
                                    <p className="text-xs text-slate-400 font-semibold mt-1">Ensure your account is protected with a cryptographically strong password.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    {/* Notifications */}
                                    {error && (
                                        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-shake">
                                            <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-xs font-bold text-rose-700">{error}</p>
                                        </div>
                                    )}
                                    {success && (
                                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 animate-fade-in">
                                            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-xs font-bold text-emerald-700">{success}</p>
                                        </div>
                                    )}

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Current Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full bg-slate-50/50 border border-slate-200/60 focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                                placeholder="••••••••"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">New Password</label>
                                                <input
                                                    type="password"
                                                    required
                                                    className="w-full bg-slate-50/50 border border-slate-200/60 focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                                    placeholder="6+ chars & symbols"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    required
                                                    className="w-full bg-slate-50/50 border border-slate-200/60 focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                                    placeholder="Confirm new password"
                                                    value={confirmNewPassword}
                                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-4 mt-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving Password...
                                            </>
                                        ) : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            /* Security Question Recovery Panel */
                            <div className="glass-card p-6 md:p-10 rounded-[2rem] border border-slate-200/50 bg-white relative overflow-hidden animate-slide-up shadow-sm">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary"></div>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 blur-2xl rounded-full pointer-events-none"></div>

                                <div className="mb-8 relative z-10">
                                    <h3 className="text-xl font-extrabold text-slate-800 font-display">Recovery Question</h3>
                                    <p className="text-xs text-slate-400 font-semibold mt-1">Configure a security question to authorize password recovery if you forget it.</p>
                                </div>

                                <form onSubmit={handleSecuritySubmit} className="space-y-6 relative z-10">
                                    {/* Notifications */}
                                    {errorQuestion && (
                                        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-shake">
                                            <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-xs font-bold text-rose-700">{errorQuestion}</p>
                                        </div>
                                    )}
                                    {successQuestion && (
                                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 animate-fade-in">
                                            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-xs font-bold text-emerald-700">{successQuestion}</p>
                                        </div>
                                    )}

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Confirm Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full bg-slate-50/50 border border-slate-200/60 focus:border-secondary/20 focus:bg-white focus:ring-4 focus:ring-secondary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                                placeholder="••••••••"
                                                value={securityPassword}
                                                onChange={(e) => setSecurityPassword(e.target.value)}
                                            />
                                            <p className="mt-1.5 text-[9px] text-slate-400 font-bold px-1 uppercase tracking-wider">Confirm your password to apply security changes</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Security Question</label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    value={securityQuestion}
                                                    onChange={(e) => setSecurityQuestion(e.target.value)}
                                                    className="w-full bg-slate-50/50 border border-slate-200/60 focus:border-secondary/30 focus:bg-white focus:ring-4 focus:ring-secondary/5 rounded-2xl py-4 pl-6 pr-12 text-sm font-semibold text-slate-800 transition-all outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="">Select a recovery question...</option>
                                                    <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                                                    <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                                                    <option value="What was the name of your first school?">What was the name of your first school?</option>
                                                    <option value="In what city were you born?">In what city were you born?</option>
                                                    <option value="What is your favorite movie?">What is your favorite movie?</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Security Answer</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-slate-50/50 border border-slate-200/60 focus:border-secondary/30 focus:bg-white focus:ring-4 focus:ring-secondary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                                placeholder="Your answer here (case-insensitive)"
                                                value={securityAnswer}
                                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoadingQuestion}
                                        className={`w-full py-4 mt-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 ${isLoadingQuestion ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoadingQuestion ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating Security Question...
                                            </>
                                        ) : 'Update Recovery Question'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
