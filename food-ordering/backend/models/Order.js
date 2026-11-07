const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, default: "", trim: true },
    state: { type: String, default: "", trim: true },
    zipCode: { type: String, default: "", trim: true },
    country: { type: String, default: "", trim: true },
    items: { type: [orderItemSchema], required: true },
    deliveryFee: { type: Number, default: 0, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Out for delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);