const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Food = require("../models/Food");
const requireAuth = require("../middleware/auth");
const { optionalAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

const STATUSES = ["Pending", "Preparing", "Out for delivery", "Delivered", "Cancelled"];
const DELIVERY_FEE = 2;

// POST /api/orders - place a new order (linked to the customer if logged in)
router.post("/", optionalAuth, async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      items,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const entry of items) {
      if (!mongoose.isValidObjectId(entry.foodId)) {
        return res.status(400).json({ message: "Invalid food id in items" });
      }

      const food = await Food.findById(entry.foodId);
      if (!food || food.available === false) {
        return res.status(400).json({ message: "A food item is not available" });
      }

      const quantity = Number(entry.quantity) || 1;
      if (quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }

      subtotal += food.price * quantity;
      orderItems.push({
        food: food._id,
        name: food.name,
        price: food.price,
        quantity,
      });
    }

    const order = await Order.create({
      user: req.user ? req.user._id : null,
      customerName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      items: orderItems,
      deliveryFee: DELIVERY_FEE,
      totalPrice: subtotal + DELIVERY_FEE,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: "Could not place order", error: err.message });
  }
});

// GET /api/orders/my - the logged in customer's own orders
// (this must stay above the "/:id" route)
router.get("/my", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/orders - list all orders (admin only)
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/orders/:id - one order (its owner or an admin)
router.get("/:id", requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.user && order.user.equals(req.user._id);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "This is not your order" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/orders/:id/status - change the order status (admin only)
router.patch("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    if (!STATUSES.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status", allowed: STATUSES });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;