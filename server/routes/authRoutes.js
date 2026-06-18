const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    registerUser,
    loginUser,
    getMe,
    updatePassword,
    getSecurityQuestion,
    resetWithSecurityQuestion,
    updateSecurityQuestion
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please use a valid Gmail address (@gmail.com)')
            .isEmail()
            .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
        check(
            'password',
            'Password must be at least 6 characters and include at least one symbol or special character'
        ).isLength({ min: 6 }).matches(/[^a-zA-Z0-9]/),
        check('securityQuestion', 'Security question selection is required').not().isEmpty(),
        check('securityAnswer', 'Security answer is required').not().isEmpty().isLength({ min: 2 }),
    ],
    registerUser
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    loginUser
);

router.get('/me', protect, getMe);

router.put(
    '/updatepassword',
    protect,
    [
        check('currentPassword', 'Current password is required').exists(),
        check(
            'newPassword',
            'New password must be at least 6 characters and include at least one symbol'
        ).isLength({ min: 6 }).matches(/[^a-zA-Z0-9]/),
    ],
    updatePassword
);

router.put(
    '/updatesecurity',
    protect,
    [
        check('password', 'Current password is required').exists(),
        check('securityQuestion', 'Security question selection is required').not().isEmpty(),
        check('securityAnswer', 'Security answer is required').not().isEmpty().isLength({ min: 2 }),
    ],
    updateSecurityQuestion
);

router.post(
    '/forgotpassword/question',
    [
        check('email', 'Please include a valid email').isEmail()
    ],
    getSecurityQuestion
);

router.post(
    '/forgotpassword/reset',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('securityAnswer', 'Security answer is required').not().isEmpty(),
        check(
            'password',
            'Password must be at least 6 characters and include at least one symbol or special character'
        ).isLength({ min: 6 }).matches(/[^a-zA-Z0-9]/)
    ],
    resetWithSecurityQuestion
);

module.exports = router;
