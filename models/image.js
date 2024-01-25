const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    required: true,
  },
  created: {
    type: Date, 
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Image", imageSchema);
