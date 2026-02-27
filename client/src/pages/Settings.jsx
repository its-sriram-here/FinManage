import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
    const { updatePassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 font-display">Account Settings</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage your security and account preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="glass-card p-8 rounded-[2rem] bg-slate-900 text-white shadow-xl shadow-slate-200">
                            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 text-primary-light">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold font-display mb-2">Password Security</h3>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                Use a combination of symbols and letters to keep your financial data protected.
                            </p>
                        </div>
                    </div>

                    {/* Change Password Form */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-10 md:p-12 rounded-[3rem] relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>

                            <h2 className="text-2xl font-bold text-slate-900 font-display mb-8">Change Password</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-shake">
                                        <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                        <p className="text-sm font-bold text-rose-700">{error}</p>
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                                        <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM14.707 9.293a1 1 0 00-1.414-1.414L10 11.414l-1.293-1.293a1 1 0 00-1.414 1.414L10 14.293l5-5z" clipRule="evenodd" /></svg>
                                        <p className="text-sm font-bold text-emerald-700">{success}</p>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                            placeholder="••••••••"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">New Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
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
                                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-800 transition-all outline-none"
                                                placeholder="Match new password"
                                                value={confirmNewPassword}
                                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            />
                                        </div>
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
                                                Updating Security...
                                            </>
                                        ) : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
