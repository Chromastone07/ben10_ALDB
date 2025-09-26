const express = require('express');
const router = express.Router();

const Alien = require('../models/alien');
const Character = require('../models/character');
const Planet = require('../models/planet');

router.get('/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        let model;

        switch (type) {
            case 'alien':
                model = Alien;
                break;
            case 'character':
                model = Character;
                break;
            case 'planet':
                model = Planet;
                break;
            default:
                return res.status(400).json({ msg: 'Invalid item type' });
        }

        const item = await model.findById(id);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }
        res.json(item);

    } catch (err) {
        console.error(`Server Error in GET /api/details:`, err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;