import React, { useState, useEffect } from 'react';
import { useFinance } from '../hooks/useFinance';

const Transactions = () => {
    const { 
        transactions, 
        fetchTransactions, 
        addTransaction, 
        deleteTransaction, 
        editTransaction,
        toggleRepaymentStatus
    } = useFinance();
    
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Search and Filtering States
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    const [formData, setFormData] = useState({
        type: 'income',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        lentTo: '',
        isRepaid: false
    });

    useEffect(() => {
        fetchTransactions(currentMonth);
    }, [currentMonth]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                type: formData.type,
                amount: Number(formData.amount),
                category: formData.category,
                description: formData.description,
                date: formData.date,
                lentTo: formData.type === 'lend' ? formData.lentTo : '',
                isRepaid: formData.type === 'lend' ? formData.isRepaid : false
            };

            if (editingId) {
                await editTransaction(editingId, submitData);
                setEditingId(null);
            } else {
                await addTransaction(submitData);
                setIsAdding(false);
            }
            
            setFormData({
                type: 'income',
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                lentTo: '',
                isRepaid: false
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
            description: t.description || '',
            date: new Date(t.date).toISOString().split('T')[0],
            lentTo: t.lentTo || '',
            isRepaid: t.isRepaid || false
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

    const handleToggleRepaid = async (t) => {
        try {
            await toggleRepaymentStatus(t._id, t.isRepaid);
        } catch (error) {
            console.error('Failed to toggle repayment', error);
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
            date: new Date().toISOString().split('T')[0],
            lentTo: '',
            isRepaid: false
        });
    };

    // Extract Unique Categories for dynamic filter dropdown
    const categoriesList = ['all', ...new Set(transactions.map(t => t.category.trim()).filter(Boolean))];

    // Filter and Sort Transactions on Client-side
    const filteredTransactions = transactions
        .filter((t) => {
            const matchesSearch = 
                t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (t.lentTo && t.lentTo.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesType = filterType === 'all' || t.type === filterType;
            const matchesCategory = filterCategory === 'all' || t.category.toLowerCase().trim() === filterCategory.toLowerCase().trim();

            return matchesSearch && matchesType && matchesCategory;
        })
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'date') {
                comparison = new Date(a.date) - new Date(b.date);
            } else if (sortBy === 'amount') {
                comparison = a.amount - b.amount;
            } else if (sortBy === 'category') {
                comparison = a.category.localeCompare(b.category);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    return (
        <div className="space-y-10 animate-slide-up">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                        Transactions
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight">
                        Detailed ledger of your incomes, expenses, and lendings.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60">
                        <span className="pl-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Billing Period</span>
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
                        New Entry
                    </button>
                </div>
            </div>

            {/* Creation/Edit Form */}
            {isAdding && (
                <div className="glass-card p-5 sm:p-8 rounded-3xl md:rounded-[2.5rem] animate-fade-in relative z-10 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
                    <h2 className="text-xl font-extrabold text-slate-900 font-display mb-6">{editingId ? 'Edit Ledger Record' : 'Create Ledger Record'}</h2>
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
                                <option value="lend">Lend Money</option>
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
                        
                        {/* Dynamic Lending Field */}
                        {formData.type === 'lend' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Lent To (Person Name)</label>
                                <input
                                    type="text"
                                    name="lentTo"
                                    required
                                    value={formData.lentTo}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-3 px-5 text-sm font-bold text-slate-800 transition-all outline-none"
                                    placeholder="Enter person's name"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                            <input
                                type="text"
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-3 px-5 text-sm font-bold text-slate-800 transition-all outline-none"
                                placeholder="e.g. Salary, Utilities, Food"
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

                        {formData.type === 'lend' && (
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl md:col-span-2">
                                <input
                                    type="checkbox"
                                    id="isRepaid"
                                    name="isRepaid"
                                    checked={formData.isRepaid}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer"
                                />
                                <label htmlFor="isRepaid" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                                    Already fully repaid
                                </label>
                            </div>
                        )}

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Description (Optional)</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-3 px-5 text-sm font-bold text-slate-800 transition-all outline-none"
                                placeholder="Explain the context of this entry..."
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
                                {editingId ? 'Update Ledger' : 'Confirm Ledger'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Advanced Filters & Controls Panel */}
            <div className="glass-card p-6 rounded-[2rem] border-slate-200/50 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    {/* Search Field */}
                    <div className="relative w-full lg:max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search descriptions, categories, lent names..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-5 py-3.5 bg-slate-50/50 border-2 border-slate-100 focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl text-sm font-semibold text-slate-800 transition-all outline-none"
                        />
                    </div>

                    {/* Filter Type, Category, Sort Controls */}
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
                        {/* Type Filter */}
                        <div className="flex items-center gap-2 bg-slate-50/80 px-4 py-2.5 rounded-2xl border border-slate-100">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="text-xs font-bold bg-transparent border-none focus:ring-0 text-slate-700 outline-none cursor-pointer"
                            >
                                <option value="all">All</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                                <option value="lend">Lended</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2 bg-slate-50/80 px-4 py-2.5 rounded-2xl border border-slate-100">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="text-xs font-bold bg-transparent border-none focus:ring-0 text-slate-700 outline-none cursor-pointer"
                            >
                                {categoriesList.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Controls */}
                        <div className="flex items-center gap-2 bg-slate-50/80 px-4 py-2.5 rounded-2xl border border-slate-100">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sort</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-xs font-bold bg-transparent border-none focus:ring-0 text-slate-700 outline-none cursor-pointer mr-1"
                            >
                                <option value="date">Date</option>
                                <option value="amount">Amount</option>
                                <option value="category">Category</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="p-1 hover:bg-slate-200/50 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                            >
                                {sortOrder === 'asc' ? (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Ledger Table */}
            <div className="glass-card rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-slate-200/50">
                {filteredTransactions.length > 0 ? (
                    <div>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th scope="col" className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Date</th>
                                        <th scope="col" className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Category</th>
                                        <th scope="col" className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Purpose / Recipient</th>
                                        <th scope="col" className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                                        <th scope="col" className="px-8 py-6 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Control</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-50">
                                    {filteredTransactions.map((t) => {
                                        const isLending = t.type === 'lend';
                                        return (
                                            <tr key={t._id} className="hover:bg-slate-50/50 transition-all group">
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <span className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                        {new Date(t.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2.5 h-2.5 rounded-full ${
                                                            t.type === 'income' 
                                                                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' 
                                                                : t.type === 'expense' 
                                                                ? 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]'
                                                                : 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                                        }`}></div>
                                                        <span className="text-sm font-bold text-slate-700">{t.category}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-medium text-slate-500 truncate block max-w-[220px]">
                                                            {t.description || '—'}
                                                        </span>
                                                        {isLending && (
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100/50">
                                                                    Lent to: {t.lentTo}
                                                                </span>
                                                                {t.isRepaid ? (
                                                                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50 flex items-center gap-0.5">
                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                                        Repaid
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[10px] font-extrabold text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100/50">
                                                                        Owed
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <span className={`text-lg font-bold font-display ${
                                                        t.type === 'income' 
                                                            ? 'text-emerald-600' 
                                                            : t.type === 'expense' 
                                                            ? 'text-slate-800'
                                                            : 'text-amber-600'
                                                    }`}>
                                                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                        {isLending && (
                                                            <button
                                                                onClick={() => handleToggleRepaid(t)}
                                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                                                                    t.isRepaid 
                                                                        ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                                                                        : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100/60'
                                                                }`}
                                                                title={t.isRepaid ? 'Mark Owed' : 'Mark Repaid'}
                                                            >
                                                                {t.isRepaid ? 'Re-open Debt' : 'Got Repayment'}
                                                            </button>
                                                        )}
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
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Stackable Cards View */}
                        <div className="block md:hidden divide-y divide-slate-100 bg-white">
                            {filteredTransactions.map((t) => {
                                const isLending = t.type === 'lend';
                                return (
                                    <div key={t._id} className="p-5 space-y-4 hover:bg-slate-50/30 transition-colors">
                                        <div className="flex justify-between items-start">
                                            {/* Left side: Date + Category + Description */}
                                            <div className="space-y-1 max-w-[70%]">
                                                <div className="flex items-center flex-wrap gap-2">
                                                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                        {new Date(t.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            t.type === 'income' 
                                                                ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' 
                                                                : t.type === 'expense' 
                                                                ? 'bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.5)]'
                                                                : 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                                                        }`}></div>
                                                        <span className="text-xs font-bold text-slate-700">{t.category}</span>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-semibold text-slate-800 pt-1 leading-snug break-words">
                                                    {t.description || '—'}
                                                </div>
                                                {isLending && (
                                                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100/50">
                                                            Lent to: {t.lentTo}
                                                        </span>
                                                        {t.isRepaid ? (
                                                            <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50 flex items-center gap-0.5">
                                                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                                Repaid
                                                            </span>
                                                        ) : (
                                                            <span className="text-[9px] font-extrabold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100/50">
                                                                Owed
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right side: Amount */}
                                            <div className="text-right">
                                                <span className={`text-base font-bold font-display ${
                                                    t.type === 'income' 
                                                        ? 'text-emerald-600' 
                                                        : t.type === 'expense' 
                                                        ? 'text-slate-800'
                                                        : 'text-amber-600'
                                                }`}>
                                                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action buttons inside card */}
                                        <div className="flex items-center gap-2 pt-1">
                                            {isLending && (
                                                <button
                                                    onClick={() => handleToggleRepaid(t)}
                                                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                                                        t.isRepaid 
                                                            ? 'bg-slate-50 border-slate-200 text-slate-500'
                                                            : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                                    }`}
                                                >
                                                    {t.isRepaid ? 'Re-open Debt' : 'Got Repayment'}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleEdit(t)}
                                                className="px-3.5 py-2 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t._id)}
                                                className="px-3.5 py-2 bg-rose-50/70 text-rose-500 rounded-xl border border-rose-100/50 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-800 font-display">No Ledger Matches</h3>
                        <p className="mt-2 text-slate-500 font-medium max-w-sm">No transactions match the selected billing period or search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
