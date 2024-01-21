//main-page
const quoteElement = document.querySelector(".header h1");
const pieChartElement = document.getElementById("pieChart");
const progressChartElement = document.getElementById("progressChart");
const imageContainer = document.getElementById("imageContainer");
const workoutListElement = document.getElementById("workoutList");
const plannedWorkoutsListElement = document.getElementById(
  "plannedWorkoutsList"
);

//right-sidebar
const nameElement = document.getElementById("fullname");
const ageElement = document.getElementById("age");
const genderElement = document.getElementById("gender");
const bmiElement = document.getElementById("bmi");
const goalElement = document.getElementById("goal");
const levelElement = document.getElementById("level");
const totalWorkoutsElement = document.getElementById("totalWorkouts");
const upcomingWorkoutsElement = document.getElementById("upcomingWorkouts");
const totalDistanceElement = document.getElementById("totalDistance");
const totalTimeElement = document.getElementById("totalTime");
const caloriesElement = document.getElementById("calories");
const messageElement = document.getElementById("message");

//Generate random motivational quote
document.addEventListener("DOMContentLoaded", function () {
  const quotes = [
    `“Strength does not come from physical capacity. It comes from an indomitable will”
    -Mahatma Gandhi`,
    `“Success usually comes to those who are too busy to be looking for it.” -Henry David Thoreau`,
    `“If you want something you have never had, you must be willing to do something you have never done.” -Thomas Jefferson`,
    `“The body achieves what the mind believes.”`,
    `“Once you are exercising regularly, the hardest thing is to stop it.” -Erin Gray`,
    `“If you do not make time for exercise, you will probably have to make time for illness.”
    -Robin Sharma`,
    `“Dead last finish is greater than did not finish, which trumps did not start.”`,
    `“The best way to predict the future is to create it.” -Abraham Lincoln`,
    `“Rome was not built in a day, but they worked on it every single day.”`,
  ];
  quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}); //this was at last;

// Create a sample pie chart
new Chart(pieChartElement, {
  type: "pie",
  data: {
    labels: ["Running", "Swimming", "Cycling"],
    datasets: [
      {
        data: [runningCount, swimmingCount, cyclingCount],
        backgroundColor: ["#5CDB95", "#36A2EB", "#FFCE56"],
      },
    ],
  },
  options: {
    responsive: true,
  },
});

// Create a progress bar chart
new Chart(progressChart, {
  type: "bar",
  data: {
    labels: ["Distance Covered", "Target Distance"],
    datasets: [
      {
        data: [totalDistance, goal],
        backgroundColor: ["#0049B7", "#ff1d58"],
      },
    ],
  },
  options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: goal,
        title: {
          display: true,
          text: "Distance", // X-axis label
        },
        ticks: {
          callback: function (value, index, values) {
            return parseFloat(value)
              .toFixed(2)
              .replace(/\.?0+$/, "");
          },
        },
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});

//Create an img element
const progressRatio = totalDistance / goal;
const imgElement = document.createElement("img");
if (progressRatio >= 0.0 && progressRatio <= 0.1) {
  imgElement.src = "https://cdn-icons-png.flaticon.com/128/3472/3472620.png";
  levelElement.textContent = 1 + " (Great Start!)";
} else if (progressRatio > 0.1 && progressRatio <= 0.3) {
  imgElement.src = "https://cdn-icons-png.flaticon.com/128/4090/4090424.png";
  levelElement.textContent = 2 + " (Good Progress!)";
} else if (progressRatio > 0.3 && progressRatio <= 0.7) {
  imgElement.src = "https://cdn-icons-png.flaticon.com/128/183/183742.png";
  levelElement.textContent = 3 + " (Keep Pushing!)";
} else if (progressRatio > 0.7 && progressRatio <= 0.9) {
  imgElement.src = "https://cdn-icons-png.flaticon.com/128/8146/8146767.png";
  levelElement.textContent = 4 + " (Wonderful, almost there!)";
} else if (progressRatio > 0.9) {
  imgElement.src = "https://cdn-icons-png.flaticon.com/128/2058/2058913.png";
  levelElement.textContent = 5 + " (Exemplary Determination!)";
}
imgElement.alt = "Badge";
imageContainer.appendChild(imgElement);

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

if (recentWorkoutsArray.length === 0) {
  const workoutElement = document.createElement("li");
  workoutElement.innerHTML = `You are yet to complete your first workout...`;
  workoutListElement.appendChild(workoutElement);
} else {
  recentWorkoutsArray.forEach((workout) => {
    const workoutElement = document.createElement("li");
    const Workout = JSON.parse(workout.newWorkout);
    workoutElement.innerHTML = `${Workout.type[0].toUpperCase()}${Workout.type.slice(
      1
    )}, ${months[new Date(Workout.date).getMonth()]} ${new Date(
      Workout.date
    ).getDate()}, ${
      new Date(Workout.date).getHours() +
      ":" +
      new Date(Workout.date).getMinutes()
    } - ${Workout.distance} km, ${Workout.duration} minutes`;
    workoutListElement.appendChild(workoutElement);
  });
}

if (upcomingWorkoutsArray.length === 0) {
  const workoutElement = document.createElement("li");
  workoutElement.innerHTML = `You have no planned workouts. Head to our map to plan some.`;
  plannedWorkoutsListElement.appendChild(workoutElement);
} else {
  upcomingWorkoutsArray.forEach((workout) => {
    const workoutElement = document.createElement("li");
    const Workout = JSON.parse(workout.newWorkout);
    workoutElement.innerHTML = `${Workout.type[0].toUpperCase()}${Workout.type.slice(
      1
    )}, ${months[new Date(Workout.date).getMonth()]} ${new Date(
      Workout.date
    ).getDate()}, ${
      new Date(Workout.date).getHours() +
      ":" +
      new Date(Workout.date).getMinutes()
    } - ${Workout.distance} km, ${Workout.duration} minutes`;
    plannedWorkoutsListElement.appendChild(workoutElement);
  });
}

// Update right sidebar
// considering an average MET value of 3.5 although it varies for different activities;
const caloriesBurnt = (totalTime * (3.5 * 3.5 * weight)) / 200;
const bmi = weight / (height * height);
let message;
let maxi = Math.max(runningCount, swimmingCount, cyclingCount);
if (runningCount * 2 < maxi)
  message = "Prefer Running 🏃 to have a balanced workout schedule.";
else if (swimmingCount * 2 < maxi)
  message = "Prefer Swimming 🏊‍♀️ to have a balanced workout schedule.";
else if (cyclingCount * 2 < maxi)
  message = "Prefer Cycling 🚴‍♂️ to have a balanced workout schedule.";
else message = "Perfectly balanced...as all things should be! 🤹";
nameElement.textContent = fullname;
ageElement.textContent = age;
genderElement.textContent = gender;
bmiElement.textContent = bmi.toFixed(2);
goalElement.textContent = goal + " km";
totalWorkoutsElement.textContent = totalWorkoutsCount;
upcomingWorkoutsElement.textContent = upcomingWorkoutsCount;
totalDistanceElement.textContent = totalDistance + " km";
totalTimeElement.textContent = totalTime + " minutes";
caloriesElement.textContent = caloriesBurnt.toFixed(2);
messageElement.textContent = message;
