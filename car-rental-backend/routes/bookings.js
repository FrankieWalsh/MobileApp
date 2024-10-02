const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Notifications = require('../models/Notifications');
const Location = require('../models/Location');


// POST a new booking
router.post('/', async (req, res) => {
    const { carId, rentalStartDate, rentalEndDate, pickupLocation, dropOffLocation, userId } = req.body;
    console.log(req.body)

    try {
        const car = await Car.findById(carId);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        // Ensure the car is available
        if (!car.availability) return res.status(400).json({ message: 'Car is already booked' });

        // Populate the pickup and dropoff locations to get the addresses
        const populatedPickupLocation = await Location.findById(pickupLocation);
        const populatedDropOffLocation = await Location.findById(dropOffLocation);

        if (!populatedPickupLocation || !populatedDropOffLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }

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
        console.log(booking)

        // Save the new booking
        const newBooking = await booking.save();

        // Set the car's availability to false
        car.availability = false;
        await car.save();

        // Send notification to the user with the actual address
        const notificationMessage = `Your booking for ${car.model} is confirmed. Pickup: ${populatedPickupLocation.address}, Drop-off: ${populatedDropOffLocation.address}.`;
        console.log(notificationMessage)
        const notification = new Notifications({
            user_id: userId,
            details: notificationMessage,
            message: `Booking Confirmation for ${car.model} (Booking ID: ${newBooking._id})`,
        });
        console.log(notification)

        await notification.save(); // Save the notification

        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('car_id', 'model brand image') // Populate car details
            .populate('pickup_location_id', 'address') // Only populate the address field from Location
            .populate('dropoff_location_id', 'address') // Only populate the address field from Location


        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET bookings for a user
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find bookings by user_id and populate only model, brand, and image fields from the car
        const bookings = await Booking.find({ user_id: userId })
            .populate('car_id', 'model brand image') // Only include model, brand, and image fields from car
            .populate('pickup_location_id')
            .populate('dropoff_location_id');

        if (!bookings.length) {
            return res.status(200).json({ message: 'No bookings found for this user' });
        }

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a booking by ID
// router.delete('/:id', async (req, res) => {
//     const { id } = req.params;
//
//     try {
//         // Find the booking by its ID
//         const booking = await Booking.findById(id);
//
//         if (!booking) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }
//
//         // Find the car related to the booking and set availability to true
//         const car = await Car.findById(booking.car_id);
//         if (car) {
//             car.availability = true; // Set the car as available again
//             await car.save();
//         }
//
//         // Delete the booking
//         await booking.deleteOne();
//
//         res.status(200).json({ message: 'Booking deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// DELETE all bookings
router.delete('/all', async (req, res) => {
    try {
        const result = await Booking.deleteMany();
        console.log("All bookings deleted, result:", result);
        res.json({ message: 'All bookings deleted', result });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting bookings' });
    }
});


module.exports = router;