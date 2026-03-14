import mongoose from "mongoose";
import Review from "../models/Review.js";
import Hotel from "../models/Hotel.js";

// ================= SENTIMENT LOGIC =================
const getSentiment = (text) => {
  const t = text.toLowerCase();

  if (
    t.includes("excellent") ||
    t.includes("good") ||
    t.includes("amazing") ||
    t.includes("clean")
  ) {
    return "positive";
  }

  if (
    t.includes("bad") ||
    t.includes("slow") ||
    t.includes("dirty") ||
    t.includes("small")
  ) {
    return "negative";
  }

  return "neutral";
};

// ================= ADD REVIEW =================
export const addReview = async (req, res) => {
  try {
    const { hotelId, rating, reviewText } = req.body;

    if (!hotelId || !rating || !reviewText) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Prevent multiple reviews by same user
    const alreadyReviewed = await Review.findOne({
      hotel: hotelId,
      user: req.user.id
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this hotel"
      });
    }

    const sentiment = getSentiment(reviewText);

    // Create review
    const review = await Review.create({
      user: req.user.id,
      hotel: hotelId,
      rating,
      reviewText,
      sentiment
    });

    // ================= AVERAGE RATING UPDATE =================
    const reviews = await Review.find({ hotel: hotelId });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    // ⭐ IMPORTANT: store as NUMBER (not string)
    hotel.averageRating = Number(avgRating.toFixed(1));
    await hotel.save();

    res.status(201).json({
      message: "Review added successfully",
      review
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET REVIEWS WITH SORTING =================
export const getHotelReviews = async (req, res) => {
  try {
    const { sort } = req.query;
    const hotelId = req.params.hotelId;

    let sortQuery = {};

    if (sort === "recent") {
      sortQuery = { createdAt: -1 };
    } else if (sort === "low") {
      sortQuery = { rating: 1 };
    } else {
      // Most Relevant (default)
      sortQuery = { rating: -1, createdAt: -1 };
    }

    const reviews = await Review.find({ hotel: hotelId })
      .populate("user", "name")
      .sort(sortQuery);

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
