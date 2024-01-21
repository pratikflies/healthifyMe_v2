const mongoose = require("mongoose");
const Workout = require("../models/workout");
const User = require("../models/user");
const Image = require("../models/image");
const fileHelper = require("../util/file");
const { validationResult } = require("express-validator");

exports.getUserDetails = (req, res, next) => {
  return res.render("authentication/userDetailsForm.ejs", {
    //when click on edit button, you'll have all your fields saved;
    fullname: req.user.fullname || "",
    age: req.user.age || 1,
    gender: req.user.gender || "",
    weight: req.user.weight || 1.0,
    height: req.user.height || 1,
    goal: req.user.goal || 1,
  });
};

exports.postUserDetails = (req, res, next) => {
  const fullname = req.body.fullname;
  const gender = req.body.gender;
  const age = req.body.age;
  const height = req.body.height;
  const weight = req.body.weight;
  const goal = req.body.goal;

  //Invalid user-details;
  if (weight === 0 || height === 0 || goal === 0 || age === 0) {
    return res.redirect("/admin/user-details");
  }

  //Save user-details to database;
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err) {
      console.error("Error finding user:", err);
      return;
    }
    if (user) {
      user.fullname = fullname;
      user.gender = gender;
      user.age = age;
      user.height = height;
      user.weight = weight;
      user.goal = goal;
      user
        .save()
        .then((result) => {
          return res.redirect("/admin/dashboard");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

exports.getDashboard = (req, res, next) => {
  //filter your workouts everytime your dashboard is loaded;

  const currentDate = new Date();
  //Retrieve all documents from the Workouts collection
  Workout.find({ userId: req.user._id }, (err, workouts) => {
    if (err) {
      console.error("Error retrieving workouts:", err);
      return;
    }

    //Create an empty array to store workouts with a date greater than the current date
    const upcomingWorkoutsArray = [];
    let upcomingWorkoutsCount = 0;
    let upRunningCount = 0;
    let upCyclingCount = 0;
    let upSwimmingCount = 0;

    //Iterate over each document in the Workouts collection
    workouts.forEach((document) => {
      //Parse the newWorkout JSON to access the date field
      const newWorkout = JSON.parse(document.newWorkout);
      const workoutDate = new Date(newWorkout.date);

      //Compare the workout's date with the current date
      if (workoutDate > currentDate) {
        //Add the document to the workoutsArray
        upcomingWorkoutsArray.push(document);
        upcomingWorkoutsCount++;
        if (newWorkout.type === "running") upRunningCount++;
        else if (newWorkout.type === "cycling") upCyclingCount++;
        else if (newWorkout.type === "swimming") upSwimmingCount++;
      } else {
        //Find the corresponding User document
        User.findOne({ _id: document.userId }, (err, user) => {
          if (err) {
            console.error("Error finding user:", err);
            return;
          }

          if (user) {
            //Push the workout into the pastWorkouts field of the user
            user.pastWorkouts.items.push(document);
            //Save the updated User document
            user.save().then((result) => {
              //Delete the document from the Workouts collection
              Workout.deleteOne({ _id: document._id }, (err) => {
                if (err) {
                  console.error("Error deleting workout:", err);
                }
              });
            });
          }
        });
      }
    });

    User.findOne({ _id: req.user._id }, (err, user) => {
      if (err) {
        console.error("Error retrieving workouts:", err);
        return;
      }

      //Create an empty array to store workouts with a date less than the current date
      const pastWorkoutsArray = [];
      let totalDistance = 0;
      let totalTime = 0;
      let pastWorkoutsCount = 0;
      let pastRunningCount = 0;
      let pastCyclingCount = 0;
      let pastSwimmingCount = 0;

      //Iterate over each document in the User.pastWorkouts.items array;
      user.pastWorkouts.items.forEach((document) => {
        pastWorkoutsCount++;
        //Parse the newWorkout JSON to access the date field
        const newWorkout = JSON.parse(document.newWorkout);
        if (newWorkout.type === "running") pastRunningCount++;
        else if (newWorkout.type === "cycling") pastCyclingCount++;
        else if (newWorkout.type === "swimming") pastSwimmingCount++;
        totalDistance += newWorkout.distance;
        totalTime += newWorkout.duration;
        pastWorkoutsArray.push(document);
      });
      let cnt = 0;
      const last3WorkoutsArray = [];
      const len = pastWorkoutsArray.length;
      for (let i = len - 1; i >= 0; i--) {
        last3WorkoutsArray.push(pastWorkoutsArray[i]);
        cnt++;
        if (cnt == 3) break;
      }
      return res.render("dashboard/dashboard", {
        fullname: req.user.fullname.split(" ")[0],
        gender: req.user.gender,
        age: req.user.age,
        weight: req.user.weight,
        height: req.user.height,
        goal: req.user.goal,
        runningCount: upRunningCount + pastRunningCount,
        cyclingCount: upCyclingCount + pastCyclingCount,
        swimmingCount: upSwimmingCount + pastSwimmingCount,
        recentWorkoutsArray: last3WorkoutsArray,
        upcomingWorkoutsArray: upcomingWorkoutsArray,
        upcomingWorkoutsCount: upcomingWorkoutsCount,
        totalWorkoutsCount: pastWorkoutsCount + upcomingWorkoutsCount,
        totalDistance: totalDistance,
        totalTime: totalTime,
      });
    });
  });
};

exports.getApp = (req, res, next) => {
  Workout.find({ userId: req.user._id })
    .then((workouts) => {
      res.render("admin/admin", {
        workouts: workouts,
        userEmail: req.user.email,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.saveWorkout = (req, res, next) => {
  const workout = req.body.currWorkout;
  const object = new Workout({
    newWorkout: workout,
    userId: req.user._id,
  });
  object
    .save()
    .then((result) => {
      console.log("Created & Saved Workout!");
      res.send("Request received successfully");
      //It is indeed mandatory to send a response to requests coming via fetch in
      //order to complete the request-response cycle.
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteWorkout = (req, res, next) => {
  const clickedId = req.body.id;
  Workout.find({}, (err, workouts) => {
    //leaving {} blank means find all workouts;
    if (err) {
      console.error("Error retrieving workouts:", err);
    } else {
      let idToDelete;
      workouts.forEach((workout) => {
        // Perform operations on each workout
        const Workout = JSON.parse(workout.newWorkout);
        if (Workout.id == clickedId) idToDelete = workout._id;
      });

      //nested deleteOne inside find method so that it only executes after I have
      //gotten my idToDelete;
      Workout.deleteOne({ _id: idToDelete }, (err) => {
        if (err) {
          console.error("Error deleting document:", err);
        } else {
          console.log("Document deleted!");
          return res.send("Document deleted successfully!");
        }
      });
    }
  });
};

exports.resetUser = (req, res, next) => {
  Workout.deleteMany({ userId: req.user._id })
    .then((result) => {
      console.log(`${result.deletedCount} documents deleted!`);
      return res.status(200).send("User Reset Sucessfully!");
    })
    .catch((error) => {
      console.error("Error deleting documents:", error);
    });
};

exports.deleteProfile = (req, res, next) => {
  User.deleteOne({ _id: req.user._id })
    .then((result) => {
      Workout.deleteMany({ userdId: req.user._id })
        .then((result) => {
          console.log("Account deleted successfully!");
          return res.redirect("/login");
        })
        .catch((error) => {
          console.log("Error deleting documents:", error);
        });
    })
    .catch((error) => {
      console.log("Error deleting user:", error);
    });
};

exports.getGallery = (req, res, next) => {
  Image.find()
    .then((images) => {
      res.render("gallery/gallery", {
        images: images,
        story: "",
        errorMessage: "",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addImage = (req, res, next) => {
  const image = req.file;
  const story = req.body.story;

  if (!image) {
    return Image.find()
      .then((images) => {
        return res.status(422).render("gallery/gallery", {
          images: images,
          story: story,
          errorMessage: "Attached file is not an image",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const imageUrl = image.path;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return Image.find()
      .then((images) => {
        return res.status(422).render("gallery/gallery", {
          images: images,
          story: story,
          errorMessage:
            "Story must not be less than 5 characters or more than 100 characters!",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const img = new Image({
    imageUrl: imageUrl,
    story: story,
    userId: req.user._id,
  });
  img
    .save()
    .then((result) => {
      console.log("Story added!");
      res.redirect("/admin/gallery");
    })
    .catch((err) => {
      console.log(err);
    });
};
