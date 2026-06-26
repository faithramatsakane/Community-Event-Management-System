const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const sequelize = require("./config/database");
const User = require("./models/User");
const User = require("./models/Events");
const User = require("./models/admin");
const User = require("./models/bookings");
const User = require("./models/attendance");
const User = require("./models/dashboard_summary");
const User = require("./models/registration");
const User = require("./models/organisers");
const User = require("./models/revenue");
const User = require("./models/event_analytics");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

// Register
app.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password, selectedRole } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (selectedRole !== user.role) {
    return res.status(403).json({ message: "Invalid role" });
  }

  res.json({
    message: "Login successful",
    role: user.role,
  });
});

// STEP 1: Create DB if not exists
const createDatabase = () => {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  });

  connection.connect((err) => {
    if (err) throw err;

    connection.query(
      "CREATE DATABASE IF NOT EXISTS community_app",
      (err) => {
        if (err) throw err;

        connection.end();

        startSequelize();
      }
    );
  });
};


const startSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    await sequelize.sync(); 

    console.log("Tables created");

    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  } catch (err) {
    console.error(err);
  }
};

createDatabase();