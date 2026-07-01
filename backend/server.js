const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

// Import Models
const User = require("./models/User");
const Event = require("./models/Event");
const Payment = require("./models/Payment");
const Booking = require("./models/bookings");

const app = express();
app.use(cors());
app.use(express.json());

// --- Define Relationships (Associations) ---
User.hasMany(Booking);
Booking.belongsTo(User);

Event.hasMany(Booking);
Booking.belongsTo(Event);

User.hasMany(Payment);
Payment.belongsTo(User);

Event.hasMany(Payment);
Payment.belongsTo(Event);

// --- API Routes ---

// Dashboard Overview Endpoint
app.get("/api/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalOrganizers = await User.count({ where: { role: 'organizer', isApproved: true } });
    const activeEvents = await Event.count({ where: { status: 'active' } });
    const totalRevenue = await Payment.sum('amount') || 0;

    res.json({ totalUsers, totalOrganizers, activeEvents, totalRevenue });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// Authentication Routes
app.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password, selectedRole } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (selectedRole !== user.role) {
      return res.status(403).json({ message: "Invalid role" });
    }
    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Server Initialization ---
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
    
    // Sync models and update schema automatically
    await sequelize.sync({ alter: true });
    console.log("Database tables synchronized.");

    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  } catch (err) {
    console.error("Connection error:", err);
  }
};

startServer();