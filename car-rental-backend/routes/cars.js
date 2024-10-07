const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// GET all cars
router.get('/', async (req, res) => {
    console.log("Request received for /api/cars");  // Log when the request comes in
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/availability/true', async (req, res) => {
    try {
        // Use updateMany to set availability to true for all cars
        const result = await Car.updateMany({}, { availability: true });
        res.json({ message: 'All cars availability set to true', result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET car by ID
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).populate('location_id'); // Populating the location
        if (!car) return res.status(404).json({ message: 'Car not found' });
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST (create) a new car
router.post('/', async (req, res) => {
    const { brand, model, type, price, number_of_seats, specifications, availability, location_id, image } = req.body;

    const car = new Car({
        brand,
        model,
        type,
        price,
        number_of_seats,
        specifications,
        availability,
        location_id,
        image,
    });

    try {
        const newCar = await car.save();
        res.status(201).json(newCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE all cars in db
router.delete('/', async (req, res) => {
    try {
        const result = await Car.deleteMany();
        console.log("All cars deleted, result:", result);
        res.json({ message: 'All cars deleted', result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;