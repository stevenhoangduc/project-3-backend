
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username: String, // put the username (req.user.username in your controller)
    userId: {  // would have access to with req.user._id in your controller (when create these)
      type: mongoose.Schema.Types.ObjectId, 
       ref: 'User' // Reference to the User model , many side of the relationshipt One User has many Comments
    },
    comment: String
  
  });
  

  const carSchema = new mongoose.Schema({
  username: String,
  text: String,
  caption: { type: String },
  location: { type: String },
  image: { type: String },
  likes: [{ type: String}],
  
  year: Number,
  model: String,
  brand: String,
  createdAt: { type: Date, default: Date.now },
  isComplete: Boolean,
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
     ref: 'User', required: true // Reference to the User model
  },
  comments: [commentSchema],

});

module.exports = mongoose.model('Car', carSchema);
