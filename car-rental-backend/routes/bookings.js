const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');

// POST a new booking
router.post('/', async (req, res) => {
    const { carId, rentalStartDate, rentalEndDate, pickupLocation, dropOffLocation, userId } = req.body;

    try {
        const car = await Car.findById(carId);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        // Ensure the car is available
        if (!car.availability) return res.status(400).json({ message: 'Car is already booked' });

        // Create a new booking
        const booking = new Booking({
            car_id: carId,
            rental_start_date: new Date(rentalStartDate),
            rental_end_date: new Date(rentalEndDate),
            pickup_location_id: pickupLocation,
            dropoff_location_id: dropOffLocation,
            user_id: userId,
            status: 'confirmed'
        });

        // Save the new booking
        const newBooking = await booking.save();

        // Set the car's availability to false
        car.availability = false;
        await car.save();

        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('car_id').populate('pickup_location_id').populate('dropoff_location_id'); // Populates related fields
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
