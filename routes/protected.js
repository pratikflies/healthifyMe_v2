const path = require("path");
const express = require("express");
const { check, body } = require("express-validator");
const protectedController = require("../controller/protected");
const isAuth = require("../middleware/authMiddleware");
const error = require("../controller/error");

const router = express.Router();

//all these routes start with /admin, for example -> /admin/healthifyMe;
//as you need to be authorised to access them, hence isAuth;
router.get("/profile", isAuth, protectedController.getUserProfile);
router.post("/profile", isAuth, protectedController.postUserProfile);
router.get("/dashboard", isAuth, protectedController.getDashboard);
router.post("/fetch", isAuth, protectedController.fetchWorkout);
router.post("/save", isAuth, protectedController.saveWorkout);
router.post("/delete", isAuth, protectedController.deleteWorkout);
// router.delete("/reset", isAuth, protectedController.resetUser);
router.post("/delete-profile", isAuth, protectedController.deleteProfile);
router.post("/logout", isAuth, protectedController.postLogout);
// router.get("/gallery", isAuth, protectedController.getGallery);
router.post(
  "/add-image",
  isAuth,
  body("story").isLength({ min: 5, max: 50 }),
  protectedController.addImage
);

// catches pages that are not found, has to be at last;
router.use("*", error.getError);

module.exports = router;
