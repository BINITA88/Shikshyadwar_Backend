// const express = require('express');
// const router = express.Router();
// const { createNotification, getNotifications } = require('../controller/noticeController');

// // Route to create a notification
// router.post('/create', createNotification);

// // Route to get all notifications
// router.get('/', getNotifications);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { createNotification, getNotifications, updateNotification, deleteNotification } = require('../controller/noticeController');

// Route to create a notification
router.post('/create', createNotification);

// Route to get all notifications
router.get('/', getNotifications);

// Route to update a notification
router.put('/update/:id', updateNotification);

// Route to delete a notification
router.delete('/delete/:id', deleteNotification);

module.exports = router;
