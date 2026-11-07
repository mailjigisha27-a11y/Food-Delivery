const express = require("express");
const mongoose = require("mongoose");
const Food = require("../models/Food");
const requireAuth = require("../middleware/auth");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/food - list all food items (public, the menu needs it)
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/food/:id - get one food item (public)
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid food id" });
    }
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food item not found" });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/food - add a new food item (admin only)
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const food = new Food(req.body);
    const savedFood = await food.save();
    res.status(201).json(savedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/food/:id - update a food item (admin only)
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid food id" });
    }
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!food) return res.status(404).json({ message: "Food item not found" });
    res.json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/food/:id - delete a food item (admin only)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid food id" });
    }
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: "Food item not found" });
    res.json({ message: "Food item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;