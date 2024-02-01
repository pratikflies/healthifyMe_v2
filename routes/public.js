const path = require("path");
const express = require("express");
//destructuring
const { check, body } = require("express-validator");
const publicController = require("../controller/public");
const User = require("../models/user");

const router = express.Router();

router.post("/add-workout", publicController.addWorkout);
router.get("/", publicController.getHomepage);
router.get("/login", publicController.getLogin);
router.get("/signup", publicController.getSignup);
router.get("/reset", publicController.getReset);
router.get("/reset/:token", publicController.getNewPassword);
router.get("/contact-us", publicController.getContact);
// router.get("/logout", publicController.postLogout);
router.post("/login", publicController.postLogin);
router.post("/signup", publicController.postSignup);
router.post(
  "/new-password",
  body(
    "password",
    "Your password should be alphanumeric and at least 5 characters long."
  )
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric(),
  publicController.postNewPassword
);
router.post(
  "/reset",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid e-mail.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        //every then block returns a promise;
        if (!userDoc) {
          //reject promise;
          return Promise.reject("User doesn't exist!");
        }
        //promise fulfilled with nothing, treated as true;
      });
    }),
  publicController.postReset
);

module.exports = router;
