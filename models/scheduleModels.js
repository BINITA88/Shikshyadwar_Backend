const mongoose = require('mongoose');
// sdsd
// Define the schedule schema
const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // Define valid days
  },
  time: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['active', 'paused', 'cancelled'], // Define valid types
  },
}, {
  timestamps: true // Automatically add createdAt and updatedAt timestamps
});

// Create the Schedule model using the schema
const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;


