const express = require('express');
const router = express.Router();
const Location = require('../models/Location');  // Assuming your model is in the models folder

// GET all locations
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET location by ID
router.get('/:id', async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ message: 'Location not found' });
        res.json(location);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new location
router.post('/', async (req, res) => {
    const { address, coordinates, available } = req.body;

    const location = new Location({
        address,
        coordinates,
        available: available !== undefined ? available : true, // default to true if not provided
    });

    try {
        const newLocation = await location.save();
        res.status(201).json(newLocation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
