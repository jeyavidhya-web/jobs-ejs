
require('dotenv').config(); 

const express = require('express');


const session = require("express-session");


const MongoStore = require('connect-mongo');
const MongoStore = require("connect-mongo");
const passport = require("passport");

const flash = require("connect-flash");
const passportInit = require("./passport/passportInit");
 


const connectDB = require('./db/connect');




const path = require("path");
const storeLocals = require('./middleware/storeLocals');
const auth = require("./middleware/auth");


 // adjust path as needed


const app = express();

passportInit(passport); //  pass the passport object here

// middleware setup
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));

app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

// Create the session store outside the middleware config
const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions'
});
//session setup
app.use(session({
  secret: process.env.SESSION_SECRET, // must not be undefined
  resave: false,
  saveUninitialized: false,
  store:  MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),              // <-- pass the store here!
  cookie: {
    secure: false,           // set true if HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));



  

  // Flash must come after session
app.use(flash());
    //  4. Initialize passport

app.use(passport.initialize());
app.use(passport.session());

// then your storeLocals middleware
app.use(require('./middleware/storeLocals'));

//  6. Add your sessions routes here:
app.use("/sessions", require("./routes/sessionRoutes"));
app.use("/", require("./routes/secretRoutes"));
const secretWordRouter = require("./routes/secretWord");
app.use("/secretWord", auth, secretWordRouter);

//home route
app.get("/", (req, res) => {
  res.render("index"); // this should match views/index.ejs
});
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Something went wrong!<br><pre>${err.stack}</pre>`);
});


// Check if env vars are loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);


//secret route
app.get("/secretWord", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to see the secret word.");
    return res.redirect("/sessions/logon");
  }

  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }
  
   res.render("secretWord", {
    secretWord: req.session.secretWord,
     error: req.flash("error"),       // pass error flash messages
    info: req.flash("info"),  // pass info flash messages
  });
});
  

app.post("/secretWord", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in.");
    return res.redirect("/sessions/logon");
  }

 
   const { secretWord } = req.body;
  if (secretWord && secretWord.trim()) {
    req.session.secretWord = secretWord.trim();
    req.flash("info", "Secret word updated successfully!");
  } else {
    req.flash("error", "Secret word cannot be empty.");
  }
  res.redirect("/secretWord");
});






// Mongo store error logging
store.on("error", function (error) {
  console.log(error);
});










// 5. Connect to MongoDB before starting the server

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } 
  catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  
};
}
startServer();

