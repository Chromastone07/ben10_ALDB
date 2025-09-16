const express = require('express');
const router = express.Router();
const Planet = require('../models/planet');

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skipIndex = (page - 1) * limit;
    try {
        const results = await Planet.find().sort({ name: 1 }).limit(limit).skip(skipIndex).exec();
        const count = await Planet.countDocuments();
        res.json({
            results,
            hasNextPage: (skipIndex + results.length) < count
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;