const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');

// POST a new booking
router.post('/', async (req, res) => {
    const { car_id, rental_start_date, rental_end_date, pickup_location_id, dropoff_location_id } = req.body;

    try {
        const car = await Car.findById(carId);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        const booking = new Booking({
            car_id,
            rental_start_date,
            rental_end_date,
            pickup_location_id,
            dropoff_location_id,
            status: 'pending'
        });

        const newBooking = await booking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
