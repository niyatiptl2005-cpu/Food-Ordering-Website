import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModels.js";

const router = express.Router();

/* =========================================================
   ✅ REGISTER USER
   ========================================================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // 2️⃣ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create and save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user", // default role
    });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =========================================================
   ✅ LOGIN USER / ADMIN
   ========================================================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 2️⃣ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);
    console.log("Stored hashed password:", user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // 3️⃣ Log user role
    console.log("User role:", user.role);

    // 4️⃣ Send role-based response (✅ FIXED _id key)
    if (user.role === "admin") {
      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        role: "admin",
        user: { _id: user._id, name: user.name, email: user.email },
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User login successful",
        role: "user",
        user: { _id: user._id, name: user.name, email: user.email },
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =========================================================
   ✅ GET ALL USERS (ADMIN ONLY)
   ========================================================= */
router.get("/all", async (req, res) => {
  try {
    // Later, you can add token-based check to confirm admin
    const users = await User.find({}, "-password"); // exclude password field
    res.json({ success: true, users });
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
