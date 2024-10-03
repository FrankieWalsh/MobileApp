const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Make sure this references the correct User model
        required: true,
    },
    car_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',  // Ensure this is correctly referencing the Car model
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
        ref: 'Location',  // Make sure this references the Location model
        required: true,
    },
    dropoff_location_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',  // Make sure this references the Location model
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['confirmed', 'cancelled'],
        default: 'pending',
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
