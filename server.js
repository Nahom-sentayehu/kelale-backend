const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ---------- Middlewares ----------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors({
  origin: [
    "https://kelale-frontend1.onrender.com",
    "http://localhost:5173"
  ],
  credentials: true
}));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ---------- MongoDB Connection ----------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ---------- Import Routes ----------
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/buses");
const bookingRoutes = require("./routes/bookingRoutes");
const companyRoutes = require("./routes/companies");
const routeRoutes = require("./routes/routes");   // 🔥 FIXED
const scheduleRoutes = require("./routes/schedules");
const ratingRoutes = require("./routes/ratings");

// ---------- Route Handlers ----------
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/ratings", ratingRoutes);

// ---------- Root ----------
app.get("/api", (req, res) => {
  res.json({ message: "Kelale Transport API is running 🚍" });
});

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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
