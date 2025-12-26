const express = require("express");
const router = express.Router();
const News = require("../models/News");

// GET all news (sorted by newest)
router.get("/", async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create news
router.post("/", async (req, res) => {
    const news = new News({
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        category: req.body.category,
        source: req.body.source,
    });

    try {
        const newNews = await news.save();
        res.status(201).json(newNews);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update news
router.put("/:id", async (req, res) => {
    try {
        const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updatedNews);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE news
router.delete("/:id", async (req, res) => {
    try {
        await News.findByIdAndDelete(req.params.id);
        res.json({ message: "News deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
