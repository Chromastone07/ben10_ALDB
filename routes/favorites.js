const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');

// @route   GET api/favorites/ids
// @desc    Get all favorite item IDs from the user's active playlists
// @access  Private
router.get('/ids', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('alienPlaylists activeAlienPlaylist characterPlaylists activeCharacterPlaylist planetPlaylists activePlanetPlaylist');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const findItemIds = (playlists, activeId) => {
            if (!activeId) return [];
            const activePlaylist = playlists.find(p => p._id.equals(activeId));
            return activePlaylist ? activePlaylist.items : [];
        };

        const favoriteIds = {
            aliens: findItemIds(user.alienPlaylists, user.activeAlienPlaylist),
            characters: findItemIds(user.characterPlaylists, user.activeCharacterPlaylist),
            planets: findItemIds(user.planetPlaylists, user.activePlanetPlaylist)
        };

        res.json(favoriteIds);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;