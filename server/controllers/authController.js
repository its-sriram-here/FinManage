const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, securityQuestion, securityAnswer } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Hash password and security answer
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            securityQuestion,
            securityAnswer: hashedAnswer
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(401);
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user security question by email
// @route   POST /api/auth/forgotpassword/question
// @access  Public
const getSecurityQuestion = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error('There is no user registered with this email address');
        }

        if (!user.securityQuestion) {
            res.status(400);
            throw new Error('No recovery question has been configured for this account yet. Please log in normally and configure it under Settings.');
        }

        res.status(200).json({ 
            email: user.email, 
            securityQuestion: user.securityQuestion 
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update security question and answer
// @route   PUT /api/auth/updatesecurity
// @access  Private
const updateSecurityQuestion = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { password, securityQuestion, securityAnswer } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401);
            throw new Error('Current password is incorrect');
        }

        // Hash security answer
        const salt = await bcrypt.genSalt(10);
        const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), salt);

        // Update fields
        user.securityQuestion = securityQuestion;
        user.securityAnswer = hashedAnswer;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Recovery question updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password using security question & answer
// @route   POST /api/auth/forgotpassword/reset
// @access  Public
const resetWithSecurityQuestion = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, securityAnswer, password } = req.body;
        const user = await User.findOne({ email }).select('+securityAnswer');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Check security answer
        const isMatch = await bcrypt.compare(
            securityAnswer.toLowerCase().trim(), 
            user.securityAnswer
        );

        if (!isMatch) {
            res.status(401);
            throw new Error('Incorrect security answer');
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful. You can now login with your new credentials.'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updatePassword,
    getSecurityQuestion,
    resetWithSecurityQuestion,
    updateSecurityQuestion
};
