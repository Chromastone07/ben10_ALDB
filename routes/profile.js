const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth'); // ALWAYS use auth for profiles

// @route   GET api/profile/me
// @desc    Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        // Find user but don't return the password hash
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/profile/update
// @desc    Update avatar or other basic info
router.put('/update', auth, async (req, res) => {
    const { avatar } = req.body;
    try {
        const user = await User.findById(req.user.id);
        
        // Basic validation for avatar path
        if (avatar && avatar.startsWith('images/')) {
            user.avatar = avatar;
        }

        await user.save();
        res.json({ msg: 'Profile updated successfully', avatar: user.avatar });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/profile/rankup
// @desc    Logic for promotion (can be tied to user activity later)
router.put('/rankup', auth, async (req, res) => {
    const ranks = ['Recruit', 'Plumber', 'Magister', 'Proctor', 'Grand Magistrate'];
    try {
        const user = await User.findById(req.user.id);
        const currentIndex = ranks.indexOf(user.rank);

        if (currentIndex < ranks.length - 1) {
            user.rank = ranks[currentIndex + 1];
            await user.save();
            return res.json({ msg: `Promoted to ${user.rank}!`, rank: user.rank });
        }
        
        res.json({ msg: 'You have reached the highest rank.', rank: user.rank });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;