const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    details: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Notification', NotificationSchema);