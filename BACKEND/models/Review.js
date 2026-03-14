import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    reviewText: {
      type: String,
      required: true
    },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      required: true
    }
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
