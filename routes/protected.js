const express = require("express");
const protectedController = require("../controller/protected");
const isAuth = require("../middleware/authMiddleware");

const router = express.Router();

// as you need to be authorised to access them, hence isAuth 
router.get("/profile", isAuth, protectedController.getUserProfile);
router.post("/profile", isAuth, protectedController.postUserProfile);
router.get("/dashboard", isAuth, protectedController.getDashboard);
router.post("/fetch", isAuth, protectedController.fetchWorkout);
router.post("/save", isAuth, protectedController.saveWorkout);
router.post("/delete", isAuth, protectedController.deleteWorkout);
router.post("/delete-profile", isAuth, protectedController.deleteProfile);
router.post("/logout", isAuth, protectedController.postLogout);
// router.delete("/reset", isAuth, protectedController.resetUser);
// router.get("/gallery", isAuth, protectedController.getGallery);
// router.post("/add-image", isAuth, protectedController.addImage);

module.exports = router;
