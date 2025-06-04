const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Add to Cart Error:", error.message);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate("items.product");
    res.json(cart || { items: [] });
  } catch (error) {
    console.error("Get Cart Error:", error.message);
    res.status(500).json({ message: "Failed to get cart" });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Remove from Cart Error:", error.message);
    res.status(500).json({ message: "Failed to remove from cart" });
  }
};

// Update quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Update Cart Quantity Error:", error.message);
    res.status(500).json({ message: "Failed to update quantity" });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear Cart Error:", error.message);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
