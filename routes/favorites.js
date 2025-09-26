
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const User = require('../models/user');

const models = {
    alien: require('../models/alien'),
    character: require('../models/character'),
    planet: require('../models/planet')
};

router.post('/:type/:id', auth, async (req, res) => {
    try {
        const { type, id } = req.params;
        const listName = `favorite${type.charAt(0).toUpperCase() + type.slice(1)}s`;

        if (!models[type] || !User.schema.path(listName)) {
            return res.status(400).json({ msg: 'Invalid item type' });
        }

        const user = await User.findById(req.user.id);
        const objectId = new mongoose.Types.ObjectId(id);

        const index = user[listName].findIndex(favId => favId.equals(objectId));
        if (index > -1) {
            user[listName].splice(index, 1);
        } else {
            user[listName].push(objectId);
        }

        await user.save();
        res.json(user[listName]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


router.get('/ids', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('favoriteAliens')       
            .populate('favoriteCharacters')
            .populate('favoritePlanets')
            .select('favoriteAliens favoriteCharacters favoritePlanets');

        res.json({
            aliens: user.favoriteAliens,
            characters: user.favoriteCharacters,
            planets: user.favoritePlanets
        });
    } catch (err) { 
        res.status(500).send('Server Error'); 
    }
});

router.delete('/:type/:id', auth, async (req, res) => {
    console.log("DELETE /:type/:id route reached");
    try {
        const { type, id } = req.params;
        const listName = `favorite${type.charAt(0).toUpperCase() + type.slice(1)}s`;

        if (!models[type] || !User.schema.path(listName)) {
            return res.status(400).json({ msg: 'Invalid item type' });
        }

        const user = await User.findById(req.user.id);
        const objectId = new mongoose.Types.ObjectId(id);

        user[listName] = user[listName].filter(favId => !favId.equals(objectId));

        await user.save();
        res.json(user[listName]); 

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});



module.exports = router;
