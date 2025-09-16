const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String },
    category: [{ type: String, enum: ['Character', 'Villain', 'Anti-Hero'] }],
    image: { type: String },
    appearance: { type: String },
    personality: { type: String },
    powersAndAbilities: { type: String }, 
    history: { type: String },
    relationships: { type: String },
    knowMore: { type: String }
});

module.exports = mongoose.model('Character', characterSchema);