import express from "express";
import MenuItem from "../models/menuModels.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + Date.now() + ext;
    cb(null, name);
  },
});
const upload = multer({ storage });

// Get all menu items
router.get("/all", async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// Add new item (multipart/form-data)
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;
    // if file uploaded, build image path accessible from frontend
    let imagePath = req.body.image || ""; // fallback if no file
    if (req.file) {
      // serve via /uploads/filename
      imagePath = `/uploads/${req.file.filename}`;
    }
    const newItem = new MenuItem({ name, price, image: imagePath });
    await newItem.save();
    res.json({ success: true, item: newItem });
  } catch (err) {
    console.error("Add menu error:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
});

// Update item
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json({ success: true, item: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

// Delete
router.delete("/delete/:id", async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default router;
