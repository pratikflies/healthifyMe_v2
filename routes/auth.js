const path = require("path");
const express = require("express");
//destructuring
const { check, body } = require("express-validator");
const authController = require("../controller/auth");
const error = require("../controller/error");
const User = require("../models/user");

const router = express.Router();

router.get("/", authController.getHomepage);
router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);
router.get("/contact-us", authController.getContact);
router.get("/logout", authController.postLogout);
router.post("/logout", authController.postLogout);
router.post(
  "/login",
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
  body(
    "password",
    "Your password should be alphanumeric and at least 5 characters long."
  )
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric(),
  authController.postLogin
);
router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid e-mail.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        //every then block returns a promise;
        if (userDoc) {
          //reject promise;
          return Promise.reject("User already exists.");
        }
        //promise fulfilled with nothing, treated as true;
      });
    }),
  body(
    "password",
    "Your password should be alphanumeric and at least 5 characters long."
  )
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      //custom comparator, matches value of password and confirm Password;
      if (value != req.body.password) {
        throw new Error("Password and Confirm Password do NOT match!");
      }
      return true;
    }),
  authController.postSignup
);
router.post(
  "/new-password",
  body(
    "password",
    "Your password should be alphanumeric and at least 5 characters long."
  )
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric(),
  authController.postNewPassword
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
  authController.postReset
);

//catches pages that are not found, has to be at last;
router.use("*", error.getError);

module.exports = router;
