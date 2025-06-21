const bcrypt = require("bcryptjs");
const User = require("../models/User");
const parseVErr = require("../util/parseValidationErrs");

const registerShow = (req, res) => {
  res.render("register");
};
//handle registration form submission
const registerDo = async (req, res, next) => {
  if (req.body.password != req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register", {  errors: req.flash("error") });
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
    return res.render("register", {  errors: req.flash("error") });
  }
  res.redirect("/");
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





   
const logoff = (req, res, next) => {
   console.log("LOGOFF ROUTE HIT");
  if (typeof req.logout === 'function') {
    // Passport.js logout with callback error handling
    req.logout(function(err) {
      if (err) return next(err);
      req.flash('info', 'You have been logged out.');
      res.redirect('/sessions/logon');

    });
  } else if (req.session) {
    // Not using Passport, just destroy session
    req.session.destroy(err => {
      if (err) return next(err);
      req.flash('info', 'You have been logged out.');
      res.redirect('/sessions/logon');
    });
  } else {
    // No session and no logout function - just redirect
    res.redirect('/sessions/logoff');
  }
};


const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon", {
    errors: req.flash("error"),
    info: req.flash("info"),
    csrfToken: req.csrfToken(), 
  });
};
const logon = async (req, res, next) => {
  try{
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/sessions/logon");
    }

    
    
    

    // Set session user ID to log in the user
    req.session.userId = user._id;
 res.redirect("/");
  } catch (err) {
    next(err);
  }

};
module.exports = {
  registerShow,
  registerDo,
  logonShow,
  logon,
  logoff
  
 

}
