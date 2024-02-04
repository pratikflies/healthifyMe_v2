const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const TokenLog = require("../models/tokenLog");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
const { WorkoutFactory } = require("../data-engine/workoutFactory");

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^,;:\s@"]+\.)+[^,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

exports.addWorkout = (req, res) => {
  const {type, coords, distance, duration, cadence, elevationGain, strokes, dateObject} = req.body;

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

    res.status(201).json(workout);
  }
  catch (error) {
    console.error(`Error adding workout of type: ${type}`, error);
    res.status(500).json({ message: error.message });
  }
};

// // directly using nodemailer to send mails
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "pratik16082001@gmail.com",
//     //password generated via google's two-step authentication;
//     pass: "yefdcajaopkerldp",
//   },
// });

const createAuthToken = function (user) {
  const token = jwt.sign(
    { email: user.email, id: user.id },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "7d",
    },
  );
  return token;
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials: email!" });
    }

    // validate password & verify email
    const isPasswordValid = await bcrypt.compare(password, user.password);
    const isVerified = user.emailVerified;
    if (!isPasswordValid || !isVerified) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    // create authentication token
    const token = createAuthToken(user);

    // store token if it doesn't exist
    const activeToken = await TokenLog.findOne({ token });
    if (!activeToken) {
      await TokenLog.create({
        userId: user._id,
        token: token,
        type: "jwt_token",
        status: "active",
      });
    }

    // set user's lastLogin time
    await User.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );
    
    return res.status(200).json({ 
      token,
      message: "Logged In Successfully." 
    });
  } catch (error) {
    console.error(`Error during login for email: ${email}`, error);
    return res.status(500).json({ message: error.message });
  }
};

exports.postSignup = async (req, res) => {
  const { email, password } = req.body;

   // basic email and password validation
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists!");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const { _id: userId } = await User.create({
      email,
      password: hashedPassword,
      emailVerified: process.env.ENV === "dev" ? true : false,
    });

    const token = crypto.randomBytes(20).toString("hex");
    await TokenLog.create({
      userId,
      token,
      type: "one_time_activation",
      status: "active",
    });

    // send activation e-mail
    const activationUrl = `${process.env.LOCAL_URL}/activate-account/${email}|${token}`;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(`Error during signup for email: ${email}`, error);
    return res.status(500).json({ message: error.message });
  }
};

// exports.getReset = (req, res, next) => {
//   let message = req.flash("error");
//   if (message.length > 0) message = message[0];
//   else message = null;
//   return res.render("authentication/resetForm", {
//     errorMessage: message,
//     oldInput: {
//       email: "",
//     },
//   });
// };

// exports.postReset = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log(errors);
//     return res.status(422).render("authentication/resetForm", {
//       errorMessage: errors.array()[0].msg,
//       oldInput: {
//         email: req.body.email,
//       },
//     });
//   }
//   crypto.randomBytes(32, (err, buffer) => {
//     if (err) {
//       console.log(err);
//       return res.redirect("/reset");
//     }
//     const token = buffer.toString("hex");
//     User.findOne({ email: req.body.email })
//       .then((user) => {
//         if (!user) {
//           req.flash("error", "No account with that email found.");
//           return res.redirect("/reset");
//         }
//         user.resetToken = token;
//         user.resetTokenExpiration = Date.now() + 3600000;
//         return user
//           .save()
//           .then((result) => {
//             res.redirect("/login");
//             transporter.sendMail({
//               to: req.body.email,
//               from: "pratik16082001@gmail.com",
//               subject: "Password Reset!",
//               html: `
//             <p>You requested for a password reset on your HealthifyMe account.</p>
//             <p>Click this <a href="http://localhost:4000/reset/${token}">link</a> to set a new password.</p>`,
//             });
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   });
// };

// exports.getNewPassword = (req, res, next) => {
//   const token = req.params.token;
//   User.findOne({
//     resetToken: token,
//     resetTokenExpiration: {
//       $gt: Date.now(),
//       //gt->greater than
//     },
//   })
//     .then((user) => {
//       let message = req.flash("error");
//       if (message.length > 0) message = message[0];
//       else message = null;
//       res.render("authentication/newpasswordForm", {
//         passwordToken: token,
//         userId: user._id.toString(),
//         errorMessage: message,
//         oldInput: {
//           password: "",
//         },
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.postNewPassword = (req, res, next) => {
//   const newPassword = req.body.password;
//   const userId = req.body.userId;
//   const passwordToken = req.body.passwordToken;

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log(errors);
//     return res.status(422).render("authentication/newpasswordForm", {
//       errorMessage: errors.array()[0].msg,
//       passwordToken: passwordToken,
//       userId: userId,
//       oldInput: {
//         password: newPassword,
//       },
//     });
//   }

//   let resetUser;
//   User.findOne({
//     resetToken: passwordToken,
//     resetTokenExpiration: { $gt: Date.now() },
//     _id: userId,
//   })
//     .then((user) => {
//       resetUser = user;
//       return bcrypt.hash(newPassword, 12);
//     })
//     .then((hashedPassword) => {
//       resetUser.password = hashedPassword;
//       resetUser.resetToken = undefined;
//       resetUser.resetTokenExpiration = undefined;
//       return resetUser.save();
//     })
//     .then((result) => {
//       res.redirect("/login");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
