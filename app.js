
require('dotenv').config(); 
const express = require('express');
const session = require("express-session");


const MongoStore = require('connect-mongo');
const flash = require("connect-flash");


const path = require("path");
const connectDB = require('./db/connect')

 // adjust path as needed


const app = express();
app.use(flash());
// middleware setup
app.use(express.urlencoded({ extended: true }));
// Create the session store outside the middleware config
const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions'
});
app.use(session({
  secret: process.env.SESSION_SECRET, // must not be undefined
  resave: false,
  saveUninitialized: false,
  
  store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // or MONGO_URI
      collectionName: "sessions",
    }),
  cookie: {
    secure: false, // set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));
// Flash middleware (must come after session)
app.use(flash());

// Set EJS as the view engine


app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
// Custom middleware to expose flash messages to views
app.use(require("./middleware/storeLocals"));

// Check if env vars are loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);
//home route
app.get('/', (req, res) => {
  res.send('Welcome to the home page!');
});
app.get("/secretWord", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }
   res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  res.render("secretWord", { secretWord: req.session.secretWord });
});
   
  app.use(require("connect-flash")());
  app.use(require("./middleware/storeLocals"));
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));
//body parser middleware
app.post("/secretWord", (req, res) => {
   if (req.body.secretWord.toUpperCase()[0] == "P") {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that start with p.");
  } else {
    req.session.secretWord = req.body.secretWord;
    req.flash("info", "The secret word was changed.");
  }
  res.redirect("/secretWord");
});

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Something went wrong!<br><pre>${err.stack}</pre>`);
});


store.on("error", function (error) {
  console.log(error);
});

// Session setup
const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};
if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParms.cookie.secure = true;
}

















  







// secret word handling route
//let secretWord = "syzygy";







// 5. Connect to MongoDB before starting the server
connectDB(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');


    

    const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
<<<<<<< HEAD
  } 
  catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  
};
}
startServer();

=======
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

startServer();

})
  
>>>>>>> origin/lesson12
