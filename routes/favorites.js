const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth'); // PROTECT THE ROUTE

// @route   POST api/favorites/add
// @desc    Add an item to user favorites
router.post('/add', auth, async (req, res) => {
    const { itemId, itemType } = req.body; // itemType: 'alien', 'character', or 'planet'

    try {
        const user = await User.findById(req.user.id); // Get user from token
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Map the type to the correct array in the User model
        const fieldMap = {
            'alien': 'favoriteAliens',
            'character': 'favoriteCharacters',
            'planet': 'favoritePlanets'
        };

        const targetField = fieldMap[itemType];
        if (!targetField) return res.status(400).json({ msg: 'Invalid item type' });

        // Prevent duplicates
        if (user[targetField].includes(itemId)) {
            return res.status(400).json({ msg: 'Item already in favorites' });
        }

        user[targetField].push(itemId);
        await user.save();

        res.json({ msg: 'Added to favorites', favorites: user[targetField] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;