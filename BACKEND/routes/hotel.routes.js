import express from "express";
import {
  getAllHotels,
  getHotelById,
  getTopRatedHotels,
  createHotel
} from "../controllers/hotel.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// ================= CREATE HOTEL (Admin Only) =================
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createHotel
);

// ================= TOP 5 RATED HOTELS =================
router.get("/top", getTopRatedHotels);

// ================= ALL HOTELS =================
router.get(
  "/",
  authMiddleware,   // ✅ ADD THIS
  getAllHotels
);

// ================= SINGLE HOTEL =================
router.get("/:id", getHotelById);

export default router;