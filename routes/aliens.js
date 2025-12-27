const express = require('express');
const router = express.Router();
const Alien = require('../models/alien');

// GET all aliens (with pagination & search)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const series = req.query.series;
        const skip = (page - 1) * limit;

        let query = {};
        if (series && series !== 'All') {
            query.series = series;
        }

        const aliens = await Alien.find(query).skip(skip).limit(limit);
        const total = await Alien.countDocuments(query);

        res.json({
            results: aliens,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            hasNextPage: (page * limit) < total
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET Search Aliens (Autocomplete)
// GET Search Aliens (Autocomplete & Linking)
router.get('/search/:term', async (req, res) => {
    try {
        const term = req.params.term;
        
        // Search in Name OR Species
        const aliens = await Alien.find({
            $or: [
                { name: { $regex: term, $options: 'i' } },
                { species: { $regex: term, $options: 'i' } }
            ]
        }).limit(5);

        res.json({ results: aliens });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- NEW FEATURE: RANDOM ALIEN (MISTRANSFORMATION) ---
// This allows the "Roulette" button to fetch a random alien from the DB
router.get('/random', async (req, res) => {
    try {
        const count = await Alien.countDocuments();
        const random = Math.floor(Math.random() * count);
        
        // Skip 'random' number of documents to get one
        const alien = await Alien.findOne().skip(random);
        
        if (!alien) {
            return res.status(404).json({ msg: 'No aliens found in the Codon Stream.' });
        }
        
        res.json(alien);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET single alien by ID
// (Must come AFTER /random, otherwise "random" is treated as an ID)
router.get('/:id', async (req, res) => {
    try {
        const alien = await Alien.findById(req.params.id);
        if (!alien) {
            return res.status(404).json({ msg: 'Alien not found' });
        }
        res.json(alien);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Alien not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;