const express = require("express");

const passport = require("passport");
const passportInit = require("./passport/passportInit");

const app = express();

require("dotenv").config(); // to load the .env file into the process.env object
const session = require("express-session");
const jobsRouter = require('./routes/jobs');

const MongoDBStore = require("connect-mongodb-session")(session);
const url = process.env.MONGODB_URI;

require("express-async-errors");

const store = new MongoDBStore({
  // may throw an error, which won't be caught
  uri: url,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}



app.set("view engine", "ejs");



const csrf = require('host-csrf')
const cookieParser = require("cookie-parser")
app.use(cookieParser("notverysecret"));
app.use(require("body-parser").urlencoded({ extended: true }));

app.use(session(sessionParms));

//app.use(express.urlencoded({ extended: false }));
let csrf_development_mode = true;
if (app.get("env") === "production") {
  csrf_development_mode = false;
  app.set("trust proxy", 1);
}
const csrf_options = {
  protected_operations: ["PATCH", "POST", "DELETE"],
  protected_content_types: ["application/json"],
  development_mode: csrf_development_mode,
};
const csrf_middleware = csrf(csrf_options);

app.use(csrf_middleware);

// Expose the CSRF token to all views
app.use((req, res, next) => {
  if (req.csrfToken) {
    const token = req.csrfToken();
    console.log(token);
    res.locals._csrf = token; // for EJS
    res.cookie('XSRF-TOKEN', token); // set as a cookie
  }
  next();
});




passportInit();
app.use(passport.initialize());
app.use(passport.session());
app.use(require("connect-flash")());

app.use(require("./middleware/storeLocals"));
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));

// let secretWord = "syzygy"; <-- comment this out or remove this line
/*app.get("/secretWord", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  res.render("secretWord", { secretWord: req.session.secretWord });
});*/
/*app.post("/secretWord", (req, res) => {
  if (req.body.secretWord.toUpperCase()[0] == "P") {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that start with p.");
  } else {
    req.session.secretWord = req.body.secretWord;
    req.flash("info", "The secret word was changed.");
  }
  res.redirect("/secretWord");
});*/

const secretWordRouter = require("./routes/secretWord");
const auth = require("./middleware/auth");
app.use("/secretWord", auth, secretWordRouter);

app.use("/jobs", auth, jobsRouter)

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await require("./db/connect")(process.env.MONGODB_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
