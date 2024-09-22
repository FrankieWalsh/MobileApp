const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// GET all cars
router.get('/', async (req, res) => {
    console.log("Request received for /api/cars");  // Log when the request comes in
    try {
        const cars = await Car.find();
        console.log("Cars found:", cars);  // Log the cars returned
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET car by ID
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST (create) a new car
router.post('/', async (req, res) => {
    const { model, type, price, number_of_seats, specifications, availability, location_id } = req.body;

    const car = new Car({
        model,
        type,
        price,
        number_of_seats,
        specifications,
        availability,
        location_id,
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
