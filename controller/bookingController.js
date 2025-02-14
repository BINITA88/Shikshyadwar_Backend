const Booking = require("../models/bookingModel");

// Post booking
exports.postBooking = async (req, res) => {
  try {
    // Calculate totalPrice (or set it directly from req.body if provided)
    const totalPrice = req.body.totalPrice || 0;

    // Create the booking with the new structure
    const booking = new Booking({
      Address: req.body.shippingAddress1,
      city: req.body.city,
      country: req.body.country,
      phone: req.body.phone,
      totalPrice: totalPrice,
      user: req.body.user,
      schedule: req.body.schedule, // New field
      shift: req.body.shift, // New field
      classMode: req.body.classMode, // New field
      interestedInCounseling: req.body.interestedInCounseling // New field
    });

    const savedBooking = await booking.save();

    if (!savedBooking) {
      return res.status(400).json({ error: "Something went wrong while saving the booking" });
    }

    res.send(savedBooking);
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

// Booking list
exports.bookingList = async (req, res) => {
  try {
    const booking = await Booking.find()
      .populate('user', 'email name')  // Include email and name fields from the User model
      .sort({ createdAt: -1 });

    if (!booking) {
      return res.status(400).json({ error: "Something went wrong" });
    }

    res.send(booking);
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

// Booking details
exports.bookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'email name')  // Include email and name fields from the User model
      .populate({
        path: 'bookingItems', populate: {
          path: 'product', populate: 'category'
        }
      });

    if (!booking) {
      return res.status(400).json({ error: "Something went wrong" });
    }

    res.send(booking);
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

// Booking list of a specific user
exports.userBookings = async (req, res) => {
  try {
    const userBookingList = await Booking.find({ user: req.params.userId })
      .populate('user', 'email name')  // Include email and name fields from the User model
      .sort({ createdAt: -1 });

    if (!userBookingList) {
      return res.status(400).json({ error: "Something went wrong" });
    }

    res.send(userBookingList);
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

// Update booking status
exports.updateStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!booking) {
      return res.status(400).json({ error: "Something went wrong" });
    }

    res.send(booking);
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};
