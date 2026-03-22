const express = require('express');
const router = express.Router();
const Character = require('../models/character');

// Helper to prevent Regex Denial of Service (ReDoS)
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get('/', async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 12);
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
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            hasNextPage: (skipIndex + results.length) < count
        });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving characters" });
    }
});

router.get('/search/:term', async (req, res) => {
    try {
        const safeTerm = escapeRegex(req.params.term);
        const results = await Character.find({
            name: { $regex: safeTerm, $options: 'i' }
        }).limit(10);
        res.json({ results });
    } catch (err) {
        res.status(500).json({ message: "Search failed" });
    }
});

module.exports = router;