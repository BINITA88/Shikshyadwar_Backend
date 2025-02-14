const express = require('express');
const router = express.Router();
const { createNotification, getNotifications } = require('../controller/noticeController');

// Route to create a notification
router.post('/create', createNotification);

// Route to get all notifications
router.get('/', getNotifications);

module.exports = router;
