const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Car = require('../models/car');


const verifyToken = require('../middleware/verify-token');


router.get('/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId){
      return res.status(403).json({ err: "Unauthorized"});
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ err: 'User not found.'});
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


// Create a car
router.post('/', verifyToken, async (req, res) => {
  req.body.userId = req.user._id;
  req.body.username = req.user.username;
  console.log(req.body)
  try {
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();
    res.status(200).json(savedCar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().populate('userId'); // Populate user data if needed
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update a car
router.put('/:id', async (req, res) => {
  console.log(req.body)
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    res.status(200).json(updatedCar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Delete a car
router.delete('/:id', async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Add a comment to a car
router.post('/:id/comments', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    car.comments.push({
      content: req.body.content,
      user: req.body.user, // Assuming you're passing the user ID for the comment
    });
    await car.save();
    res.status(200).json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
