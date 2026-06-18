const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense', 'lend'],
        required: [true, 'Please specify transaction type (income, expense, or lend)']
    },
    lentTo: {
        type: String
    },
    isRepaid: {
        type: Boolean,
        default: false
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
        required: [true, 'Please add a date']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create index for aggregation performance
transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
