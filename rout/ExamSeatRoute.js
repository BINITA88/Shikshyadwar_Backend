        // routes/seatRoutes.js
        const express = require('express');
        // const { createSeat, getSeats, getAvailableSeats } = require('../controller/ExamSeatController');
        const router = express.Router();
        // const { requireSignin} = require('../controller/userController');
        const { createSeat, getSeats, getSeatsStatus, bookSeat, unbookSeat } = require('../controller/ExamSeatController');

        // Routes for seat operations
        router.post('/create',createSeat); // Create a new seat
        router.get('/',getSeats); // Get all seats
        router.get('/status', getSeatsStatus); // Get available and unavailable seats
        router.post('/book',  bookSeat); // Book a seat
        router.post('/unbook', unbookSeat); // Unbook a seat

        module.exports = router;
