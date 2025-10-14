const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    nativeSpecies: [{ type: String }],
    description: { type: String },
    habitat: { type: String },
    firstAppearance: { type: String },
    image: { type: String }
});

module.exports = mongoose.model('Planet', planetSchema);