const multer = require("multer");
const path = require("path");
const Car = require('../models/car');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: "./uploads/", // Store images in "uploads" folder
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// Initialize multer with storage settings
const upload = multer({ storage });

// Controller function for handling file uploads
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const newCar = new Car({
        username: req.body.username,
        year: req.body.year,
        model: req.body.model,
        brand: req.body.brand,
        userId: req.body.userId,  // Assuming userId is passed in the body
        comment: req.body.comment,
        imageUrl: `/uploads/${req.file.filename}`, // Save the file path to the database
    });

    await newCar.save();
    // Respond with the image URL
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch(err) {
    console.error(err);
    res.status(500).json({message: "Server Error"});
  }
};

module.exports = { upload, uploadImage };
