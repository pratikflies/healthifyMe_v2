const { Running } = require("./workouts/running");
const { Cycling } = require("./workouts/cycling");
const { Swimming } = require("./workouts/swimming");

class WorkoutFactory {
  static workoutRegistry = {
    running: Running,
    cycling: Cycling,
    swimming: Swimming,
  };

  static getWorkout({ type, coords, distance, duration, cadence, elevationGain, strokes, dateObject }) {
    switch (type) {
      case "running":
        return new Running({ coords, distance, duration, cadence, dateObject });
      case "cycling":
        return new Cycling({ coords, distance, duration, elevationGain, dateObject });
      case "swimming":
        return new Swimming({ coords, distance, duration, strokes, dateObject });
      default:
        throw new Error(`Workout type: ${type} not found!`);
    }
  }
}
module.exports = {
    WorkoutFactory,
};
