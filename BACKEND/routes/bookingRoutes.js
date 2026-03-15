import express from "express";
import {
    createBooking,
    getAllBookings,
    updateBookingStatus,
    deleteBooking
} from "../controllers/bookingController.js";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Create booking (User)
router.post("/", authMiddleware, createBooking);

// Get bookings (Role based inside controller)
router.get("/", authMiddleware, getAllBookings);

// Update status (Admin only)
router.put("/:id/status", authMiddleware, adminMiddleware, updateBookingStatus);

// Delete booking (User + Admin allowed, logic inside controller)
router.delete("/:id", authMiddleware, deleteBooking);

export default router;