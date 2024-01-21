const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

//directly using nodemailer to send mails;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pratik16082001@gmail.com",
    //password generated via google's two-step authentication;
    pass: "yefdcajaopkerldp",
  },
});

exports.getHomepage = (req, res, next) => {
  return res.render("home/homepage");
};

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) message = message[0];
  else message = null;
  return res.render("authentication/loginForm", {
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) message = message[0];
  else message = null;
  return res.render("authentication/signupForm", {
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("authentication/loginForm", {
      errorMessage: errors.array()[0].msg,
      //this array has all the errors logged
      oldInput: {
        email: email,
        password: password,
      },
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              //user-details form has been filled;
              if (user.fullname) res.redirect("/admin/dashboard");
              //user-details form has not been filled
              else res.redirect("/admin/user-details");
            });
          }
          req.flash("error", "Invalid email or password.");
          return res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("authentication/signupForm", {
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
    });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        workouts: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "pratik16082001@gmail.com",
        subject: "Signup succeeded!",
        html: "<h1>You have successfully signed up with HealthifyMe. Welcome Onboard!</h1>",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  //destroying session on logout;
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) message = message[0];
  else message = null;
  return res.render("authentication/resetForm", {
    errorMessage: message,
    oldInput: {
      email: "",
    },
  });
};

exports.postReset = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("authentication/resetForm", {
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: req.body.email,
      },
    });
  }
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user
          .save()
          .then((result) => {
            res.redirect("/login");
            transporter.sendMail({
              to: req.body.email,
              from: "pratik16082001@gmail.com",
              subject: "Password Reset!",
              html: `
            <p>You requested for a password reset on your HealthifyMe account.</p>
            <p>Click this <a href="http://localhost:4000/reset/${token}">link</a> to set a new password.</p>`,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now(),
      //gt->greater than
    },
  })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) message = message[0];
      else message = null;
      res.render("authentication/newpasswordForm", {
        passwordToken: token,
        userId: user._id.toString(),
        errorMessage: message,
        oldInput: {
          password: "",
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("authentication/newpasswordForm", {
      errorMessage: errors.array()[0].msg,
      passwordToken: passwordToken,
      userId: userId,
      oldInput: {
        password: newPassword,
      },
    });
  }

  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getContact = (req, res, next) => {
  return res.render("home/contactUs.ejs");
};
