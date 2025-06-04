const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { userAuth } = require("../middleware/authMiddleware");

router.get("/", userAuth, cartController.getCart);
router.post("/", userAuth, cartController.addToCart);
router.put("/quantity", userAuth, cartController.updateQuantity);
router.delete("/:productId", userAuth, cartController.removeFromCart);
router.delete("/", userAuth, cartController.clearCart);

module.exports = router;
