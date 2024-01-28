const { Workout } = require("../workout");

class Running extends Workout {
    type = "running";
  
    constructor({ coords, distance, duration, cadence, dateObject }) {
      super(coords, distance, duration, dateObject);
      this.cadence = cadence;
      this.calcPace();
      this._setDescription();
    }
  
    calcPace() {
      // min/km
      this.pace = this.duration / this.distance;
      return this.pace;
    }
};

module.exports = {
  Running,
}