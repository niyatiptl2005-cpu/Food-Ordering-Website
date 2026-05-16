import express from "express";
import Order from "../models/orderModels.js";
import User from "../models/userModels.js";

const router = express.Router();

// ✅ Create Order
router.post("/", async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || !items.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      status: "Completed", // Set status to Completed after successful order
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Error placing order:", error.message);
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
});

// ✅ Get All Orders (for admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

// ✅ Update Order Status (for admin)
router.put("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status || !["Pending", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be Pending, Completed, or Cancelled" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("❌ Error updating order status:", error.message);
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
});

export default router;
