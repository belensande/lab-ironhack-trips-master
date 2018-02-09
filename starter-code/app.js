const express        = require("express");
const session        = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
const mongoose       = require("mongoose");
const passport		 = require("passport");
const flash			 = require("connect-flash");
const FbStrategy	 = require('passport-facebook').Strategy;
const LocalStrategy  = require("passport-local").Strategy;
const User			 = require("./models/user");
const app            = express();

// Controllers
const authController = require("./routes/authController");
const indexController = require("./routes/indexController");
const tripsController = require("./routes/tripsController");
const profilesController = require("./routes/profilesController");

// Mongoose configuration
mongoose.connect("mongodb://localhost:27017/ironhack-trips");

// Middlewares configuration
app.use(logger("dev"));

// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main-layout");
app.use(express.static(path.join(__dirname, "public")));

// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Authentication
app.use(session({
	secret: "ironhack trips",
	cookie: { maxAge: 300000 },
	resave: true,
	saveUninitialized: true
}));

require('./passport')(app);
app.use(flash());

app.use((req, res, next) => {
	if (req.isAuthenticated()) {
		res.locals.currentUser = req.user;
	}
	res.locals.route = req.originalUrl;
	next();
});

// Routes
app.use("/", indexController);
app.use("/auth", authController);
app.use("/my-trips", tripsController);
app.use("/profiles", profilesController);



// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
