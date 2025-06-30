const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'], // Required field with custom error
    unique: true,
    trim: true, // Removes whitespace from both ends
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Always convert to lowercase
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters']
  },
  waterData: {
    type: Object,
    required: false
  },
  sleepData: {
    type: Object,
    required: false
  }
});

// Create the Model from the Schema

module.exports = userSchema;