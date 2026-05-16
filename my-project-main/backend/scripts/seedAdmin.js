import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/userModels.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin@123", 10);

    const adminUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log("   Email: admin@gmail.com");
    console.log("   Password: admin@123");

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run seed function
seedAdmin();

