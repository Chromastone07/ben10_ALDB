const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    series: {
        type: String,
        required: true,
        enum: ['Classic', 'Alien Force', 'Ultimate Alien', 'Omniverse', 'Reboot']
    },
    season: { type: Number, required: true },
    episode: { type: Number, required: true },
    airDate: { type: Date },
    synopsis: { type: String },
    aliens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alien' }],
    characters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }]
});

module.exports = mongoose.model('Episode', episodeSchema);