const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  meta: {
    type: Object,
    default: {}, 
    // Contains user details: full name, gender, age, height, weight, goal
  },
  created: {
    type: Date, 
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: null,
  }
});

module.exports = mongoose.model("User", userSchema);
