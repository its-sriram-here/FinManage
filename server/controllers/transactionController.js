const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');

// @desc    Get all transactions for logged in user (with optional month filter)
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
    try {
        const { month } = req.query; // format: YYYY-MM
        let query = { user: req.user.id };

        if (month) {
            const startDate = new Date(`${month}-01T00:00:00.000Z`);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            query.date = {
                $gte: startDate,
                $lt: endDate,
            };
        }

        const transactions = await Transaction.find(query).sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { type, amount, category, description, date } = req.body;

        const transaction = await Transaction.create({
            user: req.user.id,
            type,
            amount,
            category,
            description,
            date,
        });

        res.status(201).json(transaction);
    } catch (error) {
        next(error);
    }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            res.status(404);
            throw new Error('Transaction not found');
        }

        // Checking if transaction belongs to user
        if (transaction.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedTransaction);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            res.status(404);
            throw new Error('Transaction not found');
        }

        // Checking if transaction belongs to user
        if (transaction.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await transaction.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
};
