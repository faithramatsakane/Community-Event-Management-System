const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Judicious@41",
  database: "community_app"
});

// ===========================
// AUTHENTICATION ROUTES
// ===========================

// Register User
app.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Basic validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, password, role], (err, result) => {
    if (err) {
      console.error("SQL Error:", err); // Check your terminal for this!
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    res.status(201).json({ message: "User registered successfully", userId: result.insertId });
  });
});


// Login Route
app.post("/login", (req, res) => {
  const { email, password, selectedRole } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];

    // Password Check
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Role-Based Validation Logic
    if (selectedRole === 'admin') {
      if (email.endsWith('@communityevent') && user.role === 'admin') {
        return res.json({ redirect: '/admin-dashboard', role: 'admin' });
      } else {
        return res.status(403).json({ message: "Unauthorized: Invalid Admin access." });
      }
    }

    if (selectedRole === 'event_organizer' && user.role === 'event_organizer') {
      return res.json({ redirect: '/organiser-dashboard', role: 'event_organizer' });
    }

    return res.json({ redirect: '/user-dashboard', role: 'user' });
  });
});

// ===========================
// OTHER ROUTES (Events, Bookings, Analytics)
// ===========================
// ... [Keep your existing Event, Booking, and Analytics routes here] ...

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});