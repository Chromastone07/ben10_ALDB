const express = require('express');
const router = express.Router();
const Alien = require('../models/alien');

// Escape regex special characters to prevent ReDoS
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// @route GET /api/aliens (With filtering and pagination)
router.get('/', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 12);
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
        console.error("Alien Fetch Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET /api/aliens/search/:term (Secure Search)
router.get('/search/:term', async (req, res) => {
    try {
        const safeTerm = escapeRegex(req.params.term); // PROTECT AGAINST REDOS
        
        const aliens = await Alien.find({
            $or: [
                { name: { $regex: safeTerm, $options: 'i' } },
                { species: { $regex: safeTerm, $options: 'i' } }
            ]
        }).limit(5);

        res.json({ results: aliens });
    } catch (err) {
        console.error("Search Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// Omnitrix Roulette (Random Alien)
router.get('/random', async (req, res) => {
    try {
        const count = await Alien.countDocuments();
        if (count === 0) return res.status(404).json({ msg: 'Codon Stream is empty.' });
        
        const random = Math.floor(Math.random() * count);
        const alien = await Alien.findOne().skip(random);
        res.json(alien);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;