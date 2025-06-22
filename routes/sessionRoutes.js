const express = require("express");
<<<<<<< HEAD
 const passport = require("passport");
const User = require("../models/User");

const router = express.Router();
//show registration page
router.get("/register", (req, res) => {
  
  res.render("register", { error: [], info: [] }); // make sure register.ejs exists
});

//handle registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password }); // password will be hashed by Mongoose pre-save hook
     // Auto-login after registration
    req.login(user, (err) => {
      if (err) {
        console.error("Auto-login error:", err);
    req.flash("error", "Registration successful. Please log in.");
     return res.redirect("/sessions/logon");
      } 
      req.flash("info", `Welcome, ${user.name}!`);
      res.redirect("/secretWord");
    });
    
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      req.flash("error", "Email already exists.");
    } else{
    req.flash("error", "Error creating user: " + err.message);
    }
    res.redirect("/sessions/register");
  }
});



// GET: show login page
router.get("/logon", (req, res) => {
  res.render("logon");
});

// POST: Handle login with passport
router.post(
  "/logon", 
(req, res, next) => {
  req.flash("email", req.body.email); // store email attempt
  next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sessions/logon",
    failureFlash: true,
  }) 
);




// POST: Handle logout
router.post("/logoff", (req, res) => {
  
  req.logout(() => {
    req.flash("info", "You have been logged off.");
    res.redirect("/");
  });
});

module.exports = router;
=======
// const passport = require("passport");
const router = express.Router();

const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

router.route("/register").get(registerShow).post(registerDo);
router
  .route("/logon")
  .get(logonShow)
  .post(
    // passport.authenticate("local", {
    //   successRedirect: "/",
    //   failureRedirect: "/sessions/logon",
    //   failureFlash: true,
    // })
    (req, res) => {
      res.send("Not yet implemented.");
    }
  );
router.route("/logoff").post(logoff);

module.exports = router;
>>>>>>> origin/lesson12
