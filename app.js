
require('dotenv').config(); 

const express = require('express');
const sessionRoutes = require('./routes/sessionRoutes');
const session = require("express-session");


const MongoStore = require('connect-mongo');
const passport = require('passport');
const passportInit = require('./passport/passportInit');
passportInit(passport); 
const LocalStrategy = require('passport-local').Strategy;
const flash = require("connect-flash");
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require("path");
const connectDB = require('./db/connect')
const User = require('./models/User'); // or your user data model


 // adjust path as needed


const app = express();
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions'
});



app.use(session({
  secret: process.env.SESSION_SECRET, // must not be undefined
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false,        // set true with HTTPS
    sameSite: 'strict',   // helps mitigate CSRF
    maxAge: 1000 * 60 * 60 * 24
  },
}));
// Initialize Passport
 
app.use(passport.initialize());
app.use(passport.session()); 
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Flash middleware (must come after session)
app.use(flash());
// Define csrfProtection here
const csrfProtection = csrf({ cookie: false });

// then your storeLocals middleware
app.use(require('./middleware/storeLocals'));

 // Custom middleware to expose flash messages to views
app.use(require("./middleware/storeLocals"));



passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id, (err, user) => done(err, user))
);
//Routes

app.get("/",csrfProtection,  (req, res) => {
  res.render("index",{ errors: req.flash('error') || [] , info: req.flash('info') || [],csrfToken: req.csrfToken(),});
});
// Login Form});
app.get('/sessions/logon',  csrfProtection,  (req, res) => {
  res.render('logon', {  csrfToken: req.csrfToken(),errors: req.flash('error'),info: req.flash('info') });
});

// Login Handler
app.post('/sessions/logon', csrfProtection,
  passport.authenticate('local', {
    successRedirect: '/secretWord',
    failureRedirect: '/sessions/logon',
    failureFlash: true
  })
);








// CSRF-protected secret word routes

app.get("/secretWord", csrfProtection, (req, res) => {
  
  if (!req.isAuthenticated()) return res.redirect('logon');

  if (!req.session.secretWord) 
    req.session.secretWord = "syzygy";
res.render("secretWord", {
  secretWord: req.session.secretWord,
  csrfToken: req.csrfToken(),
  info: req.flash('info'),
  errors: req.flash('error')
});
});
app.post('/secretWord', csrfProtection, (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('logon');
  const word = req.body.secretWord || '';
  
  if (word.toUpperCase().startsWith('P')) {
    req.flash('error', "That word won't work! You can't use words that start with 'P'.");
  } else {
    req.session.secretWord = word;
    req.flash('info', 'The secret word was changed.');
  }
  res.redirect('/secretWord');
});

   
// Your session routes


app.use("/sessions", sessionRoutes);

   app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});



// CSRF and general error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.warn('⚠ CSRF token mismatch');
    return res.status(403).send('Invalid CSRF token — request denied.');
  }

  console.error(err.stack);
  res.status(500).send(`Something went wrong!<br><pre>${err.stack}</pre>`);
});




  //  Connect to MongoDB before starting the server
connectDB(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  
  
  const port =3000
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
.catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  })
