const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get or create budget for a specific month
// @route   GET /api/budgets/:month
// @access  Private
const getBudget = async (req, res, next) => {
    try {
        const { month } = req.params; // format: YYYY-MM
        const budget = await Budget.findOne({ user: req.user.id, month });

        if (budget) {
            return res.status(200).json(budget);
        } else {
            // Return a default null/0 budget info if unset
            return res.status(200).json({ user: req.user.id, month, limit: 0, isDefault: true });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Set or update a budget
// @route   POST /api/budgets
// @access  Private
const setBudget = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { month, limit } = req.body;

        let budget = await Budget.findOne({ user: req.user.id, month });

        if (budget) {
            // Update
            budget.limit = limit;
            const updatedBudget = await budget.save();
            return res.status(200).json(updatedBudget);
        } else {
            // Create
            budget = await Budget.create({
                user: req.user.id,
                month,
                limit,
            });
            return res.status(201).json(budget);
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get monthly dashboard summary
// @route   GET /api/budgets/summary/:month
// @access  Private
const getDashboardSummary = async (req, res, next) => {
    try {
        const { month } = req.params;
        const startDate = new Date(`${month}-01T00:00:00.000Z`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        // MongoDB Aggregation for Monthly Summary (Income vs Expense vs Lending)
        const summary = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id),
                    date: { $gte: startDate, $lt: endDate },
                },
            },
            {
                $group: {
                    _id: '$type',
                    totalAmount: { $sum: '$amount' },
                },
            },
        ]);

        let totalIncome = 0;
        let totalExpense = 0;
        let totalLent = 0;

        summary.forEach((item) => {
            if (item._id === 'income') totalIncome = item.totalAmount;
            if (item._id === 'expense') totalExpense = item.totalAmount;
            if (item._id === 'lend') totalLent = item.totalAmount;
        });

        const netSavings = totalIncome - totalExpense;

        // Calculate outstanding pending lending for this month
        const pendingLendAmount = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id),
                    type: 'lend',
                    isRepaid: false,
                    date: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        const totalLentPending = pendingLendAmount.length > 0 ? pendingLendAmount[0].total : 0;

        // Calculate all-time outstanding pending lending (across all months)
        const allTimePendingLendAmount = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id),
                    type: 'lend',
                    isRepaid: false
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        const totalAllTimeLentPending = allTimePendingLendAmount.length > 0 ? allTimePendingLendAmount[0].total : 0;

        // Category breakdown aggregation for expenses
        const categoryBreakdown = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id),
                    type: 'expense',
                    date: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: '$category',
                    value: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    name: '$_id',
                    value: 1,
                    _id: 0
                }
            }
        ]);

        // Daily spending aggregation for expenses
        const dailySpending = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id),
                    type: 'expense',
                    date: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    amount: { $sum: '$amount' }
                }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $project: {
                    date: '$_id',
                    amount: 1,
                    _id: 0
                }
            }
        ]);

        // Fetch budget if any
        const budget = await Budget.findOne({ user: req.user.id, month });

        res.status(200).json({
            month,
            totalIncome,
            totalExpense,
            totalLent,
            totalLentPending,
            totalAllTimeLentPending,
            netSavings,
            budgetLimit: budget ? budget.limit : 0,
            categoryBreakdown,
            dailySpending
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBudget,
    setBudget,
    getDashboardSummary,
};
