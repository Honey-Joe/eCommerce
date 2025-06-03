const Order = require("../models/Order");

// Create a new order
exports.createOrder = async function (req, res) {
  try {
    const {
      orderItems,
      shippingInfo,
      paymentMethod,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      buyer: req.user.userId,
      orderItems,
      shippingInfo,
      paymentMethod,
      totalPrice,
      paymentStatus: paymentMethod === "Online" ? "Paid" : "Pending",
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Get all orders of the logged-in buyer
exports.getMyOrders = async function (req, res) {
  try {
    const orders = await Order.find({ buyer: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buyer orders" });
  }
};

// Get all orders of the logged-in seller
exports.getSellerOrders = async function (req, res) {
  try {
    const orders = await Order.find({ seller: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seller orders" });
  }
};

// Mark order as delivered
exports.markOrderDelivered = async function (req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.seller.toString() !== req.user.userId.toString()) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();

    res.json({ message: "Order marked as delivered", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update delivery status" });
  }
};
