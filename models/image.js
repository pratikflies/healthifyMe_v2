const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Image", imageSchema);
