const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: String,
        required: [true, 'Please specify a month in format YYYY-MM'],
        match: [/^\d{4}-\d{2}$/, 'Please use YYYY-MM format']
    },
    limit: {
        type: Number,
        required: [true, 'Please add a budget limit']
    }
});

// Ensure a user can only have one budget per month
budgetSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
