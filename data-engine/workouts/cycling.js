const { Workout } = require("../workout");

class Cycling extends Workout {
  type = "cycling";

  constructor({ coords, distance, duration, elevationGain, dateObject }) {
    super(coords, distance, duration, dateObject);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

module.exports = {
  Cycling,
}