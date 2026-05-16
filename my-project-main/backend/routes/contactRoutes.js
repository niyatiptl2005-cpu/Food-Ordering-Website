import express from "express";
import Contact from "../models/contactModels.js";

const router = express.Router();

// POST contact message
router.post("/", async (req, res) => {
  try {
    const { username, email, message } = req.body;

    if (!username || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = new Contact({ username, email, message });
    await newMessage.save();

    res.status(201).json({ message: "Message stored successfully" });
  } catch (error) {
    console.error("❌ Error saving contact:", error.message);
    res.status(500).json({ message: "Error saving contact", error: error.message });
  }
});

export default router;
