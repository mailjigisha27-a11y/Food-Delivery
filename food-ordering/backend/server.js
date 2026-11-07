require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing in the .env file");
  process.exit(1);
}

const app = express();

// Only these website addresses may talk to the backend.
// On your computer this is the Vite address. Online, set FRONTEND_URL to your website address.
const allowedOrigins = (
  process.env.FRONTEND_URL || "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((address) => address.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without an origin (like PowerShell tests) are allowed
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("This website is not allowed by CORS"));
    },
  })
);
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Food Ordering API is running"));
app.use("/api/food", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB, then start the server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });