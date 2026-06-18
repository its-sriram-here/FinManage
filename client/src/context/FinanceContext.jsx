import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(null);
    const [budgetLimit, setBudgetLimit] = useState(0);
    const [goals, setGoals] = useState([]);
    const { token, user } = useContext(AuthContext);

    const fetchTransactions = async (month) => {
        try {
            const url = month ? `/transactions?month=${month}` : '/transactions';
            const res = await api.get(url);
            setTransactions(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSummary = async (month) => {
        try {
            const res = await api.get(`/budgets/summary/${month}`);
            setSummary(res.data);
            setBudgetLimit(res.data.budgetLimit);
        } catch (error) {
            console.error(error);
        }
    };

    const addTransaction = async (data) => {
        try {
            const res = await api.post('/transactions', data);
            setTransactions([res.data, ...transactions]);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const editTransaction = async (id, data) => {
        try {
            const res = await api.put(`/transactions/${id}`, data);
            setTransactions(transactions.map(t => t._id === id ? res.data : t));
        } catch (error) {
            throw error;
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            setTransactions(transactions.filter(t => t._id !== id));
        } catch (error) {
            throw error;
        }
    };

    const updateBudget = async (month, limit) => {
        try {
            await api.post('/budgets', { month, limit });
            setBudgetLimit(limit);
            if (summary) setSummary({ ...summary, budgetLimit: limit });
        } catch (error) {
            throw error;
        }
    };

    const toggleRepaymentStatus = async (id, currentRepaidStatus) => {
        try {
            const res = await api.put(`/transactions/${id}`, { isRepaid: !currentRepaidStatus });
            setTransactions(transactions.map(t => t._id === id ? res.data : t));
            return res.data;
        } catch (error) {
            console.error('Failed to toggle repayment status', error);
            throw error;
        }
    };

    const fetchGoals = async () => {
        try {
            const res = await api.get('/goals');
            setGoals(res.data);
        } catch (error) {
            console.error('Failed to fetch goals', error);
        }
    };

    const addGoal = async (goalData) => {
        try {
            const res = await api.post('/goals', goalData);
            setGoals([...goals, res.data]);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const editGoal = async (id, goalData) => {
        try {
            const res = await api.put(`/goals/${id}`, goalData);
            setGoals(goals.map(g => g._id === id ? res.data : g));
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const deleteGoal = async (id) => {
        try {
            await api.delete(`/goals/${id}`);
            setGoals(goals.filter(g => g._id !== id));
        } catch (error) {
            throw error;
        }
    };

    return (
        <FinanceContext.Provider
            value={{
                transactions,
                summary,
                budgetLimit,
                goals,
                fetchTransactions,
                fetchSummary,
                addTransaction,
                editTransaction,
                deleteTransaction,
                updateBudget,
                toggleRepaymentStatus,
                fetchGoals,
                addGoal,
                editGoal,
                deleteGoal
            }}
        >
            {children}
        </FinanceContext.Provider>
    );
};
