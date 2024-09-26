// routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notifications');

// GET all notifications for a specific user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await Notification.find({ user_id: userId });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

router.get('/', async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

// POST a new notification (for example, after booking confirmation)
router.post('/', async (req, res) => {
    const { user_id, message } = req.body;

    try {
        const notification = new Notification({
            user_id,
            message,
        });

        const newNotification = await notification.save();
        res.status(201).json(newNotification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Mark a notification as read
router.put('/mark-read/:notificationId', async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();
        res.status(200).json(notification);
    } catch (err) {
        res.status(500).json({ message: 'Error marking notification as read' });
    }
});

router.delete('/all', async (req, res) => {
    try {
        const result = await Notification.deleteMany();
        console.log("All notifications deleted, result:", result);
        res.json({ message: 'All notifications deleted', result });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting notifications' });
    }
});

module.exports = router;