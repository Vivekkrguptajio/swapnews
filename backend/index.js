const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===== Middleware ===== */
app.use(cors());
app.use(express.json());

/* ===== MongoDB Connection ===== */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });

/* ===== Test Route ===== */
app.get("/", (req, res) => {
  res.send("🚀 News Shorts Backend is running");
});

/* ===== Routes ===== */
const newsRoutes = require("./routes/news");
const authRoutes = require("./routes/auth");

app.use("/api/news", newsRoutes);
app.use("/api/auth", authRoutes);

/* ===== Server Start ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
