'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputStrokes = document.querySelector('.form__input--strokes');
const inputElevation = document.querySelector('.form__input--elevation');
const inputDateTime = document.getElementById('datetime-input');
const btnsCustomContainer = document.querySelector('.custom__btns');
const btnReset = document.getElementById('reset-button');
const btnForm = document.querySelector('.btn-_form');
const okbutton = document.querySelector('.form__btn');
const sortContainer = document.querySelector('.sort__buttons__container');
const sortDivider = document.querySelector('.sort__devider');
const showSortBtns = document.querySelector('.show__sort__btns');
const dropdownItems = document.querySelectorAll('.dropdown-content a');

class Workout {
  //we're still using current date to set the id because it's guaranteed to be unique;
  id = String(Date.now()).slice(-10);

  constructor(coords, distance, duration, dateObject) {
    this.coords = coords; //[lat, lng]
    this.distance = distance;
    this.duration = duration;
    this.date = dateObject;
  }

  _setDescription() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)}, ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}, ${
      this.date.getHours() + ':' + this.date.getMinutes()
    }`;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence, dateObject) {
    super(coords, distance, duration, dateObject);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain, dateObject) {
    super(coords, distance, duration, dateObject);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class Swimming extends Workout {
  type = 'swimming';
  constructor(coords, distance, duration, strokes, dateObject) {
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

//APPLICATION ARCHIRECTURE
class App {
  #map;
  #mapEvent;
  #mapZoomLevel = 14;
  #workouts = [];
  #markers = [];
  #workoutEditId;
  #flag = 0;
  lat;
  lng;
  userCoordinates;

  constructor() {
    //Get user's current position
    this._getPosition();

    //Get data from DB
    this._getDBStorage();

    //Event handlers
    /*we bind every function to this scope becaue it's a call
    -back function, where this would otherwise point towards
    the object on which it was called*/
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('click', this._toggleElevationField.bind(this));
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    btnReset.addEventListener('click', this.reset);
    okbutton.addEventListener('change', this._newWorkout.bind(this));

    //sort event listener;
    showSortBtns.addEventListener('click', this._toggleSortBtns.bind(this));
    sortContainer.addEventListener('click', this._sortAndRender.bind(this));

    //adding event listener to all options in the filter menu;
    for (let i = 0; i < dropdownItems.length; i++) {
      dropdownItems[i].addEventListener(
        'click',
        this._handleDropdownItemClick.bind(this)
      );
    }
  }

  //Getting the user's position
  _getPosition() {
    /*accessing location using geolocation API, success and
    failure callback functions respectively*/
    if (navigator.geolocation) {
      //returns a coords object
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position!');
        }
      );
    }
  }

  //Load the map
  _loadMap(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords = [latitude, longitude];
    this.userCoordinates = [latitude, longitude];
    const username = user_email.split('@')[0];

    //we'll need a map element to store the rendered map
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //render user's current location on the map;
    const myIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/128/9809/9809681.png',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [1, -46],
      //iconSize  iconAnchor
      //x         x/2
      //y          y
    });
    const marker = L.marker(coords, { icon: myIcon })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 150,
          autoClose: false,
          closeOnClick: false,
          //className: `${userLocation}-popup`,
        })
      )
      .setPopupContent(`Welcome, ${username} 👋`)
      .openPopup();

    //method from the leaflet library
    this.#map.on('click', this._showForm.bind(this));
    currWorkouts.forEach(
      function (workout) {
        /*bind is very important here, calling _renderMarker 
        here only after the map has loaded*/
        const Workout = JSON.parse(workout.newWorkout);
        this._renderWorkoutMarker(Workout, false, false);
      }.bind(this)
    );
  }

  //Routing function to map the minimum distance
  _routingFunction(lat, lng) {
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(this.userCoordinates[0], this.userCoordinates[1]),
        L.latLng(lat, lng),
      ],
      createMarker: function (i, waypoint, n) {
        return null; // Disable marker creation
      },
      show: false, // Disable direction popup
      lineOptions: {
        styles: [
          { color: '#FF0000', opacity: 1.0, weight: 6 }, // Custom color and line styles
        ],
      },
    }).addTo(this.#map);
  }

  //Showing the form
  _showForm(mapE) {
    //here'well get the co-ordinates of the clicked point
    this.#mapEvent = mapE;
    this._routingFunction(mapE.latlng.lat, mapE.latlng.lng);
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    //hide form + empty inputs
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    setTimeout(() => {
      form.style.display = 'grid';
    }, 1000);
    form.classList.add('hidden');
  }

  //Toggling the elevation form
  _toggleElevationField() {
    //hide all three
    inputElevation.closest('.form__row').classList.add('form__row--hidden');
    inputCadence.closest('.form__row').classList.add('form__row--hidden');
    inputStrokes.closest('.form__row').classList.add('form__row--hidden');

    //show whichever's required (prevents bugs)
    if (inputType.value === 'running') {
      inputCadence.closest('.form__row').classList.remove('form__row--hidden');
    }
    if (inputType.value === 'cycling') {
      inputElevation
        .closest('.form__row')
        .classList.remove('form__row--hidden');
    }
    if (inputType.value === 'swimming') {
      inputStrokes.closest('.form__row').classList.remove('form__row--hidden');
    }
  }

  _showCustomButtons() {
    if (this.#workouts.length === 0) return;
    btnsCustomContainer.classList.remove('hidden');
  }

  _allPositive(a, b, c = 1) {
    if (a <= 0 || b <= 0 || c <= 0) return false;
    return true;
  }

  _validInput(a, b, c, inputDate) {
    if (!Number.isFinite(a)) return false;
    if (!Number.isFinite(b)) return false;
    if (!Number.isFinite(c)) return false;

    //checks for empty date field
    if (inputDate.trim() === '') return false;

    //checks if the user has put a past date;
    const parsedDate = new Date(inputDate);
    const nowFormat = parsedDate.getTime();
    if (Date.now() >= nowFormat) return false;
    return true;
  }

  //Creating the workouts;
  _newWorkout(e) {
    if (e.type == 'submit') e.preventDefault();

    //Get data from the form;
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    const dateTime = inputDateTime.value;
    //converts to ISO format;
    const dateObject = new Date(dateTime);

    if (this.#flag === 0) {
      //flag=1 means we're in edit mode, in which case we already have our coordinates;
      this.lat = this.#mapEvent.latlng.lat;
      this.lng = this.#mapEvent.latlng.lng;
    }

    let workout;
    //If workout is Running, create Running object;
    if (type === 'running') {
      const cadence = Number(inputCadence.value);

      //Check if the data is valid;
      if (
        !this._validInput(distance, duration, cadence, dateTime) ||
        !this._allPositive(distance, duration, cadence)
      ) {
        return alert('Input is not valid!');
      }
      workout = new Running(
        [this.lat, this.lng],
        distance,
        duration,
        cadence,
        dateObject
      );
    }

    //If workout is Cycling, create Cycling object;
    if (type === 'cycling') {
      const elevation = Number(inputElevation.value);

      //Check if the data is valid;
      if (
        !this._validInput(distance, duration, elevation, dateTime) ||
        !this._allPositive(distance, duration)
      ) {
        return alert('Input is not valid!');
      }
      workout = new Cycling(
        [this.lat, this.lng],
        distance,
        duration,
        elevation,
        dateObject
      );
    }
    if (type === 'swimming') {
      const strokes = Number(inputStrokes.value);
      //Check if the data is valid;
      if (
        !this._validInput(distance, duration, strokes, dateTime) ||
        !this._allPositive(distance, duration, strokes)
      ) {
        return alert('Input is not valid!');
      }
      workout = new Swimming(
        [this.lat, this.lng],
        distance,
        duration,
        strokes,
        dateObject
      );
    }
    //since flag=1 means edit mode, this line deletes the workout that was edited;
    if (this.#flag === 1) this._deleteWorkoutById(this.#workoutEditId);

    //Render workout on map as marker;
    this._renderWorkoutMarker(workout, true, true);

    //Render workout on container list;
    this._renderWorkout(workout);

    //Hide form + clear input fields;
    this._hideForm();

    //Showing the buttons;
    if (btnsCustomContainer.classList.contains('hidden')) {
      this._showCustomButtons();
    }
  }

  _renderWorkoutMarker(workout, saveToArray, saveToDB) {
    let myIcon;

    if (workout.type === 'running') {
      myIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/6266/6266049.png',
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [1, -46],
        //iconSize  iconAnchor
        //x         x/2
        //y          y
      });
    }
    if (workout.type === 'cycling') {
      myIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/3600/3600996.png',
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [1, -46],
      });
    }
    if (workout.type === 'swimming') {
      myIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/2264/2264829.png',
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [1, -46],
      });
    }

    const marker = L.marker(workout.coords, { icon: myIcon })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${
          workout.type === 'running'
            ? '🏃'
            : workout.type === 'cycling'
            ? '🚴'
            : '🏊‍♀️'
        } ${workout.description}`
      )
      .openPopup();

    //rest of this function's explanaton is huge, will tell over call;
    if (saveToArray === true) this.#workouts.push(workout);

    if (saveToDB === true) {
      //this is template function to remove circular references in an object;
      function stringifyWithCircular(obj) {
        const cache = new WeakSet();

        return JSON.stringify(obj, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
              // Circular reference found, replace with a placeholder;
              return '[Circular Reference]';
            }
            // Add the object to the cache;
            cache.add(value);
          }
          return value;
        });
      }
      const sanitizedWorkout = stringifyWithCircular(workout);

      //using fetch function to send data from front-end to back end. At back-end,
      //it'll only hit the save API (no redirection);
      fetch('/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          currWorkout: sanitizedWorkout,
        }),
      })
        .then(response => {
          console.log(response);
          // Handle the response data;
        })
        .catch(err => {
          console.log(err);
          // Handle any error that occurred;
        });
    }
    // Storing the markers
    this.#markers.push(marker);
    // Attaching the id with the marker;
    marker.markID = workout.id;
  }

  _renderWorkout(workout) {
    const lat = workout.coords[0];
    const lng = workout.coords[1];
    let temperature = 29;
    //setting a default temperature value might help in case the weatherbit API is down;
    const apiKey = 'aecc8a1043524071881b6663ae85eefd';
    const url1 = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${apiKey}`;
    const url2 = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

    const fetchTemperature = fetch(url1).then(response => response.json());
    const fetchLocation = fetch(url2).then(response => response.json());

    //simulataneously running promises instead of chaining, better app performance;
    Promise.all([fetchTemperature, fetchLocation])
      .then(([dataTemp, dataLocation]) => {
        //Access the location information from the JSON response (priority wise);
        const locality =
          dataLocation.address.city ||
          dataLocation.address.town ||
          dataLocation.address.village ||
          dataLocation.address.state;
        //Access the weather information from the JSON response;
        temperature = dataTemp?.data[0].temp;

        // Use the weather data as desired
        const icon =
          workout.type === 'running'
            ? '🏃'
            : workout.type === 'cycling'
            ? '🚴'
            : '🏊‍♀️';
        let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${
            workout.description + ', ' + locality
          }</h2>
          <div class="workout__btns">
            <button class="workout__btn workout__btn--edit">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="workout__btn workout__btn--delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <div class="workout__details">
            <span class="workout__icon">${icon}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🌡️</span>
            <span class="workout__value">${temperature}</span>
            <span class="workout__unit">&degC</span>
          </div>
    `;

        if (workout.type === 'running')
          html += `
      <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.pace.toFixed(1)}</span>
      <span class="workout__unit">min/km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${workout.cadence}</span>
      <span class="workout__unit">spm</span>
    </div>
  </li>
      `;

        if (workout.type === 'cycling')
          html += `
        <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevationGain}</span>
        <span class="workout__unit">m</span>
      </div>
    </li>
        `;

        if (workout.type === 'swimming')
          html += `
          <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🏊🏻</span>
          <span class="workout__value">${workout.strokes}</span>
          <span class="workout__unit">/MIN</span>
        </div>
      </li>
          `;

        form.insertAdjacentHTML('afterend', html);
        const btnDelete = document.querySelector('.workout__btn--delete');
        const btnEdit = document.querySelector('.workout__btn--edit');
        btnDelete.addEventListener('click', this._deleteWorkout.bind(this));
        btnEdit.addEventListener('click', this._editWorkout.bind(this));
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch requests
        console.error('Error:', error);
      });
  }

  //event delegation
  _moveToPopup(e) {
    //no matter if i click on span, div etc
    const workoutEl = e.target.closest('.workout');

    //clicking on edit/delete would also return;
    if (!workoutEl || e.target.closest('.workout__btns')) return;

    //now we use the id;
    const workout = this.#workouts.find(function (el) {
      return el.id === workoutEl.dataset.id;
    });
    //calling the routing function
    this._routingFunction(workout.coords[0], workout.coords[1]);

    ////method from the leaflet library;
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _getDBStorage() {
    currWorkouts.forEach(
      function (workout) {
        let Workout = JSON.parse(workout.newWorkout);
        //setting back the protoype chain, rendering the workout(s);
        Workout =
          Workout.type === 'running'
            ? Object.setPrototypeOf(Workout, Running.prototype)
            : workout.type === 'cycling'
            ? Object.setPrototypeOf(Workout, Cycling.prototype)
            : Object.setPrototypeOf(Workout, Swimming.prototype);
        this.#workouts.push(Workout);
        this._renderWorkout(Workout);
      }.bind(this)
    );
    //Showing the buttons;
    this._showCustomButtons();
  }

  reset() {
    //clear all;
    fetch('/admin/reset', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    })
      .then(response => {
        if (!response.ok) {
          console.log(response.ok);
          throw new Error('Error deleting resource!');
        }
        console.log('Resource deleted successfully!');
        //redirecting from within javascript;
        window.location = '/admin/healthifyMe';
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  _deleteWorkout(e) {
    //POINT TO NOTE - say, we added a workout and now we want to delete it immediately.
    //Quite obviously the workout won't be present in the currWorkouts array that we
    //passed. (In case you redirect after creating a new workout everytime, the updated
    //currWorkouts will be passed everytime. But that leads to a bad user experience.)
    //Anyway, the workout is present in the database as well as the #workouts array.
    //So we delete it from both the places.
    // Find the clicked workout element's id;
    const clickedId = e.target.closest('.workout').dataset.id;
    //Deleting the workout from database;
    //WHY FETCH? Fetch is a built in function that allows us to send STRINGIFIED objects
    //from frontend to the backend of the application. Alternative - Axion, but for some
    //reason the request body wasn't being parsed propertly.
    fetch('/admin/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        id: clickedId,
      }),
    })
      .then(response => {
        console.log(response);
        //Handle the response data;
      })
      .catch(err => {
        console.log(err);
        // Handle any error that occurred;
      });

    //Deleting from the #workouts array as well;
    const index = this.#workouts.findIndex(function (el) {
      return el.id === clickedId;
    });

    // Remove the workout from the array;
    this.#workouts.splice(index, 1);

    // Check if the workouts array is empty;
    if (this.#workouts.length === 0) {
      btnsCustomContainer.classList.add('hidden');
    }
    // Remove the marker from the map -> although I don't know how it's working;
    this.#markers
      .find(function (el) {
        return el.markID === clickedId;
      })
      .remove();

    // Remove the workout element from the page
    e.target.closest('.workout').remove();
  }

  _deleteWorkoutById(docId) {
    //Deleting the workout to be edited from the database;
    fetch('/admin/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        id: docId,
      }),
    })
      .then(response => {
        console.log(response);
        // Handle the response data
      })
      .catch(err => {
        console.log(err);
        // Handle any error that occurred
      });

    const clickedId = docId;
    //Deleting from the #workouts array as well;
    //Find the clicked workout in the array
    const index = this.#workouts.findIndex(function (el) {
      return el.id === clickedId;
    });

    // Remove the workout from the array
    this.#workouts.splice(index, 1);

    // Check if the workouts array is empty
    if (this.#workouts.length === 0) {
      // If it's empty, hide the buttons
      btnsCustomContainer.classList.add('hidden');
    }
    // Remove the marker from the map
    this.#markers
      .find(function (el) {
        return el.markID === clickedId;
      })
      .remove();

    // Remove the workout element from the page
    document.querySelector(`[data-id="${clickedId}"]`).remove();
    this.#flag = 0;
  }

  _editWorkout(e) {
    const clickedId = e.target.closest('.workout').dataset.id;
    const workout = this.#workouts.find(function (el) {
      return el.id === clickedId;
    });
    form.classList.remove('hidden');
    inputDistance.focus();
    inputDistance.value = workout.distance;
    inputDuration.value = workout.duration;
    inputDateTime.value = workout.date;
    if (workout.type === 'running') inputCadence.value = workout.cadence;
    if (workout.type === 'cycling')
      inputElevation.value = workout.elevationGain;
    if (workout.type === 'swimming') inputStrokes.value = workout.strokes;
    this.lat = workout.coords[0];
    this.lng = workout.coords[1];
    this.#workoutEditId = clickedId;
    this.#flag = 1;
  }

  _handleDropdownItemClick(e) {
    e.preventDefault(); // Prevent the default link behavior
    const selectedOption = e.target.getAttribute('data-option');

    containerWorkouts
      .querySelectorAll('.workout')
      .forEach(workout => workout.remove());
    // clear workouts from map(to prevent bug in array order when deleting a single workout)
    this.#markers.forEach(marker => marker.remove());
    //clear array
    this.#markers = [];

    // Perform different actions based on the selected option
    switch (selectedOption) {
      case 'running':
        // Code for running option
        // render list again with only running workouts;
        this.#workouts.forEach(workout => {
          if (workout.type === 'running') {
            // create new markers and render them on map
            this._renderWorkout(workout);
            this._renderWorkoutMarker(workout, false, false);
          }
        });
        console.log('Running option selected!');
        break;
      case 'cycling':
        // Code for cycling option
        // render list again with only running workouts;
        this.#workouts.forEach(workout => {
          if (workout.type === 'cycling') {
            // create new markers and render them on map
            this._renderWorkout(workout);
            this._renderWorkoutMarker(workout, false, false);
          }
        });
        console.log('Cycling option selected!');
        break;
      case 'swimming':
        // Code for swimming option
        // render list again with only running workouts;
        this.#workouts.forEach(workout => {
          if (workout.type === 'swimming') {
            // create new markers and render them on map
            this._renderWorkout(workout);
            this._renderWorkoutMarker(workout, false, false);
          }
        });
        console.log('Swimming option selected!');
        break;
      case 'show-all':
        // Code for show all option
        // render list again with only running workouts;
        this.#workouts.forEach(workout => {
          // create new markers and render them on map
          this._renderWorkout(workout);
          this._renderWorkoutMarker(workout, false, false);
        });
        console.log('Show All option selected!');
        break;
      default:
        break;
    }
  }

  _toggleSortBtns() {
    sortContainer.classList.toggle('zero__height');
  }
  _sortAndRender(e) {
    const element = e.target.closest('.sort__button');
    console.log(e);

    //default
    let currentDirection = 'descending';
    //guard function
    if (!element) return;

    const arrow = element.querySelector('.arrow');
    console.log(arrow);
    const type = element.dataset.type;
    console.log(type);
    //set all arrows to default state(down)
    sortContainer
      .querySelectorAll('.arrow')
      .forEach(e => e.classList.remove('arrow__up'));

    //get which direction to sort
    const typeValues = this.#workouts.map(workout => {
      return workout[type];
    });
    console.log(typeValues);
    const sortedAscending = typeValues
      .slice()
      .sort(function (a, b) {
        return a - b;
      })
      .join('');
    const sortedDescending = typeValues
      .slice()
      .sort(function (a, b) {
        return b - a;
      })
      .join('');

    // compare sortedAscending array with values from #workout array to check how are they sorted
    // 1. case 1 ascending
    if (typeValues.join('') === sortedAscending) {
      currentDirection = 'ascending';
      arrow.classList.add('arrow__up');
    }
    // 2. case 2 descending
    if (typeValues.join('') === sortedDescending) {
      currentDirection = 'descending';
      arrow.classList.remove('arrow__up');
    }

    // sort main workouts array
    this._sortArray(this.#workouts, currentDirection, type);

    // RE-RENDER
    // clear rendered workouts from DOM
    containerWorkouts
      .querySelectorAll('.workout')
      .forEach(workout => workout.remove());
    // clear workouts from map(to prevent bug in array order when deleting a single workout)
    this.#markers.forEach(marker => marker.remove());
    //clear array
    this.#markers = [];
    // render list all again sorted
    this.#workouts.forEach((workout, index) => {
      setTimeout(() => {
        this._renderWorkout(workout);
        this._renderWorkoutMarker(workout, false, false);
        console.log(workout);
      }, 200 * (index + 1));
    });
    // center map on the last item in array (this will be 1st workout on the list in the UI)
    // const lastWorkout = this.#workouts[this.#workouts.length - 1];
    // this._moveToPopup(lastWorkout);
  }
  _sortArray(array, currentDirection, type) {
    // sort opposite to the currentDirection
    if (currentDirection === 'ascending') {
      array.sort(function (a, b) {
        return b[type] - a[type];
      });
    }
    if (currentDirection === 'descending') {
      array.sort(function (a, b) {
        return a[type] - b[type];
      });
    }
  }
}

const app = new App();
//can use app.reset() on console on clear all workouts
