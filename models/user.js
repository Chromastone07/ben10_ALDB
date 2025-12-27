const mongoose = require('mongoose');

// Define Sub-Schema for Playlists
const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId }]
});

// Define Main User Schema
// FIXED: Renamed variable to 'UserSchema' (uppercase U) to match the export below
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // --- PROFILE FIELDS ---
    rank: { 
        type: String, 
        default: 'Recruit',
        enum: ['Recruit', 'Plumber', 'Magister', 'Proctor', 'Grand Magistrate'] 
    },
    avatar: { type: String, default: 'images/omnitrix.png' },

    // --- FAVORITES ---
    favoriteAliens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alien' }],
    favoriteCharacters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
    favoritePlanets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Planet' }],

    // --- PLAYLISTS ---
    alienPlaylists: [playlistSchema],
    characterPlaylists: [playlistSchema],
    planetPlaylists: [playlistSchema],
    
    // --- ACTIVE PLAYLISTS ---
    activeAlienPlaylist: { type: mongoose.Schema.Types.ObjectId },
    activeCharacterPlaylist: { type: mongoose.Schema.Types.ObjectId },
    activePlanetPlaylist: { type: mongoose.Schema.Types.ObjectId },

    // --- RESET PASSWORD ---
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }

}, { timestamps: true });

// Check if model exists first, otherwise create it
// This prevents the "OverwriteModelError"
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);