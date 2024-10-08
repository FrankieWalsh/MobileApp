const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'secretkey';

// POST: Sign up a new user
router.post('/signup', async (req, res) => {
    const { name, email, password, preferences, payment_details } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 400, message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            preferences,
            payment_details
        });

        const newUser = await user.save();

        // Generate JWT token for the user
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ status: 201, token, userId: newUser._id, name: newUser.name });
    } catch (err) {
        res.status(400).json({ status: 400, message: err.message });
    }
});

// POST: Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token for the user
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, userId: user._id, name: user.name });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// GET: Get all users
router.get('/', async (req, res) => {
    try {
        // Find all users
        const users = await User.find().select('-password'); // Exclude the password field for security
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT: Update a user's name and email by ID
router.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        // Check if the email is already in use by another user
        if (email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ status: 400, message: 'Email already in use by another account' });
            }
        }

        // Update the user's name and email
        user.name = name || user.name;  // Keep the existing name if none provided
        user.email = email || user.email;  // Keep the existing email if none provided

        const updatedUser = await user.save();
        res.status(200).json({
            status: 200,
            message: 'User updated successfully',
            userId: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
});


module.exports = router;
