const mongoose = require('mongoose');

const alienSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String },
    homePlanet: { type: String },
    series: [{
        type: String,
        enum: ['Classic', 'Alien Force', 'Ultimate Alien', 'Omniverse', 'Reboot']
    }],
    image: { type: String },
    abilities: [{ type: String }],
    weaknesses: [{ type: String }],
    ultimateForm: { type: String, default: null },
    ultimateImage: { type: String, default: null },
    ultimateAbilities: [{ type: String }]
});

module.exports = mongoose.model('Alien', alienSchema);