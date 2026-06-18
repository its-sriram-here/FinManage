import React, { useState, useEffect } from 'react';
import { useFinance } from '../hooks/useFinance';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

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

    // Data for Comparison Bar Chart
    const comparisonData = [
        {
            name: 'Inflow / Outflow',
            Income: summary?.totalIncome || 0,
            Expense: summary?.totalExpense || 0,
            Lent: summary?.totalLent || 0
        }
    ];

    // Data for Daily Spending Line Chart
    const dailySpendingData = summary?.dailySpending?.map(item => ({
        date: new Date(item.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }),
        Amount: item.amount
    })) || [];

    // Data for Category Pie Chart
    const categoryData = summary?.categoryBreakdown || [];

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
                    <label htmlFor="month-select" className="pl-3 text-xs font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none">Select Month</label>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Income Card */}
                <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] flex flex-col justify-between group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden border border-slate-200/50">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Income</span>
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-slate-900 font-display mb-1 truncate">
                            ₹{summary?.totalIncome?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[10px] font-bold bg-emerald-50 w-fit px-2.5 py-1 rounded-full border border-emerald-100/50">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>
                        Up 12% vs last month
                    </div>
                </div>

                {/* Expense Card */}
                <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] flex flex-col justify-between group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden border border-slate-200/50">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Expenses</span>
                            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-slate-900 font-display mb-1 truncate">
                            ₹{summary?.totalExpense?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                        </div>
                    </div>
                    {budgetLimit > 0 ? (
                        <div className="mt-4 space-y-1.5">
                            <div className="flex justify-between items-center text-[9px] font-bold uppercase text-slate-400">
                                <span>Budget Usage</span>
                                <span className={isOverBudget ? 'text-rose-500' : 'text-primary'}>
                                    {Math.round((summary?.totalExpense / budgetLimit) * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${isOverBudget ? 'bg-gradient-to-r from-rose-500 to-rose-400' : 'bg-gradient-to-r from-primary to-secondary'}`}
                                    style={{ width: `${Math.min((summary?.totalExpense / budgetLimit) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    ) : (
                        <span className="text-[10px] text-slate-400 font-medium mt-4">No budget cap active.</span>
                    )}
                </div>

                {/* Money Lent Card */}
                <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] flex flex-col justify-between group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden border border-slate-200/50">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Owed To You</span>
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-amber-600 font-display mb-1 truncate">
                            ₹{summary?.totalAllTimeLentPending?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                        </div>
                    </div>
                    <div className="mt-4 text-[10px] font-bold text-slate-400">
                        Lent this month: <span className="text-slate-700">₹{summary?.totalLent?.toLocaleString('en-IN') || '0'}</span>
                    </div>
                </div>

                {/* Savings Card */}
                <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] flex flex-col justify-between group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden border border-slate-200/50">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl opacity-50 rounded-full"></div>
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Net Savings</span>
                            <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-primary/10">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            </div>
                        </div>
                        <div className={`text-3xl font-extrabold font-display mb-1 truncate ${summary?.netSavings >= 0 ? 'premium-gradient-text' : 'text-rose-600'}`}>
                            ₹{summary?.netSavings?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                        </div>
                    </div>
                    <p className="mt-4 text-[10px] font-medium text-slate-400">
                        Income vs. Expense differential.
                    </p>
                </div>
            </div>

            {/* Financial Visualizations & Graphs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Wide Charts */}
                <div className="lg:col-span-2 space-y-8">
                    {/* 1. Daily Spending Trend (Area Chart) */}
                    <div className="glass-card p-4 sm:p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-200/50 flex flex-col justify-between">
                        <div className="mb-6">
                            <h3 className="text-xl font-extrabold text-slate-800 font-display">Daily Spending Trend</h3>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Tracks your dynamic expense outflow throughout this month</p>
                        </div>
                        <div className="h-72 w-full">
                            {dailySpendingData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dailySpendingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']} />
                                        <Area type="monotone" dataKey="Amount" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSpending)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    <span className="text-sm font-semibold">No daily expense data available.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. Inflow vs Outflow vs Lending (Comparison Bar Chart) */}
                    <div className="glass-card p-4 sm:p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-200/50 flex flex-col justify-between">
                        <div className="mb-6">
                            <h3 className="text-xl font-extrabold text-slate-800 font-display">Inflow vs. Outflow Breakdown</h3>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Comparison of Income, Expenses, and Money Lended</p>
                        </div>
                        <div className="h-64 w-full pointer-events-none md:pointer-events-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                                    <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b' }} />
                                    <Bar dataKey="Income" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={60} />
                                    <Bar dataKey="Expense" fill="#f43f5e" radius={[8, 8, 0, 0]} maxBarSize={60} />
                                    <Bar dataKey="Lent" fill="#d97706" radius={[8, 8, 0, 0]} maxBarSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar Breakdown & Budget */}
                <div className="space-y-8">
                    {/* 2. Expense Category Breakdown (Pie Chart) */}
                    <div className="glass-card p-4 sm:p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-200/50 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-800 font-display">Expense Categories</h3>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Breakdown of where you allocate your money</p>
                        </div>
                        <div className="h-60 w-full relative flex items-center justify-center mt-4 pointer-events-none md:pointer-events-auto">
                            {categoryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={85}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                                    <span className="text-sm font-semibold">No expenses recorded yet.</span>
                                </div>
                            )}
                        </div>
                        {categoryData.length > 0 && (
                            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                {categoryData.map((entry, index) => (
                                    <div key={entry.name} className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                        <span>{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Budget Limit Constraints Config */}
                    <div className="glass-card p-6 sm:p-8 rounded-3xl md:rounded-[2.5rem] relative overflow-hidden group border border-slate-200/50 h-full flex flex-col justify-between">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/5 blur-3xl rounded-full -mb-32 -mr-32 transition-all duration-700 group-hover:bg-secondary/10"></div>

                        <div>
                            <div className="flex flex-col gap-2 mb-8">
                                <h2 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">Constraints</h2>
                                <p className="text-slate-500 text-sm font-medium mt-1">Define your spending threshold to maintain discipline.</p>
                            </div>

                            {isEditingBudget ? (
                                <form onSubmit={handleBudgetUpdate} className="flex flex-col gap-4 animate-fade-in relative z-10">
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
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-3 bg-primary text-white font-bold rounded-2xl premium-button-shadow hover:bg-primary-dark transition-all active:scale-95 text-xs"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingBudget(false)}
                                            className="px-4 py-3 bg-white border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all text-xs"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="relative z-10 mb-6">
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
                                            <p className="text-slate-500 font-medium max-w-xs text-xs">No active spending limit for this month. Configure one to enable AI alerts.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {!isEditingBudget && (
                            <button
                                onClick={() => setIsEditingBudget(true)}
                                className="w-full mt-4 py-3.5 rounded-2xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md active:scale-95"
                            >
                                {budgetLimit > 0 ? 'Update Threshold' : 'Configure Budget'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Quick Action Navigation Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Link
                    to="/transactions"
                    className="group glass-card p-6 rounded-[2.5rem] flex items-center gap-4 hover:border-primary/30 transition-all border-dashed border-2 hover:-translate-y-0.5 duration-300"
                >
                    <div className="w-12 h-12 bg-slate-50 group-hover:bg-primary/10 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-all duration-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-base font-extrabold text-slate-800 font-display">Manage Ledgers</h3>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">Filter, sort, search, and update records.</p>
                    </div>
                </Link>

                <Link
                    to="/goals"
                    className="group glass-card p-6 rounded-[2.5rem] flex items-center gap-4 hover:border-secondary/30 transition-all border-dashed border-2 hover:-translate-y-0.5 duration-300"
                >
                    <div className="w-12 h-12 bg-slate-50 group-hover:bg-secondary/10 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-secondary transition-all duration-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-base font-extrabold text-slate-800 font-display">Savings Milestones</h3>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">Configure targets and fund your future goals.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
