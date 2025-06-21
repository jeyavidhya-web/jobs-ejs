

const express = require('express');
const router = express.Router();
//show registration page
router.get("/register", (req, res) => {
  
  res.render("register", { error: [], info: [] }); // make sure register.ejs exists
});

// Show the logon form
router.get('/logon', (req, res) => {
  res.render('logon', { errors: [], info: [] });
});

// Handle logon POST
router.post('/logon', (req, res) => {
  const { email, password } = req.body;

  // Example logic - replace with real validation
  if (email === 'test@example.com' && password === 'password') {
    req.session.user = { email };
    res.redirect('/secretWord');
  } else {
    res.render('logon', {
      errors: ['Invalid email or password'],
      info: [],
    });
  }
});

// Show the register form
router.get('/register', (req, res) => {
  res.render('register', { errors: [], info: [] });
});

// Handle register POST
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Example validation logic
  if (!email || !password) {
    return res.render('register', {
      errors: ['Email and password are required'],
      info: [],
    });
  }

  // Simulate saving user
  req.session.user = { email };
  res.redirect('/secretWord');
});

//  Handle logoff (GET /sessions/logoff)
router.get('/logoff', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }
    res.clearCookie('connect.sid'); // Default session cookie name
    res.redirect('/loggedOut');
  });
});

module.exports = router;

