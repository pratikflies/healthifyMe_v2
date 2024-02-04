const express = require("express");
const publicController = require("../controller/public");

const router = express.Router();

router.post("/add-workout", publicController.addWorkout);
router.post("/login", publicController.postLogin);
router.post("/signup", publicController.postSignup);
// router.get("/reset/:token", publicController.getNewPassword);
// router.post("/new-password", publicController.postNewPassword);
// router.post("/reset", publicController.postReset);

module.exports = router;
