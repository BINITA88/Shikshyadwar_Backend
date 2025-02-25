// const mongoose = require('mongoose');

// const seatSchema = new mongoose.Schema({
//   seatNumber: {
//     type: Number,
//     required: true,
//     unique: true,
//   },
//   booked: {
//     type: Boolean,
//     default: false,
//   },
// });

// module.exports = mongoose.model('Seat', seatSchema);
const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true, unique: true },
  booked: { type: Boolean, default: false },
});

const SeatModel = mongoose.model("Seat", SeatSchema);
module.exports = SeatModel;
