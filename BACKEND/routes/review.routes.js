import express from "express";
import {
  addReview,
  getHotelReviews
} from "../controllers/review.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected: Add review
router.post("/", authMiddleware, addReview);

// Public: Get reviews for a hotel (with sorting)
router.get("/:hotelId", getHotelReviews);

export default router;
