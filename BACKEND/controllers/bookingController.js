import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

// ================= CREATE BOOKING =================
export const createBooking = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Login required" });
    }

    const { hotelId, checkIn, checkOut, guests } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const days =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    const totalPrice = days * hotel.price;

    const booking = await Booking.create({
      user: req.user.id,
      hotel: hotelId,
      checkIn,
      checkOut,
      guests,
      totalPrice
    });

    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET BOOKINGS (ROLE BASED) =================
export const getAllBookings = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔐 ADMIN → Only bookings of their hotels
    if (req.user.role === "admin") {

      const bookings = await Booking.find()
        .populate("user", "name email")
        .populate({
          path: "hotel",
          match: { owner: req.user.id },
          select: "name price owner"
        });

      // Remove bookings where hotel didn't match owner
      const filteredBookings = bookings.filter(b => b.hotel !== null);

      return res.json(filteredBookings);
    }

    // 👤 NORMAL USER → Only their bookings
    const bookings = await Booking.find({ user: req.user.id })
      .populate("user", "name email")
      .populate("hotel", "name price");

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE BOOKING STATUS =================
export const updateBookingStatus = async (req, res) => {
  try {

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const { status } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate("hotel");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔐 Ensure admin owns the hotel
    if (booking.hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE BOOKING =================
export const deleteBooking = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("hotel");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔐 Admin → only their hotel bookings
    if (req.user.role === "admin") {
      if (booking.hotel.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
      }
    }

    // 👤 User → only their own booking
    if (req.user.role === "user") {
      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
      }
    }

    await booking.deleteOne();

    res.json({ message: "Booking deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};