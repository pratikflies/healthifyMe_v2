const path = require("path");
const express = require("express");
const { check, body } = require("express-validator");
const adminController = require("../controller/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//all these routes start with /admin, for example -> /admin/healthifyMe;
//as you need to be authorised to access them, hence isAuth;
router.get("/user-details", isAuth, adminController.getUserDetails);
router.post("/user-details", isAuth, adminController.postUserDetails);
router.get("/dashboard", isAuth, adminController.getDashboard);
router.get("/healthifyMe", isAuth, adminController.getApp);
router.post("/save", isAuth, adminController.saveWorkout);
router.post("/delete", isAuth, adminController.deleteWorkout);
router.delete("/reset", isAuth, adminController.resetUser);
router.post("/delete-profile", isAuth, adminController.deleteProfile);
router.get("/gallery", isAuth, adminController.getGallery);
router.post(
  "/add-image",
  isAuth,
  body("story").isLength({ min: 5, max: 50 }),
  adminController.addImage
);

module.exports = router;
