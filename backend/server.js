const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Judicious@41",   // replace with your actual MySQL password
  database: "community_app"    // or "community_EventApp" if you prefer
});

connection.connect(err => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err);
    return;
  }
  console.log("✅ Connected to MySQL successfully!");
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("CEMS Backend is running 🚀");
});

// ✅ Signup route
app.post("/signup", (req, res) => {
  const { name, email } = req.body;
  connection.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.send("User added successfully!");
    }
  );
});

// ✅ Event creation route
app.post("/event", (req, res) => {
  const { title, category, event_date } = req.body;
  connection.query(
    "INSERT INTO events (title, category, event_date) VALUES (?, ?, ?)",
    [title, category, event_date],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.send("Event created successfully!");
    }
  );
});

// ✅ Booking route
app.post("/book", (req, res) => {
  const { user_id, event_id } = req.body;
  connection.query(
    "INSERT INTO bookings (user_id, event_id) VALUES (?, ?)",
    [user_id, event_id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.send("Booking added successfully!");
    }
  );
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
