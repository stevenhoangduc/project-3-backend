
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username: String, // put the username (req.user.username in your controller)
    userId: {  // would have access to with req.user._id in your controller (when create these)
      type: mongoose.Schema.Types.ObjectId, 
       ref: 'User' // Reference to the User model , many side of the relationshipt One User has many Comments
    },
    comment: String
  
  });
  

  const postSchema = new mongoose.Schema({
  text: String,
  caption: { type: String, required: true },
  location: { type: String },
  image: { type: String },
  likes: { type: Number, default: 0 },
  comment: { type: String},
  createdAt: { type: Date, default: Date.now },
  isComplete: Boolean,
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
     ref: 'User', required: true // Reference to the User model
  }, 
  username: String,
  comments: [commentSchema],

});

module.exports = mongoose.module('Post', postSchema);
