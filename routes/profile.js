const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User'); // Ensure this matches your filename (User.js vs user.js)
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// @route   GET /api/profile/me
// @desc    Get current user's profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/profile/update
// @desc    Update Profile Details (Username)
router.put('/update', [
    auth,
    [check('username', 'Username is required').not().isEmpty()]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Check if username is taken by someone else
        if (username !== user.username) {
            let userExists = await User.findOne({ username });
            if (userExists) return res.status(400).json({ msg: 'Username already taken' });
        }

        user.username = username;
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/profile/change-password
// @desc    Secure Password Change
router.put('/change-password', [
    auth,
    [
        check('currentPassword', 'Current password is required').exists(),
        check('newPassword', 'New password must be 6+ characters').isLength({ min: 6 })
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Incorrect current password' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/profile/me
// @desc    Delete user account
router.delete('/me', auth, async (req, res) => {
    try {
        await User.findOneAndDelete({ _id: req.user.id });
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;