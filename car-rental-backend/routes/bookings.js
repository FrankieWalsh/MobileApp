const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');

// POST a new booking
router.post('/', async (req, res) => {
    const { carId, rentalDates, pickupLocation, dropOffLocation } = req.body;

    try {
        const car = await Car.findById(carId);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        const booking = new Booking({
            car: carId,
            rentalDates,
            pickupLocation,
            dropOffLocation,
        });

        const newBooking = await booking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
