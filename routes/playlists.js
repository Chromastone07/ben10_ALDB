const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const mongoose = require('mongoose');

const getModelInfo = (type) => {
    switch (type) {
        case 'aliens':
            return {
                model: require('../models/alien'),
                playlistField: 'alienPlaylists',
                activeField: 'activeAlienPlaylist'
            };
        case 'characters':
            return {
                model: require('../models/character'),
                playlistField: 'characterPlaylists',
                activeField: 'activeCharacterPlaylist'
            };
        case 'planets':
            return {
                model: require('../models/planet'),
                playlistField: 'planetPlaylists',
                activeField: 'activePlanetPlaylist'
            };
        default:
            return null;
    }
};

router.get('/:type', auth, async (req, res) => {
    try {
        const { type } = req.params;
        const modelInfo = getModelInfo(type);
        if (!modelInfo) return res.status(400).json({ msg: 'Invalid item type' });

        const user = await User.findById(req.user.id).select(`${modelInfo.playlistField} ${modelInfo.activeField}`);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        const response = {
            playlists: user[modelInfo.playlistField] || [],
            activePlaylistId: user[modelInfo.activeField]
        };

        if (response.activePlaylistId) {
            const activePlaylist = response.playlists.find(p => p._id.equals(response.activePlaylistId));
            if (activePlaylist) {
                const userWithPopulatedItems = await User.findById(req.user.id).populate({
                    path: `${modelInfo.playlistField}.items`,
                    model: modelInfo.model.modelName
                });
                const populatedPlaylist = userWithPopulatedItems[modelInfo.playlistField].find(p => p._id.equals(response.activePlaylistId));
                response.activePlaylistItems = populatedPlaylist ? populatedPlaylist.items : [];
            }
        }
        
        res.json(response);

    } catch (err) {
        console.error(`Server Error in GET /api/playlists/${req.params.type}:`, err.message);
        res.status(500).send('Server Error');
    }
});


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

        if (user[modelInfo.playlistField].length === 1) {
            user[modelInfo.activeField] = user[modelInfo.playlistField][0]._id;
        }

        await user.save();
        res.status(201).json(user[modelInfo.playlistField]);

    } catch (err) {
        console.error(`Server Error in POST /api/playlists/${req.params.type}:`, err.message);
        res.status(500).send('Server Error');
    }
});

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

router.delete('/:type/:playlistId', auth, async (req, res) => {
    try {
        const { type, playlistId } = req.params;
        const modelInfo = getModelInfo(type);
        if (!modelInfo) return res.status(400).json({ msg: 'Invalid item type' });

        const user = await User.findById(req.user.id);
        const playlist = user[modelInfo.playlistField].id(playlistId);
        if (!playlist) return res.status(404).json({ msg: 'Playlist not found' });

        if (user[modelInfo.activeField] && user[modelInfo.activeField].equals(playlistId)) {
            user[modelInfo.activeField] = null;
        }
        
        await playlist.deleteOne();

        await user.save();
        res.json({ msg: 'Playlist deleted' });

    } catch (err) {
        console.error(`Server Error in DELETE /api/playlists/${req.params.type}/${req.params.playlistId}:`, err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;