import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(null);
    const [budgetLimit, setBudgetLimit] = useState(0);
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

    return (
        <FinanceContext.Provider
            value={{
                transactions,
                summary,
                budgetLimit,
                fetchTransactions,
                fetchSummary,
                addTransaction,
                editTransaction,
                deleteTransaction,
                updateBudget
            }}
        >
            {children}
        </FinanceContext.Provider>
    );
};
