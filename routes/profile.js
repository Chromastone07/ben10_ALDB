const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs'); 

const RANKS = [
    { name: 'Recruit', minTime: 0 },
    { name: 'Plumber', minTime: 5 },       
    { name: 'Magister', minTime: 30 },     
    { name: 'Proctor', minTime: 60 },      
    { name: 'Grand Magistrate', minTime: 1440 } 
];


router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const now = new Date();
        const joined = new Date(user.date);
        const diffMinutes = Math.floor((now - joined) / 1000 / 60);

        let currentRank = 'Recruit';
        let nextRank = 'Max Rank';
        let progress = 100;

        for (let i = 0; i < RANKS.length; i++) {
            if (diffMinutes >= RANKS[i].minTime) {
                currentRank = RANKS[i].name;
                if (i + 1 < RANKS.length) {
                    const next = RANKS[i + 1];
                    const prev = RANKS[i];
                    nextRank = next.name;
                    const totalNeeded = next.minTime - prev.minTime;
                    const currentGained = diffMinutes - prev.minTime;
                    progress = Math.floor((currentGained / totalNeeded) * 100);
                } else {
                    progress = 100;
                }
            }
        }

        if (user.rank !== currentRank) {
            user.rank = currentRank;
            await user.save();
        }

        const badges = [];
        badges.push({ name: "Recruit", desc: "Joined the Plumbers", icon: "🔰", unlocked: true });
        const hasPlaylists = user.alienPlaylists && user.alienPlaylists.length > 0;
        badges.push({ name: "Collector", desc: "Created a DNA Playlist", icon: "🧬", unlocked: hasPlaylists });
        const isVeteran = RANKS.findIndex(r => r.name === currentRank) >= 2;
        badges.push({ name: "Veteran", desc: "Reached Rank: Magister", icon: "🎖️", unlocked: isVeteran });
        const hasFavs = user.favoriteAliens && user.favoriteAliens.length >= 5;
        badges.push({ name: "Xenobiologist", desc: "Saved 5+ Aliens", icon: "👽", unlocked: hasFavs });

        res.json({
            ...user._doc,
            rank: currentRank,
            nextRank,
            progress,
            timeActive: diffMinutes,
            badges
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.put('/avatar', auth, async (req, res) => {
    try {
        const { avatar } = req.body;
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        user.avatar = avatar;
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.put('/update', auth, async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (username) user.username = username;
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Current Password' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();
        res.json({ msg: 'Password updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


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