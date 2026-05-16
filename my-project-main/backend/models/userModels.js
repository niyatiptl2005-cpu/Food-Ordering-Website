import mongoose from "mongoose";

// Create user schema
const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
   role: {
    type: String,
    enum: ["user", "admin"],
    default: "user", // normal users by default
  },
});

//  Auto-generate incremental userId before saving
userSchema.pre("save", async function (next) {
  if (!this.userId) {
    try {
      const lastUser = await mongoose.model("User").findOne().sort({ userId: -1 });
      this.userId = lastUser ? lastUser.userId + 1 : 1;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);
export default User;
