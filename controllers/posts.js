const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Car = require('../models/car');
const Post = require('../models/post');

const verifyToken = require('../middleware/verify-token');


// examples of authenticating controller routes
router.get('/', verifyToken, async (req, res) => {

  // verifyToken defines req.user!
  // you have access to req.user.username
  // req.user._id
  try {

    // only return the username property on all the users
    const users = await User.find({}, "username");

    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

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


// Create a post
router.post('/', verifyToken, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      username: req.user.username, // Assuming you're passing user ID to associate the post
      userId: req.user._id
    });
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username'); // Populate user data if needed
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update a post
router.put('/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
      },
      { new: true } // Return the updated document
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Add a comment to a post
router.post('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({
      content: req.body.content,
      user: req.body.user, // Assuming you're passing the user ID for the comment
    });
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
