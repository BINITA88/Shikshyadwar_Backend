// const Seat = require('../models/ExamSeatModel');

// // Create a new seat
// exports.createSeat = async (req, res) => {
//   const { seatNumber } = req.body;

//   try {
//     const newSeat = new Seat({
//       seatNumber,
//       booked: false, // By default, the seat is not booked
//     });

//     await newSeat.save();
//     res.status(201).json(newSeat);
//   } catch (error) {
//     console.error('Error creating seat:', error);
//     res.status(500).json({ error: 'Failed to create seat' });
//   }
// };

// // Get all seats
// exports.getSeats = async (req, res) => {
//   try {
//     const seats = await Seat.find();
//     res.status(200).json(seats);
//   } catch (error) {
//     console.error('Error fetching seats:', error);
//     res.status(500).json({ error: 'Failed to fetch seats' });
//   }
// };

// // Get available and unavailable seats
// exports.getSeatsStatus = async (req, res) => {
//   try {
//     const availableSeats = await Seat.find({ booked: false });
//     const unavailableSeats = await Seat.find({ booked: true });

//     res.status(200).json({
//       availableSeats,
//       unavailableSeats,
//     });
//   } catch (error) {
//     console.error('Error fetching seat statuses:', error);
//     res.status(500).json({ error: 'Failed to fetch seat statuses' });
//   }
// };

// // Book a seat
// exports.bookSeat = async (req, res) => {
//   const { seatNumber } = req.body;

//   try {
//     const seat = await Seat.findOne({ seatNumber });

//     if (!seat) {
//       return res.status(404).json({ error: 'Seat not found' });
//     }

//     if (seat.booked) {
//       return res.status(400).json({ error: 'Seat is already booked' });
//     }

//     seat.booked = true; // Mark seat as booked
//     await seat.save();

//     res.status(200).json({ message: 'Seat successfully booked', seat });
//   } catch (error) {
//     console.error('Error booking seat:', error);
//     res.status(500).json({ error: 'Failed to book seat' });
//   }
// };

// // Unbook a seat
// exports.unbookSeat = async (req, res) => {
//   const { seatNumber } = req.body;

//   try {
//     const seat = await Seat.findOne({ seatNumber });

//     if (!seat) {
//       return res.status(404).json({ error: 'Seat not found' });
//     }

//     if (!seat.booked) {
//       return res.status(400).json({ error: 'Seat is already available' });
//     }

//     seat.booked = false; // Mark seat as available
//     await seat.save();

//     res.status(200).json({ message: 'Seat successfully unbooked', seat });
//   } catch (error) {
//     console.error('Error unbooking seat:', error);
//     res.status(500).json({ error: 'Failed to unbook seat' });
//   }
// };



const Seat = require('../models/ExamSeatModel');

// Create a new seat
exports.createSeat = async (req, res) => {
  const { seatNumber } = req.body;

  try {
    const newSeat = new Seat({
      seatNumber,
      booked: false, // Default to unbooked
    });

    await newSeat.save();
    res.status(201).json(newSeat);
  } catch (error) {
    console.error('Error creating seat:', error);
    res.status(500).json({ error: 'Failed to create seat' });
  }
};

// Bulk Create Seats (NEW FEATURE)
exports.bulkCreateSeats = async (req, res) => {
  const { seats } = req.body;

  if (!seats || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ error: "Invalid seat data. Provide an array of seats." });
  }

  try {
    // Insert multiple seats
    const createdSeats = await Seat.insertMany(seats);
    res.status(201).json({ message: `${seats.length} seats added successfully!`, createdSeats });
  } catch (error) {
    console.error("Error in bulk seat creation:", error);
    res.status(500).json({ error: "Failed to create seats" });
  }
};

// Get all seats
exports.getSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.status(200).json(seats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ error: 'Failed to fetch seats' });
  }
};

// Get available and unavailable seats
exports.getSeatsStatus = async (req, res) => {
  try {
    const availableSeats = await Seat.find({ booked: false });
    const unavailableSeats = await Seat.find({ booked: true });

    res.status(200).json({
      availableSeats,
      unavailableSeats,
    });
  } catch (error) {
    console.error('Error fetching seat statuses:', error);
    res.status(500).json({ error: 'Failed to fetch seat statuses' });
  }
};

// Book a seat
exports.bookSeat = async (req, res) => {
  const { seatNumber } = req.body;

  try {
    const seat = await Seat.findOne({ seatNumber });

    if (!seat) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    if (seat.booked) {
      return res.status(400).json({ error: 'Seat is already booked' });
    }

    seat.booked = true; // Mark seat as booked
    await seat.save();

    res.status(200).json({ message: 'Seat successfully booked', seat });
  } catch (error) {
    console.error('Error booking seat:', error);
    res.status(500).json({ error: 'Failed to book seat' });
  }
};

// Unbook a seat
exports.unbookSeat = async (req, res) => {
  const { seatNumber } = req.body;

  try {
    const seat = await Seat.findOne({ seatNumber });

    if (!seat) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    if (!seat.booked) {
      return res.status(400).json({ error: 'Seat is already available' });
    }

    seat.booked = false; // Mark seat as available
    await seat.save();

    res.status(200).json({ message: 'Seat successfully unbooked', seat });
  } catch (error) {
    console.error('Error unbooking seat:', error);
    res.status(500).json({ error: 'Failed to unbook seat' });
  }
};

// Delete a seat
exports.deleteSeat = async (req, res) => {
  const { seatNumber } = req.params;

  try {
    console.log("Attempting to delete seat:", seatNumber);
    const seat = await Seat.findOneAndDelete({ seatNumber: seatNumber.toString() });

    if (!seat) {
      return res.status(404).json({ error: `Seat ${seatNumber} not found` });
    }

    res.status(200).json({ message: `Seat ${seatNumber} successfully deleted`, seat });
  } catch (error) {
    console.error("Error deleting seat:", error);
    res.status(500).json({ error: "Failed to delete seat" });
  }
};
