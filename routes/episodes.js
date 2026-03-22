const express = require('express');
const router = express.Router();
const Episode = require('../models/episode');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get('/', async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
    const skipIndex = (page - 1) * limit;

    const query = {};
    if (req.query.series) {
        query.series = req.query.series;
    }

    try {
        const results = await Episode.find(query)
            .populate('aliens')
            .populate('characters')
            .sort({ series: 1, season: 1, episode: 1 })
            .limit(limit)
            .skip(skipIndex)
            .exec();

        const count = await Episode.countDocuments(query);

        res.json({
            results,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            hasNextPage: (skipIndex + results.length) < count
        });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving episodes" });
    }
});

router.get('/search/:term', async (req, res) => {
    try {
        const safeTerm = escapeRegex(req.params.term);
        const results = await Episode.find({
            title: { $regex: safeTerm, $options: 'i' }
        })
        .populate('aliens')
        .populate('characters')
        .limit(10);

        res.json({ results });
    } catch (err) {
        res.status(500).json({ message: "Search failed" });
    }
});

module.exports = router;