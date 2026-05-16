import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Handle dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder for images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Root route (optional)
app.get("/", (req, res) => {
  res.send("CampusBite Backend Running ✅");
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB Connected");
    
    // Seed admin user if it doesn't exist
    try {
      const User = (await import("./models/userModels.js")).default;
      const bcrypt = (await import("bcryptjs")).default;
      
      const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
      
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin@123", 10);
        const adminUser = new User({
          name: "Admin",
          email: "admin@gmail.com",
          password: hashedPassword,
          role: "admin",
        });
        await adminUser.save();
        console.log("✅ Admin user seeded successfully!");
        console.log("   Email: admin@gmail.com");
        console.log("   Password: admin@123");
      } else {
        console.log("✅ Admin user already exists");
      }
    } catch (seedError) {
      console.error("⚠️ Error seeding admin:", seedError.message);
    }
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
