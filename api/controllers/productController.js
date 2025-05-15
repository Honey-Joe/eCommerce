const Product = require('../models/Product');
const Seller = require('../models/Seller');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

// Create product (Only for approved sellers)
exports.createProduct = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    const seller = await Seller.findById(sellerId);
    if (!seller || !seller === "approved") {
      return res.status(403).json({ message: 'Only approved sellers can create products' });
    }

    const { name, description, price, category, brand, stock, isFeatured } = req.body;

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const urls = await uploadToCloudinary(req.files, 'product-images');
      imageUrls = urls.map((url) => ({ url }));
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      brand,
      stock,
      isFeatured,
      images: imageUrls,
      seller: sellerId,
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (error) {
    console.error('Create Product Error:', error.message);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};
exports.updateProductStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const allowedStatuses = ['Approved', 'Disabled'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({
      message: `Product status updated to ${status}`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

// Update product (Only the original approved seller)
exports.updateProduct = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this product' });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller || seller.status !== 'approved') {
      return res.status(403).json({ message: 'Only approved sellers can update products' });
    }

    const updates = req.body;

    if (req.files && req.files.length > 0) {
      const urls = await uploadToCloudinary(req.files, 'product-images');
      updates.images = urls.map((url) => ({ url }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.status(200).json({ message: 'Product updated', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

// Delete product (Only the original seller)
// controllers/productController.js

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const sellerId = req.user?.userId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product belongs to the current seller
    if (product.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Not your product' });
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};


exports.getProductBySeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    const products = await Product.find({ seller: sellerId });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};
