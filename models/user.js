const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favoriteAliens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alien' }],
    favoriteCharacters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
    favoritePlanets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Planet' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


