const { validationResult } = require('express-validator');
const Goal = require('../models/Goal');

// @desc    Get all goals for logged in user
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res, next) => {
    try {
        const goals = await Goal.find({ user: req.user.id }).sort({ targetDate: 1 });
        res.status(200).json(goals);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, targetAmount, currentAmount, targetDate } = req.body;

        const goal = await Goal.create({
            user: req.user.id,
            title,
            targetAmount,
            currentAmount: currentAmount || 0,
            targetDate
        });

        res.status(201).json(goal);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res, next) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            res.status(404);
            throw new Error('Goal not found');
        }

        // Check ownership
        if (goal.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updatedGoal = await Goal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedGoal);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res, next) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            res.status(404);
            throw new Error('Goal not found');
        }

        // Check ownership
        if (goal.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await goal.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal
};
