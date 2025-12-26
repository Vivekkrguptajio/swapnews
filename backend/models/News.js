const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String, // Full content if needed (optional for shorts)
    required: false,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "General",
  },
  source: {
    type: String,
    default: "SwipeNews",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("News", NewsSchema);
