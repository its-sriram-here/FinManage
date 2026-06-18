const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    securityQuestion: {
        type: String,
        required: [true, 'Please select or write a security question']
    },
    securityAnswer: {
        type: String,
        required: [true, 'Please provide a security answer'],
        select: false
    }
});

module.exports = mongoose.model('User', userSchema);
