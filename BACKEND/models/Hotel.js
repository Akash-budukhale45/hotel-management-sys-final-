import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    price: {
      type: Number,
      required: true
    },
    images: [
      {
        type: String
      }
    ],
    averageRating: {
      type: Number,
      default: 0
    },

    // ✅ OWNER FIELD ADDED
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }

  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;