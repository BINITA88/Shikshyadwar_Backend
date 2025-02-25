// const express = require('express');
// const { postBooking, bookingList, userBookings, bookingDetails, updateStatus } = require('../controller/bookingController');
// const router = express.Router();

// router.post('/postbooking', postBooking);
// router.get('/bookinglist', bookingList);
// router.get('/bookingdetails/:id', bookingDetails);
// router.get('/userbookings/:userId', userBookings);
// router.put('/updatestatus/:id', updateStatus);

// module.exports = router;






const express = require('express');
const { postBooking, bookingList, userBookings, bookingDetails, updateStatus, deleteBooking } = require('../controller/bookingController');
const router = express.Router();

router.post('/postbooking', postBooking);
router.get('/bookinglist', bookingList);
router.get('/bookingdetails/:id', bookingDetails);
router.get('/userbookings/:userId', userBookings);
router.put('/updatestatus/:id', updateStatus);
router.delete('/deletebooking/:id', deleteBooking); // ✅ Added delete route

module.exports = router;


// {
//   "shippingAddress1": "beni",
//   "shippingAddress2": "ktm",
//   "city": "newroad",
//   "zip": 123,
//   "country": "Np",
//   "phone": "23243545194",
//   "totalPrice": 132,
//   "user": "66f14c617fd72f5963c7f26d",
//   "schedule": 10,
//   "shift": "day",
//   "classMode": "online",
//   "interestedInCounseling": true
// }
