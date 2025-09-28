const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId }] // Generic item holder
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Deprecated - we will phase these out
    favoriteAliens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alien' }],
    favoriteCharacters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
    favoritePlanets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Planet' }],

    // New Playlist Structure
    alienPlaylists: [playlistSchema],
    characterPlaylists: [playlistSchema],
    planetPlaylists: [playlistSchema],
    
    activeAlienPlaylist: { type: mongoose.Schema.Types.ObjectId },
    activeCharacterPlaylist: { type: mongoose.Schema.Types.ObjectId },
    activePlanetPlaylist: { type: mongoose.Schema.Types.ObjectId },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);