const helmet = require('helmet');
const validator = require('validator');
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session"); // REQUIRED for RBAC
const winston = require('winston');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'security.log' })
  ]
});

var app = express();

// --- MIDDLEWARE CONFIGURATION ---
app.use(session({
  secret: "security-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST'] }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Fail2Ban will monitor this IP."
});

// --- RBAC MIDDLEWARE ---
const isAdmin = (req, res, next) => {
    if (req.session && req.session.role === 'admin') {
        next();
    } else {
        logger.warn(`ACCESS DENIED: Unauthorized attempt from IP: ${req.ip}`);
        res.status(403).send("<h1>403 Forbidden</h1><p>Access Denied: Admins Only.</p>");
    }
};

// --- ROUTES ---

// 1. Login Route
app.post("/login", loginLimiter, (req, res) => {
  var { username, password } = req.body;

  if (username && !validator.isAlphanumeric(username)) {
      logger.warn(`SECURITY ALERT: Malicious input: ${username}`);
      return res.status(400).send("Invalid Username Format");
  }

  if (username === "admin" && password === "admin") {
    req.session.role = 'admin'; // Setting the role for RBAC
    res.send("Login successful. Admin access granted.");
  } else {
    logger.info(`FAILED login attempt for user: ${username}`);
    res.status(401).send("Wrong credentials");
  }
});

// 2. Admin Route (MOVED OUTSIDE OF LOGIN)
app.get('/admin/security-logs', isAdmin, (req, res) => {
    res.send("Welcome, Admin. You are viewing the secure security logs.");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Secure API running on port ${PORT}`));
