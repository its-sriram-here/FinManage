import React, { useState, useEffect } from 'react';
import { useFinance } from '../hooks/useFinance';

const Goals = () => {
    const { goals, fetchGoals, addGoal, editGoal, deleteGoal } = useFinance();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [activeGoalInput, setActiveGoalInput] = useState(null); // id of goal to show contribute/withdraw fields
    const [amountUpdate, setAmountUpdate] = useState('');
    
    const [formData, setFormData] = useState({
        title: '',
        targetAmount: '',
        currentAmount: '0',
        targetDate: ''
    });

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                title: formData.title,
                targetAmount: Number(formData.targetAmount),
                currentAmount: Number(formData.currentAmount || 0),
                targetDate: formData.targetDate
            };

            if (editingId) {
                await editGoal(editingId, data);
                setEditingId(null);
            } else {
                await addGoal(data);
            }

            setIsAdding(false);
            setFormData({
                title: '',
                targetAmount: '',
                currentAmount: '0',
                targetDate: ''
            });
        } catch (error) {
            console.error('Failed to save goal', error);
        }
    };

    const handleEdit = (g) => {
        setFormData({
            title: g.title,
            targetAmount: g.targetAmount,
            currentAmount: g.currentAmount,
            targetDate: new Date(g.targetDate).toISOString().split('T')[0]
        });
        setEditingId(g._id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await deleteGoal(id);
            } catch (error) {
                console.error('Failed to delete goal', error);
            }
        }
    };

    const handleProgressUpdate = async (goal, type) => {
        const val = Number(amountUpdate);
        if (isNaN(val) || val <= 0) {
            alert('Please enter a valid amount greater than 0');
            return;
        }

        let newAmount = goal.currentAmount;
        if (type === 'contribute') {
            newAmount = goal.currentAmount + val;
        } else if (type === 'withdraw') {
            newAmount = Math.max(0, goal.currentAmount - val);
        }

        try {
            await editGoal(goal._id, { currentAmount: newAmount });
            setAmountUpdate('');
            setActiveGoalInput(null);
        } catch (error) {
            console.error('Failed to update progress', error);
        }
    };

    const getRemainingDays = (dateStr) => {
        const diffTime = new Date(dateStr) - new Date();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'Ended';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays > 30) {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months > 1 ? 's' : ''} left`;
        }
        return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    };

    return (
        <div className="space-y-10 animate-slide-up">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                        Financial Goals
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight">
                        Set targets, accumulate savings, and track milestones.
                    </p>
                </div>

                <button
                    onClick={() => { setIsAdding(true); setEditingId(null); }}
                    className="px-6 py-4 bg-primary text-white font-bold rounded-2xl premium-button-shadow hover:bg-primary-dark transition-all active:scale-95 text-sm self-start md:self-auto"
                >
                    New Savings Goal
                </button>
            </div>

            {/* Goal Creation Form */}
            {isAdding && (
                <div className="glass-card p-5 sm:p-8 rounded-3xl md:rounded-[2.5rem] animate-fade-in relative z-10 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
                    <h2 className="text-xl font-extrabold text-slate-900 font-display mb-6">
                        {editingId ? 'Modify Goal' : 'Define New Goal'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Goal Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-3 px-5 text-sm font-bold text-slate-800 transition-all outline-none"
                                placeholder="e.g., Tesla Downpayment, Emergency Fund"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Target Amount (₹)</label>
                            <input
                                type="number"
                                name="targetAmount"
                                required
                                min="1"
                                value={formData.targetAmount}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-3 px-5 text-sm font-bold text-slate-800 transition-all outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Target Date</label>
                            <input
                                type="date"
                                name="targetDate"
                                required
                                value={formData.targetDate}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-3 px-5 text-sm font-bold text-slate-800 transition-all outline-none"
                            />
                        </div>
                        {!editingId && (
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Initial Savings Contribution (₹)</label>
                                <input
                                    type="number"
                                    name="currentAmount"
                                    min="0"
                                    value={formData.currentAmount}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-3 px-5 text-sm font-bold text-slate-800 transition-all outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        )}
                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                className="px-10 py-4 bg-primary text-white font-bold rounded-2xl premium-button-shadow hover:bg-primary-dark transition-all active:scale-95 text-sm"
                            >
                                {editingId ? 'Update Goal' : 'Launch Goal'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Goals Display Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {goals.length > 0 ? (
                    goals.map((g) => {
                        const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) || 0;
                        const isAchieved = percent >= 100;
                        return (
                            <div key={g._id} className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] flex flex-col group hover:shadow-xl transition-all duration-500 relative overflow-hidden border border-slate-200/50">
                                {isAchieved && (
                                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                                        Goal Achieved 🎉
                                    </div>
                                )}
                                <div className="mb-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                                        {getRemainingDays(g.targetDate)}
                                    </span>
                                </div>

                                <h3 className="text-xl font-extrabold text-slate-800 font-display mt-2 truncate">{g.title}</h3>

                                <div className="mt-6 space-y-2">
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                                        <span>Progress</span>
                                        <span className={isAchieved ? 'text-emerald-500 font-extrabold' : 'text-primary'}>
                                            {percent}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${isAchieved ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-primary to-secondary'}`}
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Savings Target</span>
                                        <span className="text-base font-bold text-slate-800 font-display">₹{g.targetAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Saved To Date</span>
                                        <span className={`text-base font-bold font-display ${isAchieved ? 'text-emerald-600' : 'text-slate-800'}`}>₹{g.currentAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                {/* Fund Contributions controls */}
                                {activeGoalInput === g._id ? (
                                    <div className="mt-6 space-y-3 animate-fade-in">
                                        <input
                                            type="number"
                                            value={amountUpdate}
                                            onChange={(e) => setAmountUpdate(e.target.value)}
                                            placeholder="Enter amount (₹)..."
                                            className="w-full bg-white border border-slate-200 focus:border-primary/30 rounded-xl py-2 px-4 text-sm font-semibold outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleProgressUpdate(g, 'contribute')}
                                                className="flex-1 py-2 bg-emerald-500 text-white font-bold rounded-xl text-xs hover:bg-emerald-600 active:scale-95 transition-all"
                                            >
                                                Add Funds
                                            </button>
                                            {g.currentAmount > 0 && (
                                                <button
                                                    onClick={() => handleProgressUpdate(g, 'withdraw')}
                                                    className="flex-1 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 active:scale-95 transition-all"
                                                >
                                                    Withdraw
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setActiveGoalInput(null)}
                                                className="py-2 px-3 bg-white border border-slate-200 text-slate-500 font-bold rounded-xl text-xs hover:bg-slate-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-6 flex gap-2">
                                        <button
                                            onClick={() => { setActiveGoalInput(g._id); setAmountUpdate(''); }}
                                            className="flex-1 py-2.5 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl text-xs transition-colors active:scale-95"
                                        >
                                            Transfer Funds
                                        </button>
                                        <button
                                            onClick={() => handleEdit(g)}
                                            className="p-2.5 bg-slate-50 text-slate-500 hover:text-primary hover:bg-white rounded-xl border border-slate-100 shadow-sm transition-all"
                                            title="Edit Goal"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(g._id)}
                                            className="p-2.5 bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-xl border border-rose-100 transition-all"
                                            title="Delete Goal"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-20 text-center flex flex-col items-center glass-card rounded-[2.5rem] border border-slate-200/50">
                        <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-800 font-display">No Goals Configured</h3>
                        <p className="mt-2 text-slate-500 font-medium max-w-sm">Dream it, configure it, and track it. Launch your first savings target today!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Goals;
