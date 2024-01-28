const { Workout } = require("../workout");

class Swimming extends Workout {
    type = 'swimming';
    constructor({ coords, distance, duration, strokes, dateObject }) {
      super(coords, distance, duration, dateObject);
      this.strokes = strokes;
      this.calcSpeed();
      this._setDescription();
    }
  
    calcSpeed() {
      this.speed = this.distance / (this.duration / 60);
      return this.speed;
    }
}

module.exports = {
    Swimming,
}