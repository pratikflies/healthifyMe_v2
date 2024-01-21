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
  fullname: {
    type: String,
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  goal: {
    type: Number,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  pastWorkouts: {
    items: [],
  },
});

module.exports = mongoose.model("User", userSchema);
