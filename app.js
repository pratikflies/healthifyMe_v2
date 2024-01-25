const path = require("path");
const express = require("express");
// const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // or '*' for all origins
}));

// importing routes
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const MONGODB_URI =
  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.8l9b2qc.mongodb.net/healthifyMe`;

const fileStorage = multer.diskStorage({
  // path
  destination: (_req, _file, cb) => {
    cb(null, "images");
  },
  // filename
  filename: (_req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (_req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  )
    cb(null, true);
  else cb(null, false);
};

// setting views so that my express app knows where and what to look for;
app.set("view engine", "ejs");
app.set("views", "views");

//body parsers for parsing incoming requests;
app.use(express.urlencoded({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

// UNPROTECTED ROUTES
app.use(authRoutes);

// PROTECTED ROUTES
app.use("/admin", adminRoutes);

//connecting to database;
mongoose
  .connect(MONGODB_URI)
  .then((_result) => {
    app.listen(3001);
    console.log("Server listening on http://localhost:3001. Connected to database. 🚀");
  })
  .catch((err) => {
    console.error("Failed to connect to database 💔: ", err);
  });
