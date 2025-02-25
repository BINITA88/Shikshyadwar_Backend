// const Notification = require('../models/noticeModel');

// // Create a new notification
// const createNotification = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const newNotification = new Notification({ message });

//     await newNotification.save();
//     res.status(201).json({ message: 'Notification created successfully', newNotification });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error creating notification' });
//   }
// };

// // Get all notifications
// const getNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find().sort({ createdAt: -1 });
//     res.status(200).json(notifications);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching notifications' });
//   }
// };

// module.exports = { createNotification, getNotifications };
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

// Update a notification
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { message },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification updated successfully', updatedNotification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating notification' });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

module.exports = { 
  createNotification, 
  getNotifications, 
  updateNotification, 
  deleteNotification 
};
