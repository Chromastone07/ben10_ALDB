const express = require('express');
const router = express.Router();
const Character = require('../models/character');

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skipIndex = (page - 1) * limit;

    const query = {};
    if (req.query.category) {
        query.category = req.query.category;
    }

    try {
        const results = await Character.find(query).sort({ _id: 1 }).limit(limit).skip(skipIndex).exec();
        const count = await Character.countDocuments(query);
        res.json({
            results,
            hasNextPage: (skipIndex + results.length) < count
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/search/:term', async (req, res) => {
    try {
        const searchTerm = req.params.term;
        const results = await Character.find({
            name: { $regex: searchTerm, $options: 'i' }
        });
        res.json({ results });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;