// this is just a coment



const mongoose = require('mongoose');

const carsSchema = mongoose.Schema({
  image: {
    type: String, 
    required: true
  },
  addText: {
    type: String,
    
  }, 
  comments: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Comment"
  }],
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  }
}, {
  timestamps: true
})


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },

  cars: [carsSchema]
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  }
});

module.exports = mongoose.model('User', userSchema);
