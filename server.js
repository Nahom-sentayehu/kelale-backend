const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ---------- Middlewares ----------
app.use(express.json());
app.use(cors());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Request logger (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ---------- MongoDB Connection ----------
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ---------- Import Routes ----------
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/buses");
const bookingRoutes = require("./routes/bookingRoutes");
const companyRoutes = require("./routes/companies");
const routeRoutes = require("./routes"); // Index file for routes
const scheduleRoutes = require("./routes/schedules");
const ratingRoutes = require("./routes/ratings");

// ---------- API Routes ----------
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/ratings", ratingRoutes);

// ---------- API Test Endpoint ----------
app.get("/api", (req, res) => {
  res.json({ message: "Kelale Transport API is running 🚍" });
});

// ---------- Root Path ----------
app.get("/", (req, res) => {
  res.send("Kelale Transport Backend API is running.");
});

// ---------- Error Handler ----------
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;

// Important for Render deployment
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
