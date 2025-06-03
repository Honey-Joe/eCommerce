const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { userAuth, sellerAuth } = require("../middleware/authMiddleware");

// Buyer routes
router.post("/", userAuth, orderController.createOrder);
router.get("/my", userAuth, orderController.getMyOrders);

// Seller routes
router.get("/seller", sellerAuth, orderController.getSellerOrders);
router.put("/:id/deliver", sellerAuth, orderController.markOrderDelivered);

module.exports = router;
