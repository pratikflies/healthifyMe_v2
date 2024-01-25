const { Running } = require("./workouts/running");
const { Cycling } = require("./workouts/cycling");

class WorkoutFactory {
  static workoutRegistry = {
    running: Running,
    cycling: Cycling,
  };

  static getWorkout({ type, coords, distance, duration, cadence, elevationGain }) {
    switch (type) {
      case "running":
        return new Running({ coords, distance, duration, cadence });
      case "cycling":
        return new Cycling({ coords, distance, duration, elevationGain });
      default:
        throw new Error(`Workout type: ${type} not found!`);
    }
  }
}
module.exports = {
    WorkoutFactory,
};
