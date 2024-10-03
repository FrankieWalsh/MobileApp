const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    coordinates: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model('Location', LocationSchema);
