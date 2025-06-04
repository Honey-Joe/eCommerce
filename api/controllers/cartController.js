const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate("items.product");
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    console.error("Get Cart Error:", err.message);
    res.status(500).json({ message: "Failed to get cart" });
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const product = await Product.findById(productId).populate("seller");
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        product: product._id,
        productName: product.name,
        seller: product.seller?._id,
        sellerName: product.seller?.name,
        sellerEmail: product.seller?.email,
        quantity: 1,
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Add to Cart Error:", err.message);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// Update Quantity (+ or -)
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, type } = req.body; // type = "inc" or "dec"
    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity += type === "inc" ? 1 : -1;
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(i => i.product.toString() !== productId);
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Update Cart Error:", err.message);
    res.status(500).json({ message: "Failed to update cart" });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Remove Item Error:", err.message);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear Cart Error:", err.message);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
