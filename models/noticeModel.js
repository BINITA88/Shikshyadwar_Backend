const mongoose = require('mongoose');

// Define Notification schema
const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true }, // Store the message
  createdAt: { type: Date, default: Date.now },
});

// Create the Notification model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
