const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a goal title']
    },
    targetAmount: {
        type: Number,
        required: [true, 'Please add a target amount']
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    targetDate: {
        type: Date,
        required: [true, 'Please specify a target date']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create index for goals query performance
goalSchema.index({ user: 1, targetDate: 1 });

module.exports = mongoose.model('Goal', goalSchema);
