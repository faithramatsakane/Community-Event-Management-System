const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Judicious@41",
  database: "community_app"
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }

  console.log("Connected to Community Event App Database");
});

// Home Route
app.get("/", (req, res) => {
  res.send("Community Event Management System Backend Running");
});


// ===========================
// USER ROUTES
// ===========================

// Register User
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";

  db.query(sql, [name, email], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId
    });
  });
});

// Get All Users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});


// ===========================
// EVENT ROUTES
// ===========================

// Create Event
app.post("/events", (req, res) => {
  const { title, category, event_date } = req.body;

  const sql = "INSERT INTO events (title, category, event_date) VALUES (?, ?, ?)";

  db.query(sql, [title, category, event_date], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      message: "Event created successfully",
      eventId: result.insertId
    });
  });
});

// Get All Events
app.get("/events", (req, res) => {
  db.query("SELECT * FROM events", (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});


// ===========================
// BOOKING ROUTES
// ===========================

// Create Booking
app.post("/bookings", (req, res) => {
  const { user_id, event_id } = req.body;

  const sql = "INSERT INTO bookings (user_id, event_id) VALUES (?, ?)";

  db.query(sql, [user_id, event_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      message: "Booking successful",
      bookingId: result.insertId
    });
  });
});

// Get All Bookings
app.get("/bookings", (req, res) => {
  db.query("SELECT * FROM bookings", (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});


// ===========================
// ANALYTICS ROUTES
// ===========================

// Event Analytics
app.get("/analytics/events", (req, res) => {
  db.query("SELECT * FROM vw_event_bookings", (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});

// User Analytics
app.get("/analytics/users", (req, res) => {
  db.query("SELECT * FROM vw_user_activity", (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});

// Category Analytics
app.get("/analytics/categories", (req, res) => {
  db.query("SELECT * FROM vw_category_performance", (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});


// ===========================
// DASHBOARD SUMMARY
// ===========================

app.get("/dashboard", (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM events) AS total_events,
      (SELECT COUNT(*) FROM bookings) AS total_bookings
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results[0]);
  });
});


// ===========================
// SERVER
// ===========================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Community Event Management System running on http://localhost:${PORT}`);
});