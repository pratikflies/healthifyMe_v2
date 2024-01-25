const jwt = require("jsonwebtoken");
const TokenLog = require("../models/tokenLog");
require("dotenv").config();

module.exports = async (req, res, next) => {
  let authToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    authToken = req.headers.authorization.split(" ")[1];
  }
  if (!authToken) {
    console.log("Please Login. Authorization Failed!");
    return res.status(401).json({ message: "Unauthorized access. Please login to continue." });
  } 
  else {
    try {
      const existingAuth = await TokenLog.findOne({ token: authToken });
      if (existingAuth?.status === "active") {
        const credentials = jwt.verify(authToken, process.env.ACCESS_SECRET);
        req.userId = credentials.id;
        return next();
      } else {
        console.log("Please Login. Authorization Failed!");
        return res.status(401).json({ message: "Unauthorized access. Please login to continue." });
      }
    } catch (error) {
      console.error("An error occured while fetching token: ", error);
      return res.status(500).json({ message: error.message });
    }
  }
};
