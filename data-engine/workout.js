class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);
    clicks = 0;
  
    constructor(coords, distance, duration, dateObject) {
      this.coords = coords; // [lat, lng]
      this.distance = distance; // in km
      this.duration = duration; // in min
      if (dateObject) {
        this.isDateObject = true;
        this.date = new Date(dateObject);
      }
    }
  
    _setDescription() {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
  
      this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
        months[this.date.getMonth()]
      } ${this.date.getDate()}`;

      if (this.isDateObject) this.description += `, ${this.date.getHours() + ':' + this.date.getMinutes()}`;
    }
  
    click() {
      this.clicks++;
    }
}

module.exports = {
    Workout,
}