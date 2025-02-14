const express = require('express');
const router = express.Router();
const { getSchedules, createSchedule, updateSchedule, deleteSchedule } = require('../controller/scheduleController');
// const { requireSignin} = require('../controller/userController');
// requireSignin,
// Route to get all schedules
router.get('/getschedule', getSchedules);

// Route to create a schedule
router.post('/addschedule', createSchedule);

// Route to update a schedule
router.put('/:id', updateSchedule);

// Route to delete a deleteSchedule);

module.exports = router;
