const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const generateInvoicePDF = require("../utils/generateInvoics");
const sendMail = require("../utils/sendEmail");
const sendMailInvoice = require("../utils/sendInvoiceEmail");
const fs = require("fs");



// Create a new order
exports.createOrder = async function (req, res) {
  try {
    const { orderItems, shippingInfo, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Step 1: Reduce stock for each product
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }

    // Step 2: Create Order
    const order = new Order({
      buyer: req.user.userId,
      buyerEmail: user.email,
      buyerName: user.name,
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
    const orders = await Order.find({ buyer: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buyer orders" });
  }
};
// Get all orders of the logged-in seller
exports.getSellerOrders = async function (req, res) {
  try {
    const orders = await Order.find()
      .populate("orderItems.product") // populate to access product.seller
      .sort({ createdAt: -1 });

    // Filter and map orders to include only products belonging to seller
    const filteredOrders = orders
      .map((order) => {
        // Filter orderItems that belong to the seller
        const sellerItems = order.orderItems.filter(
          (item) => item.product?.seller?.toString() === req.user.userId
        );

        if (sellerItems.length > 0) {
          return {
            _id: order._id,
            buyer: order.buyer,
            buyerEmail: order.buyerEmail,
            buyerName: order.buyerName,
            shippingInfo: order.shippingInfo,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            isDelivered: order.isDelivered,
            deliveredAt: order.deliveredAt,
            totalPrice: sellerItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ),
            createdAt: order.createdAt,
            orderItems: sellerItems,
          };
        }

        return null; // discard this order if no relevant items
      })
      .filter(Boolean); // remove nulls

    res.json(filteredOrders);
  } catch (error) {
    console.error("Error in getSellerOrders:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch seller-specific order items" });
  }
};

// Mark order as delivered
exports.markOrderDelivered = async function (req, res) {
  try {
    const order = await Order.findById(req.params.id);

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();

    res.json({ message: "Order marked as delivered", order });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to update delivery status", error: error });
  }
};

exports.sendDeliveryOtp = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    order.otp = otp;
    order.otpExpiresAt = expiry;
    await order.save();

    // Send Email
    await sendMail(
      order.buyerEmail,
      order.buyerName,
      "OTP for Delivery Confirmation",
      otp,
    );

    res.json({ message: "OTP sent to buyer email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};
exports.verifyOtpAndDeliver = async (req, res) => {
  try {
    const { otp } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.otp !== otp || Date.now() > new Date(order.otpExpiresAt)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Update order status
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.otp = undefined;
    order.otpExpiresAt = undefined;
    await order.save();

    // Mark products as sold
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.isSold = true;
        await product.save();
      }
    }

    // Generate PDF as buffer (no temp file)
    const pdfBuffer = await generateInvoicePDF(order);

    // Send email with invoice attachment directly from buffer
    await sendMailInvoice(order, pdfBuffer);
    
    res.json({ message: "Order marked as delivered", order });
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP", error: error.message });
  }
};
