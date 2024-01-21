const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  newWorkout: {},
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Workout", workoutSchema);
