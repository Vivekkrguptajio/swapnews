const router = require("express").Router();
const PublisherRequest = require("../models/PublisherRequest");
const User = require("../models/User");

// Check Application Status
router.get("/status/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const request = await PublisherRequest.findOne({ userId }).sort({ createdAt: -1 });
        if (!request) return res.json({ status: "none" });
        res.json({ status: request.status });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Submit Publisher Request
router.post("/request", async (req, res) => {
    try {
        const { userId, fullName, email, phoneNumber, aadhaarNumber } = req.body;

        // Check if already requested
        const existing = await PublisherRequest.findOne({ userId, status: "pending" });
        if (existing) {
            return res.status(400).json({ message: "Request already pending." });
        }

        const newRequest = new PublisherRequest({
            userId,
            fullName,
            email,
            phoneNumber,
            aadhaarNumber
        });

        await newRequest.save();
        res.status(201).json({ message: "Application submitted successfully." });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Requests (Admin Only - Logic handled in frontend/backend protection usually, simplified here)
router.get("/requests", async (req, res) => {
    try {
        const requests = await PublisherRequest.find({ status: "pending" }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Approve Request
router.put("/approve/:id", async (req, res) => {
    try {
        const request = await PublisherRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        request.status = "approved";
        await request.save();

        // Update User Role
        const user = await User.findById(request.userId);
        if (user) {
            user.isPublisher = true;
            await user.save();
        }

        res.json({ message: "Publisher approved." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Reject Request
router.put("/reject/:id", async (req, res) => {
    try {
        const request = await PublisherRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        request.status = "rejected";
        await request.save();

        res.json({ message: "Publisher request rejected." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
