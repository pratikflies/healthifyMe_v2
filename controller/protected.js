const mongoose = require("mongoose");
const Workout = require("../models/workout");
const User = require("../models/user");
const Image = require("../models/image");
const fileHelper = require("../util/file");
const { validationResult } = require("express-validator");

function square(num) { return num * num; }
exports.getUserProfile = async (req, res) => {
  try {
    const profile = (await User.findOne({ userId: req.userId }))?.meta;

    return res.status(200).json({
      name: profile?.name || "HealthifyMe User",
      age: profile?.age || 1, // store age as number in db
      gender: profile?.gender || "Not specified",
      target: profile?.target || 1, // store age as number in db
      bmi: (profile?.weight || 1)/square(profile?.height || 1),
    });
  } catch (error) {
    console.error("Error while fetching user profile: ", error);
    return res.status(500).json({ message: error.message });
  }
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

exports.getDashboard = async (req, res) => {
  try {
    // filter your workouts everytime your dashboard is loaded
    const currentDate = new Date();

    // retrieve all documents from the Workouts collection
    const workouts = await Workout.find({ userId: req.userId });

    // create an empty array to store workouts with a date greater than the current date
    const upcomingWorkoutsArray = []; const completedWorkoutsArray = [];
    let distanceCovered = 0; let timeSpent = 0;
    let completedRunningCount = 0; let completedCyclingCount = 0; let completedSwimmingCount = 0;
    let upcomingRunningCount = 0; let upcomingCyclingCount = 0; let upcomingSwimmingCount = 0;

    // iterate over each document in the Workouts collection
    workouts.forEach((workout) => {
      if (workout.date > currentDate) {
        // add the workout to the upcomingWorkoutsArray
        upcomingWorkoutsArray.push(workout);
        if (workout.type === "running") upcomingRunningCount++;
        else if (workout.type === "cycling") upcomingCyclingCount++;
        else upcomingSwimmingCount++;
        } else {
        // add the workout to the completedWorkoutsArray
        completedWorkoutsArray.push(workout);
        if (workout.type === "running") completedRunningCount++;
        else if (workout.type === "cycling") completedCyclingCount++;
        else completedSwimmingCount++;
        distanceCovered += workout.distance;
        timeSpent += workout.duration;
      }
    });
      
    return res.status(200).json({
      runningCount: upcomingRunningCount + completedRunningCount,
      cyclingCount: upcomingCyclingCount + completedCyclingCount,
      swimmingCount: upcomingSwimmingCount + completedSwimmingCount,
      completedWorkoutsArray,
      upcomingWorkoutsArray,
      distanceCovered,
      timeSpent,
    });
  } catch (error) {
    console.error("Error fetching user's dashboard: ", error);
    return res.status(200).json({ message: error.message });
  }
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
