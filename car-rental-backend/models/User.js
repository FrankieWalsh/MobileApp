const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255
    },
    preferences: {
        type: mongoose.Schema.Types.Mixed,  // Stores JSON data
        default: {}
    },
    payment_details: {
        type: mongoose.Schema.Types.Mixed,  // Stores JSON data
        default: {}
    }
});

module.exports = mongoose.model('User', UserSchema);
