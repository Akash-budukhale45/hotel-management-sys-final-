import Hotel from "../models/Hotel.js";

// ================= CREATE HOTEL =================
export const createHotel = async (req, res) => {
  try {

    const { name, location, description, stars, price, images } = req.body;

    // Login check
    if (!req.user) {
      return res.status(401).json({ message: "Login required" });
    }

    // Required fields check
    if (!name || !location || !description || !stars || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hotel create
    const hotel = await Hotel.create({
      name,
      location,
      description,
      stars,
      price,
      images: images || [], // ✅ image array save karega
      owner: req.user._id
    });

    res.status(201).json(hotel);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET ALL HOTELS =================
export const getAllHotels = async (req, res) => {
  try {

    // Agar admin login hai → sirf apne hotels
    if (req.user && req.user.role === "admin") {

      const hotels = await Hotel.find({ owner: req.user._id })
        .sort({ createdAt: -1 });

      return res.json(hotels);
    }

    // Public / user → sab hotels
    const hotels = await Hotel.find()
      .sort({ createdAt: -1 });

    res.json(hotels);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET SINGLE HOTEL =================
export const getHotelById = async (req, res) => {
  try {

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(hotel);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= TOP 5 RATED HOTELS =================
export const getTopRatedHotels = async (req, res) => {
  try {

    const hotels = await Hotel.find()
      .sort({ averageRating: -1 })
      .limit(5);

    res.json(hotels);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};