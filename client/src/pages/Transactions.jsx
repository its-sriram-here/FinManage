import React, { useState, useEffect } from 'react';
import { useFinance } from '../hooks/useFinance';

const Transactions = () => {
    const { transactions, fetchTransactions, addTransaction, deleteTransaction, editTransaction } = useFinance();
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        type: 'income',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchTransactions(currentMonth);
    }, [currentMonth]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await editTransaction(editingId, { ...formData, amount: Number(formData.amount) });
                setEditingId(null);
            } else {
                await addTransaction({ ...formData, amount: Number(formData.amount) });
                setIsAdding(false);
            }
            setFormData({
                type: 'income',
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error('Failed to save transaction', error);
        }
    };

    const handleEdit = (t) => {
        setFormData({
            type: t.type,
            amount: t.amount,
            category: t.category,
            description: t.description,
            date: new Date(t.date).toISOString().split('T')[0]
        });
        setEditingId(t._id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteTransaction(id);
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    const cancelEdit = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({
            type: 'income',
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <div className="space-y-10 animate-slide-up">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                        Transactions
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight">
                        Detailed ledger of your movements.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60">
                        <span className="pl-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter</span>
                        <input
                            type="month"
                            value={currentMonth}
                            onChange={(e) => setCurrentMonth(e.target.value)}
                            className="text-sm font-bold border-none focus:ring-0 text-slate-800 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl"
                        />
                    </div>
                    <button
                        onClick={() => { setIsAdding(true); setEditingId(null); }}
                        className="px-6 py-4 bg-primary text-white font-bold rounded-2xl premium-button-shadow hover:bg-primary-dark transition-all active:scale-95 text-sm"
                    >
                        New Transaction
                    </button>
                </div>
            </div>

            {isAdding && (
                <div className="glass-card p-8 rounded-[2.5rem] animate-fade-in relative z-10 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
                    <h2 className="text-xl font-extrabold text-slate-900 font-display mb-6">{editingId ? 'Edit Entry' : 'New Entry'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-3 px-5 text-sm font-bold text-slate-800 transition-all outline-none appearance-none"
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Amount (₹)</label>
                            <input
                                type="number"
                                name="amount"
                                required
                                min="0.01"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-3 px-5 text-sm font-bold text-slate-800 transition-all outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                            <input
                                type="text"
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-3 px-5 text-sm font-bold text-slate-800 transition-all outline-none"
                                placeholder="e.g. Shopping, Rent"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-3 px-5 text-sm font-bold text-slate-800 transition-all outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Description (Optional)</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-3 px-5 text-sm font-bold text-slate-800 transition-all outline-none"
                                placeholder="Explain the purpose..."
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                className="px-10 py-4 bg-primary text-white font-bold rounded-2xl premium-button-shadow hover:bg-primary-dark transition-all active:scale-95 text-sm"
                            >
                                {editingId ? 'Update Entry' : 'Create Entry'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Transactions List */}
            <div className="glass-card rounded-[2.5rem] overflow-hidden border-slate-200/50">
                {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th scope="col" className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Date</th>
                                    <th scope="col" className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Category</th>
                                    <th scope="col" className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Purpose</th>
                                    <th scope="col" className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                                    <th scope="col" className="px-8 py-6 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Control</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {transactions.map((t) => (
                                    <tr key={t._id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                {new Date(t.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]'}`}></div>
                                                <span className="text-sm font-bold text-slate-700">{t.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-medium text-slate-400 truncate block max-w-[200px]">
                                                {t.description || '—'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className={`text-lg font-bold font-display ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(t)}
                                                    className="p-2.5 bg-slate-50 text-slate-500 hover:text-primary hover:bg-white rounded-xl border border-slate-100 shadow-sm transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t._id)}
                                                    className="p-2.5 bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-xl border border-rose-100 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-800 font-display">No Entries Found</h3>
                        <p className="mt-2 text-slate-500 font-medium max-w-sm">Synchronize your records by creating your first entry for this period.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
