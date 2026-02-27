import React, { useState, useEffect } from 'react';
import { useFinance } from '../hooks/useFinance';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { summary, budgetLimit, fetchSummary, updateBudget } = useFinance();
    const { user } = useAuth();
    const [currentMonth, setCurrentMonth] = useState(
        new Date().toISOString().slice(0, 7) // YYYY-MM
    );
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [newBudgetLimit, setNewBudgetLimit] = useState(budgetLimit);

    useEffect(() => {
        fetchSummary(currentMonth);
    }, [currentMonth]);

    useEffect(() => {
        setNewBudgetLimit(budgetLimit);
    }, [budgetLimit]);

    const handleBudgetUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateBudget(currentMonth, Number(newBudgetLimit));
            setIsEditingBudget(false);
        } catch (error) {
            console.error('Failed to update budget', error);
        }
    };

    const isOverBudget = budgetLimit > 0 && summary?.totalExpense > budgetLimit;

    return (
        <div className="space-y-10 animate-slide-up">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight">
                        Comprehensive overview of your financial health.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60">
                    <label htmlFor="month-select" className="pl-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Select Month</label>
                    <input
                        type="month"
                        id="month-select"
                        value={currentMonth}
                        onChange={(e) => setCurrentMonth(e.target.value)}
                        className="text-sm font-bold border-none focus:ring-0 text-slate-800 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl"
                    />
                </div>
            </div>

            {isOverBudget && (
                <div className="bg-rose-50/80 backdrop-blur-sm border border-rose-200 p-6 rounded-3xl flex items-center gap-4 animate-fade-in shadow-sm">
                    <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-rose-800 font-display">Budget Alert</h3>
                        <p className="text-rose-700/80 font-medium text-sm">
                            You've exceeded your limit by <span className="font-bold underline">₹{(summary?.totalExpense - budgetLimit).toFixed(2)}</span>. Time to re-evaluate!
                        </p>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Income Card */}
                <div className="glass-card p-8 rounded-[2rem] flex flex-col group hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Total Income</span>
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        </div>
                    </div>
                    <div className="text-4xl font-extrabold text-slate-900 font-display mb-2">
                        ₹{summary?.totalIncome?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-emerald-600 text-xs font-bold bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100/50">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>
                        Up 12% vs last month
                    </div>
                </div>

                {/* Expense Card */}
                <div className="glass-card p-8 rounded-[2rem] flex flex-col group hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Total Expenses</span>
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <div className="text-4xl font-extrabold text-slate-900 font-display mb-2">
                        ₹{summary?.totalExpense?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                    </div>
                    {budgetLimit > 0 && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                                <span>Budget Usage</span>
                                <span className={isOverBudget ? 'text-rose-500' : 'text-primary'}>
                                    {Math.round((summary?.totalExpense / budgetLimit) * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${isOverBudget ? 'bg-gradient-to-r from-rose-500 to-rose-400' : 'bg-gradient-to-r from-primary to-secondary'}`}
                                    style={{ width: `${Math.min((summary?.totalExpense / budgetLimit) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Savings Card */}
                <div className="glass-card p-8 rounded-[2rem] flex flex-col group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl opacity-50 rounded-full"></div>
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Net Savings</span>
                        <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-primary/10">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                    </div>
                    <div className={`text-4xl font-extrabold font-display mb-2 ${summary?.netSavings >= 0 ? 'premium-gradient-text' : 'text-rose-600'}`}>
                        ₹{summary?.netSavings?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                    </div>
                    <p className="mt-4 text-xs font-medium text-slate-500">
                        Current balance for this billing period.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Budget Manager */}
                <div className="lg:col-span-2 glass-card p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/5 blur-3xl rounded-full -mb-32 -mr-32 transition-all duration-700 group-hover:bg-secondary/10"></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">Financial Constraints</h2>
                            <p className="text-slate-500 text-sm font-medium mt-1">Define your spending threshold to maintain discipline.</p>
                        </div>
                        {!isEditingBudget && (
                            <button
                                onClick={() => setIsEditingBudget(true)}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md active:scale-95 whitespace-nowrap"
                            >
                                {budgetLimit > 0 ? 'Update Threshold' : 'Configure Budget'}
                            </button>
                        )}
                    </div>

                    {isEditingBudget ? (
                        <form onSubmit={handleBudgetUpdate} className="flex flex-col sm:flex-row gap-4 animate-fade-in relative z-10">
                            <div className="flex-grow">
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within/input:text-primary text-slate-400 transition-colors">
                                        <span className="text-lg font-bold font-display">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={newBudgetLimit}
                                        onChange={(e) => setNewBudgetLimit(e.target.value)}
                                        className="w-full pl-10 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl text-lg font-bold text-slate-800 transition-all outline-none"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 sm:flex-none px-10 py-4 bg-primary text-white font-bold rounded-2xl premium-button-shadow hover:bg-primary-dark transition-all active:scale-95"
                                >
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingBudget(false)}
                                    className="px-6 py-4 bg-white border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="relative z-10">
                            {budgetLimit > 0 ? (
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Active Cap</div>
                                        <div className="text-3xl font-extrabold text-slate-800 font-display">₹{budgetLimit.toFixed(2)}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-6 text-center">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p className="text-slate-500 font-medium max-w-xs">No active spending limit for this month. Configure one to enable AI alerts.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Link */}
                <div className="h-full">
                    <Link
                        to="/transactions"
                        className="group glass-card h-full p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 hover:border-primary/30 transition-all border-dashed border-2"
                    >
                        <div className="w-14 h-14 bg-slate-50 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-all duration-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 font-display">Manage List</h3>
                        <p className="text-sm font-medium text-slate-500 px-4">Analyze and modify your full transaction history.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
