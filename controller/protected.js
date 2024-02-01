const mongoose = require("mongoose");
const Workout = require("../models/workout");
const User = require("../models/user");
const Image = require("../models/image");
const tokenLog = require("../models/tokenLog");
const fileHelper = require("../util/file");
const { validationResult } = require("express-validator");
const { WorkoutFactory } = require("../data-engine/workoutFactory");

function square(num) { return num * num; }
exports.getUserProfile = async (req, res) => {
  try {
    const profile = (await User.findOne({ _id: req.userId }))?.meta;

    return res.status(200).json({
      firstName: profile?.firstName || "NA ",
      lastName: profile?.lastName || "NA",
      age: profile?.age || 1,
      height: profile?.height || 1,
      weight: profile?.weight || 1,
      gender: profile?.gender || "Choose not to disclose",
      target: profile?.target || 1, 
      bmi: (parseFloat(profile?.weight || 1)/square(profile?.height || 1)).toFixed(2),
    });
  } catch (error) {
    console.error(`Error while fetching profile for user: ${req.userId}, `, error);
    return res.status(500).json({ message: error.message });
  }
};

exports.postUserProfile = async (req, res) => {
  const { firstName, lastName, gender, age, height, weight, target } = req.body;

  // validate details 
  if (firstName.trim() === "" || weight === 0 || height === 0 || target === 0 || age === 0) {
    throw new Error("Invalid profile details entered!");
  }

  // save user-details to database 
  try {
    const userProfile = {
      firstName,
      lastName,
      gender,
      age,
      height,
      weight,
      target,
    };    

    const user = await User.findOne({ _id: req.userId });
    if (user) {
      user.meta = {
        ...user.meta,
        ...userProfile,
      }
    }
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(`Error finding and updating profile for user: ${req.userId}, `, error);
    res.status(500).json({ message: error.message });
  }  
};

function generateRecommendation(runningCount, swimmingCount, cyclingCount) {
  let maxi = Math.max(runningCount, swimmingCount, cyclingCount);
  if (runningCount * 2 < maxi)
    return "🏃 to have a balanced workout schedule.";
  else if (swimmingCount * 2 < maxi)
    return "🏊‍♀️ to have a balanced workout schedule.";
  else if (cyclingCount * 2 < maxi)
    return "🚴‍♂️ to have a balanced workout schedule.";
  return "Perfectly balanced! 🤹";
};

exports.getDashboard = async (req, res) => {
  try {
    // filter your workouts everytime your dashboard is loaded
    const currentDate = new Date();

    // retrieve all documents from the Workouts collection
    const workoutDocuments = await Workout.find({ userId: req.userId });
    const workouts = workoutDocuments.map(doc => doc.workout);

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

    const runningCount = upcomingRunningCount + completedRunningCount;
    const cyclingCount = upcomingCyclingCount + completedCyclingCount;
    const swimmingCount = upcomingSwimmingCount + completedSwimmingCount;
    const recommendation = generateRecommendation(runningCount, swimmingCount, cyclingCount);
      
    return res.status(200).json({
      runningCount,
      cyclingCount,
      swimmingCount,
      completedWorkoutsArray,
      upcomingWorkoutsArray,
      distanceCovered,
      timeSpent,
      recommendation,
    });
  } catch (error) {
    console.error(`Error fetching dashboard for user: ${req.userId} `, error);
    return res.status(500).json({ message: error.message });
  }
};

exports.fetchWorkout = async (req, res) => {
  try {
    const workoutDocuments = await Workout.find({ userId: req.userId });
    const workouts = workoutDocuments.map(doc => doc.workout);

    const currentDate = new Date();
    const upcomingWorkoutsArray = workouts.filter((workout) => {
      return workout.date > currentDate;
    });
    res.status(200).json(upcomingWorkoutsArray);
  } catch (error) {
    console.error(`Error while fetching workouts for user: ${req.userId}, `, error);
    return res.status(500).json({ message: error.message });
  }
};

exports.saveWorkout = async (req, res) => {
  const {type, coords, distance, duration, cadence, elevationGain, strokes, dateObject, id} = req.body;

  try {
    const workout = WorkoutFactory.getWorkout(
      { 
        type, 
        coords, 
        distance, 
        duration, 
        cadence, 
        elevationGain, 
        strokes, 
        dateObject,
      }
    );

    workout.id = id;
    await Workout.create({
      userId: req.userId,
      workout,
    });
    res.status(201).json({ success: true });
  }
  catch (error) {
    console.error(`Error adding workout of type: ${type} for user: ${req.userId}, `, error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  const workoutId = req.body.id;
  try {
    const result = await Workout.deleteOne({ "workout.id": workoutId });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(`Error deleting workout with id: ${workoutId} for user: ${req.userId}!`, error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.postLogout = async (req, res) => {
  try {
    const result = await tokenLog.deleteOne({ token: req.body.token });
    console.log(`Logged out user: ${req.userId}.`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(`Error logging out user: ${req.userId}!`);
    res.status(500).json({ message: error.message });
  }
};

exports.resetUser = (req, res) => {
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
