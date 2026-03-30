const helmet = require('helmet');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var debug = require("debug")("app.js");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var aboutRouter = require("./routes/about");
const winston = require('winston');

// Create the logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'security.log' })
  ]
});

logger.info('Security Logging System Started');

var app = express();

// WEEK 2 FIX: Security Headers
app.use(helmet());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// include bootstrap css
app.use(
  "/css",
  express.static(path.join(__dirname, "public", "3rdparty", "bootstrap", "dist", "css"))
);

// set up the session
app.use(
  session({
    secret: "app",
    name: "app",
    resave: true,
    saveUninitialized: true
  })
);

var logout = function(req, res, next) {
  debug("logout()");
  req.session.loggedIn = false;
  res.redirect("/");
};

var login = function(req, res, next) {
  var { username, password } = req.body;

  // WEEK 3: Validation + Security Logging
  if (username && !validator.isAlphanumeric(username)) {
      logger.warn(`SECURITY ALERT: Invalid login attempt from username: ${username}`);
      return res.render("login", { title: "Login Here", error: "Invalid Username Format" });
  }

  // Actual Login Logic
  if (req.body.username && checkUser(username, password)) {
    debug("login()", username, password);
    req.session.loggedIn = true;
    res.redirect("/");
  } else {
    debug("login()", "Wrong credentials");
    res.render("login", { title: "Login Here", error: "Wrong credentials" });
  }
}; // This closing brace was missing in your text!

var checkUser = function(username, password) {
  debug("checkUser()", username, password);
  const mockHashedPass = '$2b$10$H8YnS79vO.S7L7L7L7L7L7L7L7L7L7L7L7L7L7L7L7L7L7L7L7L7';
  if (username === "admin" && password === "admin") return true;
  return false;
};

var checkLoggedIn = function(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.render("login", { title: "Login Here" });
  }
};

// Routes
app.use("/users", checkLoggedIn, usersRouter);
app.use("/logout", logout, indexRouter);
app.use("/login", login, indexRouter);
app.use("/about", aboutRouter);
app.use("/", checkLoggedIn, indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  debug("app.use", req.path, 404);
  next(createError(404));
});

// WEEK 2 FIX: Secure Error Handler
app.use(function(err, req, res, next) {
  res.locals.message = "An internal error occurred."; 
  res.locals.error = {}; 
  debug("app.use", "ERROR", err.message);
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
