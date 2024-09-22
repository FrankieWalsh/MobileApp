const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
        get: v => v.toString(),  // Convert Decimal128 to string automatically
    },
    number_of_seats: {
        type: Number,
        required: true,
    },
    specifications: {
        type: mongoose.Schema.Types.Mixed,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    location_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: false, // Set to true later
    }
});

// Enable the getter in the schema's toJSON and toObject options
CarSchema.set('toJSON', { getters: true });
CarSchema.set('toObject', { getters: true });

module.exports = mongoose.model('Car', CarSchema);