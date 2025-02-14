const Notification = require('../models/noticeModel');

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const newNotification = new Notification({ message });

    await newNotification.save();
    res.status(201).json({ message: 'Notification created successfully', newNotification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating notification' });
  }
};

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

module.exports = { createNotification, getNotifications };
