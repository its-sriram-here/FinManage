const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal
} = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

router
    .route('/')
    .get(protect, getGoals)
    .post(
        protect,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('targetAmount', 'Target amount must be a positive number').isNumeric({ min: 0.01 }),
            check('targetDate', 'Target date is required').not().isEmpty()
        ],
        createGoal
    );

router
    .route('/:id')
    .put(protect, updateGoal)
    .delete(protect, deleteGoal);

module.exports = router;
