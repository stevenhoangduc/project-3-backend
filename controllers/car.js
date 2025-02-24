// routes/cars.js
const express = require("express");
const router = express.Router();
const UserModel = require("../models/user"); // Your Mongoose User model

// GET all cars for a user
router.get('/api/users/:userId/cars', async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.params.userId);
    res.json({ cars: currentUser.cars, owner: currentUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching cars" });
  }
});

// GET a single car for a user
router.get('/api/users/:userId/cars/:carId', async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.params.userId).populate({
      path: 'cars',
      populate: {
        path: 'comments', // if you have comments embedded
        populate: {
          path: 'user',
          model: 'User'
        }
      }
    });
    const car = currentUser.cars.id(req.params.carId);
    res.json({ car });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching car details" });
  }
});

// POST create a new car
router.post('/api/users/:userId/cars', async (req, res) => {
  // Assume session user is set (or use another auth method)
  req.body.user = req.session.user._id; 
  try {
    const currentUser = await UserModel.findById(req.params.userId);
    currentUser.cars.push(req.body);
    await currentUser.save();
    const newCar = currentUser.cars[currentUser.cars.length - 1];
    res.status(201).json({ message: "Car created", car: newCar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating car" });
  }
});

// PUT update a car
router.put('/api/users/:userId/cars/:carId', async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.params.userId);
    const car = currentUser.cars.id(req.params.carId);
    car.set(req.body);
    await currentUser.save();
    res.json({ message: "Car updated", car });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating car" });
  }
});

// DELETE a car
router.delete('/api/users/:userId/cars/:carId', async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.params.userId);
    currentUser.cars.id(req.params.carId).deleteOne();
    await currentUser.save();
    res.json({ message: "Car deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting car" });
  }
});

// PUT update likes for a car
router.put('/api/users/:userId/cars/:carId/likes', async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.params.userId);
    const car = currentUser.cars.id(req.params.carId);
    car.likes = (car.likes || 0) + 1;
    await currentUser.save();
    res.json({ message: "Like updated", car });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating likes" });
  }
});

module.exports = router;
