const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router
    .route('/')
    .get(protect, getTransactions)
    .post(
        protect,
        [
            check('type', 'Type is required and must be either input or expense')
                .isIn(['income', 'expense']),
            check('amount', 'Valid amount is required').isNumeric(),
            check('category', 'Category is required').not().isEmpty(),
            check('date', 'Date is required').not().isEmpty(),
        ],
        createTransaction
    );

router
    .route('/:id')
    .put(protect, updateTransaction)
    .delete(protect, deleteTransaction);

module.exports = router;
