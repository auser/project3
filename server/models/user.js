const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  passwordHashAndSalt: {
    type: String
  },
  description: {
    type: String,
    maxLength: 5000,
    trim: true
  },
  userType: {
    type: String,
    required: true,
    default: 'private',
    enum: ['private', 'center']
  },
  picture: {
    type: String
  }
});

const User = mongoose.model('User', schema);

module.exports = User;
