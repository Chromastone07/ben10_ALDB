
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const Alien = require('../models/alien');
const mongoose = require('mongoose');


router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('playlists activePlaylist');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({
            playlists: user.playlists || [],
            activePlaylistId: user.activePlaylist
        });
    } catch (err) {
        console.error('Server Error in GET /api/playlists:', err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/active-playlist-aliens', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('activePlaylist playlists')
            .populate({
                path: 'playlists.alienIds', 
                model: 'Alien'
            });

        if (!user || !user.activePlaylist) {
            return res.json({ aliens: [] });
        }

        const activePlaylist = user.playlists.find(p => p._id.equals(user.activePlaylist));

        if (!activePlaylist) {
            return res.json({ aliens: [] });
        }

        res.json({ aliens: activePlaylist.alienIds || [] });

    } catch (err) {
        console.error('Server Error in GET /api/playlists/active-playlist-aliens:', err.message);
        res.status(500).send('Server Error');
    }
});



router.post('/', auth, async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ msg: 'Playlist name is required' });
    }

    try {
        const user = await User.findById(req.user.id);
        const newPlaylist = { name, alienIds: [] };
        user.playlists.push(newPlaylist);

        if (user.playlists.length === 1) {
            user.activePlaylist = user.playlists[0]._id;
        }

        await user.save();
        res.status(201).json(user.playlists);

    } catch (err) {
        console.error('Server Error in POST /api/playlists:', err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:playlistId', auth, async (req, res) => {
    const { alienId, action } = req.body; 

    if (!alienId || !action) {
        return res.status(400).json({ msg: 'Alien ID and action are required' });
    }

    try {
        const user = await User.findById(req.user.id);
        const playlist = user.playlists.id(req.params.playlistId);

        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist not found' });
        }

        if (action === 'add') {
            if (!playlist.alienIds.includes(alienId)) {
                playlist.alienIds.push(alienId);
            }
        } else if (action === 'remove') {
            playlist.alienIds = playlist.alienIds.filter(id => !id.equals(alienId));
        } else {
            return res.status(400).json({ msg: 'Invalid action' });
        }

        await user.save();
        res.json(playlist);

    } catch (err) {
        console.error('Server Error in PUT /api/playlists/:playlistId:', err.message);
        res.status(500).send('Server Error');
    }
});



router.put('/set-active/:playlistId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const playlistExists = user.playlists.some(p => p._id.equals(req.params.playlistId));

        if (!playlistExists) {
            return res.status(404).json({ msg: 'Playlist not found' });
        }

        user.activePlaylist = req.params.playlistId;
        await user.save();
        res.json({ activePlaylistId: user.activePlaylist });

    } catch (err) {
        console.error('Server Error in PUT /api/playlists/set-active/:playlistId:', err.message);
        res.status(500).send('Server Error');
    }
});



router.delete('/:playlistId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const playlist = user.playlists.id(req.params.playlistId);

        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist not found' });
        }

        if (user.activePlaylist && user.activePlaylist.equals(req.params.playlistId)) {
            user.activePlaylist = null;
        }

        playlist.remove();
        await user.save();
        res.json({ msg: 'Playlist deleted' });

    } catch (err) {
        console.error('Server Error in DELETE /api/playlists/:playlistId:', err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
