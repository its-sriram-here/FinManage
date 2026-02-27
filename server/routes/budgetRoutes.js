const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    getBudget,
    setBudget,
    getDashboardSummary,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

router.get('/:month', protect, getBudget);
router.get('/summary/:month', protect, getDashboardSummary);

router.post(
    '/',
    protect,
    [
        check('month', 'Month is required (YYYY-MM format)').matches(/^\d{4}-\d{2}$/),
        check('limit', 'Budget limit is required').isNumeric(),
    ],
    setBudget
);

module.exports = router;
