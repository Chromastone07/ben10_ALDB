const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const mongoose = require('mongoose');

// FIX: Import Models Explicitly at the top
const Alien = require('../models/alien');
const Character = require('../models/character');
const Planet = require('../models/planet');

const getModelInfo = (type) => {
    switch (type) {
        case 'aliens':
            return {
                model: Alien, // Pass the actual Model object
                playlistField: 'alienPlaylists',
                activeField: 'activeAlienPlaylist'
            };
        case 'characters':
            return {
                model: Character,
                playlistField: 'characterPlaylists',
                activeField: 'activeCharacterPlaylist'
            };
        case 'planets':
            return {
                model: Planet,
                playlistField: 'planetPlaylists',
                activeField: 'activePlanetPlaylist'
            };
        default:
            return null;
    }
};

// GET all playlists (Populated with full item details)
router.get('/:type', auth, async (req, res) => {
    try {
        const { type } = req.params;
        const modelInfo = getModelInfo(type);
        if (!modelInfo) return res.status(400).json({ msg: 'Invalid item type' });

        // FIX: Ensure 'model' is passed correctly to populate
        const user = await User.findById(req.user.id).populate({
            path: `${modelInfo.playlistField}.items`,
            model: modelInfo.model, 
            select: 'name image species'
        });

        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        // Remove any null items (in case an item was deleted from DB but exists in playlist)
        const playlists = user[modelInfo.playlistField].map(pl => ({
            ...pl.toObject(),
            items: pl.items.filter(item => item !== null)
        }));

        // --- FIX START: Find and send the active playlist items ---
        let activePlaylistItems = [];
        const activeId = user[modelInfo.activeField];

        if (activeId && playlists.length > 0) {
            // Find the playlist object that matches the active ID
            const activePlaylist = playlists.find(p => p._id.toString() === activeId.toString());
            if (activePlaylist) {
                activePlaylistItems = activePlaylist.items;
            }
        }
        // --- FIX END ---

        res.json({
            playlists: playlists || [],
            activePlaylistId: activeId,
            activePlaylistItems: activePlaylistItems // <--- This was missing!
        });

    } catch (err) {
        console.error(`Server Error in GET /api/playlists/${req.params.type}:`, err.message);
        res.status(500).send('Server Error');
    }
});

// Create Playlist
router.post('/:type', auth, async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: 'Playlist name is required' });

    try {
        const { type } = req.params;
        const modelInfo = getModelInfo(type);
        if (!modelInfo) return res.status(400).json({ msg: 'Invalid item type' });

        const user = await User.findById(req.user.id);
        const newPlaylist = { name, items: [] };
        user[modelInfo.playlistField].push(newPlaylist);

        // If this is the first playlist, automatically make it active
        if (user[modelInfo.playlistField].length === 1) {
            user[modelInfo.activeField] = user[modelInfo.playlistField][0]._id;
        }

        await user.save();
        const createdPlaylist = user[modelInfo.playlistField][user[modelInfo.playlistField].length - 1];
        res.status(201).json(createdPlaylist);

    } catch (err) {
        console.error(`Server Error in POST /api/playlists/${req.params.type}:`, err.message);
        res.status(500).send('Server Error');
    }
});

// Add/Remove Item
router.put('/:type/:playlistId', auth, async (req, res) => {
    const { itemId, action } = req.body;
    if (!itemId || !action) return res.status(400).json({ msg: 'Item ID and action are required' });

    try {
        const { type, playlistId } = req.params;
        const modelInfo = getModelInfo(type);
        if (!modelInfo) return res.status(400).json({ msg: 'Invalid item type' });

        const user = await User.findById(req.user.id);
        const playlist = user[modelInfo.playlistField].id(playlistId);
        if (!playlist) return res.status(404).json({ msg: 'Playlist not found' });

        const objectId = new mongoose.Types.ObjectId(itemId);

        if (action === 'add') {
            if (!playlist.items.some(id => id.equals(objectId))) {
                playlist.items.push(objectId);
            }
        } else if (action === 'remove') {
            playlist.items = playlist.items.filter(id => !id.equals(objectId));
        } else {
            return res.status(400).json({ msg: 'Invalid action' });
        }

        await user.save();
        res.json(playlist);

    } catch (err) {
        console.error(`Server Error in PUT /api/playlists/${req.params.type}/${req.params.playlistId}:`, err.message);
        res.status(500).send('Server Error');
    }
});

// Set Active
router.put('/:type/set-active/:playlistId', auth, async (req, res) => {
    try {
        const { type, playlistId } = req.params;
        const modelInfo = getModelInfo(type);
        if (!modelInfo) return res.status(400).json({ msg: 'Invalid item type' });

        const user = await User.findById(req.user.id);
        const playlistExists = user[modelInfo.playlistField].some(p => p._id.equals(playlistId));
        if (!playlistExists) return res.status(404).json({ msg: 'Playlist not found' });

        user[modelInfo.activeField] = playlistId;
        await user.save();
        res.json({ activePlaylistId: user[modelInfo.activeField] });

    } catch (err) {
        console.error(`Server Error in PUT /api/playlists/${req.params.type}/set-active:`, err.message);
        res.status(500).send('Server Error');
    }
});

// Delete Playlist
router.delete('/:type/:playlistId', auth, async (req, res) => {
    try {
        const { type, playlistId } = req.params;
        const modelInfo = getModelInfo(type);
        if (!modelInfo) return res.status(400).json({ msg: 'Invalid item type' });

        const user = await User.findById(req.user.id);
        
        // If deleting the active playlist, reset active field to null
        if (user[modelInfo.activeField] && user[modelInfo.activeField].equals(playlistId)) {
            user[modelInfo.activeField] = null;
        }
        
        user[modelInfo.playlistField].pull(playlistId);
        await user.save();
        res.json({ msg: 'Playlist deleted' });

    } catch (err) {
        console.error(`Server Error in DELETE /api/playlists/${req.params.type}/${req.params.playlistId}:`, err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;