// const express = require('express');
// const router = express.Router();
// const { getSchedules, createSchedule, updateSchedule, deleteSchedule } = require('../controller/scheduleController');
// // const { requireSignin} = require('../controller/userController');
// // requireSignin,

// router.get('/getschedule', getSchedules);


// router.post('/addschedule', createSchedule);


// router.put('/:id', updateSchedule);

// // Route to delete a deleteSchedule);

const express = require('express');
const router = express.Router();
const { getSchedules, createSchedule, updateSchedule, deleteSchedule } = require('../controller/scheduleController');
const { requireSignin} = require('../controller/userController');

// Route to get all schedules
router.get('/getschedule', getSchedules);

// Route to create a schedule
router.post('/addschedule', createSchedule);

// Route to update a schedule
router.put('/updateschedule/:id', updateSchedule);

// Route to delete a schedule
router.delete('/deleteschedule/:id', deleteSchedule);

module.exports = router;
