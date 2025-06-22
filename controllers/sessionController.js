<<<<<<< HEAD
const bcrypt = require("bcryptjs");
=======
>>>>>>> origin/lesson12
const User = require("../models/User");
const parseVErr = require("../util/parseValidationErrs");

const registerShow = (req, res) => {
  res.render("register");
};
<<<<<<< HEAD
//handle registration form submission
=======

>>>>>>> origin/lesson12
const registerDo = async (req, res, next) => {
  if (req.body.password != req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register", {  errors: flash("error") });
  }
  try {
    await User.create(req.body);
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }
    return res.render("register", {  errors: flash("error") });
  }
  res.redirect("/");
<<<<<<< HEAD
  //show logon form
};const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon", {
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};
// Handle login (logon) form submission
const logonDo = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/sessions/logon");
    }

    // Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/sessions/logon");
    }

    // Set user info in session
    req.session.userId = user._id;

    // Optionally, set user name or email in locals for views
    req.session.userName = user.name;

    // Redirect to home or dashboard
    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

// Handle user logout

=======
};
>>>>>>> origin/lesson12

const logoff = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

<<<<<<< HEAD

=======
const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon", {
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};
>>>>>>> origin/lesson12

module.exports = {
  registerShow,
  registerDo,
<<<<<<< HEAD
  logonShow,
  logonDo,
  logoff,
  
=======
  logoff,
  logonShow,
>>>>>>> origin/lesson12
};