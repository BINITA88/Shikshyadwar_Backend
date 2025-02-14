const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const BookingSchema = new mongoose.Schema({

  Address: {
    type: String,
    required: false,
  },
 
  city: {
    type: String,
    required: true
  },
 
 
  country: {
    type: String,
    required: true
  },
  // phone: {
  //   type: String,
  //   required: true
  // },
  status: {
    type: String,
    default: 'pending'
  },
  // totalPrice: {
  //   type: Number,
  //   required: true
  // },
  // user: {
  //   type: ObjectId,
  //   required: true,
  //   ref: 'User'
  // },
  // New fields added from frontend form
  shift: {
    type: String, // Store the selected shift like "morning", "day", or "evening"
    required: false
  },
  classMode: {
    type: String, // Store the class mode like "online" or "in-office"
    required: false
  },
  interestedInCounseling: {
    type: Boolean, // Store whether the user is interested in counseling
    required: false,
    default: false
  }
}, { timestamps: true }); // Fixed typo "timestamp" to "timestamps"

module.exports = mongoose.model('Booking', BookingSchema);
