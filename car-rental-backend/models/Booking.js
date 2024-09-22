const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    car_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
    },
    rental_start_date: {
        type: Date,
        required: true,
    },
    rental_end_date: {
        type: Date,
        required: true,
    },
    pickup_location_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    dropoff_location_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
