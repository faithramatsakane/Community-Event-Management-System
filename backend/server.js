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
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (selectedRole && selectedRole !== user.role) {
      return res.status(403).json({ message: "Invalid role" });
    }
    
    res.json({ 
      message: "Login successful", 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Events Endpoints
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const { title, description, date, location, category, price, capacity, organizerId } = req.body;
    
    if (!title || !date || !location) {
      return res.status(400).json({ message: "Title, date, and location are required" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      category: category || 'general',
      price: price || 0,
      capacity: capacity || 100,
      UserId: organizerId,
      status: 'active'
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    await event.update(req.body);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bookings Endpoints
app.post("/api/bookings", async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    
    if (!userId || !eventId) {
      return res.status(400).json({ message: "User ID and Event ID are required" });
    }

    const booking = await Booking.create({
      UserId: userId,
      EventId: eventId,
      status: 'confirmed',
      bookingsDate: new Date()
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/bookings/:userId", async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { UserId: req.params.userId },
      include: [Event]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Contact Form Endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { fullName, email, message } = req.body;
    
    if (!fullName || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // In production, you'd send an email here
    console.log(`Contact form received from ${email}: ${message}`);
    
    res.json({ 
      message: "Thank you for contacting us. We will respond shortly.",
      contact: { fullName, email, timestamp: new Date() }
    });
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