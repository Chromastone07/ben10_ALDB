const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

// @route   POST api/playlists/create
router.post('/create', auth, async (req, res) => {
    const { name, type } = req.body; // type: 'alien', 'character', 'planet'

    try {
        const user = await User.findById(req.user.id);
        const playlistField = `${type}Playlists`;

        if (!user[playlistField]) return res.status(400).json({ msg: 'Invalid type' });

        const newPlaylist = { name, items: [] };
        user[playlistField].push(newPlaylist);
        
        await user.save();
        res.status(201).json(user[playlistField]);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/playlists/active
// @desc    Set the active playlist for a category
router.put('/active', auth, async (req, res) => {
    const { playlistId, type } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const activeField = `active${type.charAt(0).toUpperCase() + type.slice(1)}Playlist`; // e.g., activeAlienPlaylist

        user[activeField] = playlistId;
        await user.save();
        res.json({ msg: `Active ${type} playlist updated` });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;