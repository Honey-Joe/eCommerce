const Brand = require('../models/Brand');
const Product = require('../models/Product');
const Seller = require('../models/Seller');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

// Create product (Only for approved sellers)


exports.createProduct = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    const seller = await Seller.findById(sellerId);
    if (!seller || seller.status !== "approved") {
      return res.status(403).json({ message: 'Only approved sellers can create products' });
    }

    const {
      name,
      description,
      price,
      category,
      stock,
      brand,
      isFeatured,
      longitude,
      latitude,
      place,
      isVariant,
      parentProduct
    } = req.body;

    if (!price) {
      return res.status(400).json({ message: "Product price is required" });
    }

    // Parse attributes safely
    let parsedAttributes = {};
    if (typeof req.body.attributes === "string") {
      try {
        parsedAttributes = JSON.parse(req.body.attributes);
      } catch (err) {
        return res.status(400).json({ message: "Invalid attributes format. Must be valid JSON." });
      }
    } else if (typeof req.body.attributes === "object") {
      parsedAttributes = req.body.attributes;
    }

    // Upload images to Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const cloudinaryResponses = await uploadToCloudinary(req.files, 'product-images');
      imageUrls = cloudinaryResponses.map((img) => ({ url: img.url }));
    }

    const productData = {
      name,
      description,
      price,
      category,
      stock,
      brand,
      isFeatured,
      images: imageUrls,
      attributes: parsedAttributes,
      seller: sellerId,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        place: place
      },
      isVariant: isVariant === 'true' || isVariant === true, // handle string "true" from form-data
      parentProduct: isVariant ? parentProduct : null
    };

    const newProduct = new Product(productData);
    await newProduct.save();

    // If it's a variant, add to parent's variants array
    if (productData.isVariant && parentProduct) {
      await Product.findByIdAndUpdate(parentProduct, {
        $addToSet: { variants: newProduct._id }
      });
    }

    res.status(201).json({ message: 'Product created', product: newProduct });

  } catch (error) {
    console.error('Create Product Error:', error.message);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};


exports.updateProductStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['Approved', 'DisabledByAdmin'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    // Find the product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // If trying to approve, check if brand is approved
    if (status === 'Approved') {
      const brand = await Brand.findOne({ name: product.brand });

      if (!brand) {
        return res.status(400).json({ message: 'Associated brand not found.' });
      }

      if (brand.status !== 'approved') {
        return res.status(400).json({ message: 'Product cannot be approved because the brand is not approved.' });
      }
    }

    // Update product status
    product.status = status;
    const updatedProduct = await product.save();

    res.status(200).json({
      message: `Product status updated to ${status}`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateIsSold = async (req, res) => {
  const { id } = req.params;
  const { isSold } = req.body;

  if (typeof isSold !== 'boolean') {
    return res.status(400).json({ message: "isSold must be a boolean value." });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { isSold },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({
      message: `Product marked as ${isSold ? "sold" : "unsold"}.`,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
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
exports.getParentProducts = async (req, res) => {
  try {
    const parentProducts = await Product.find({
      isVariant: false,
    });

    res.status(200).json(parentProducts);
  } catch (error) {
    console.error("Error fetching parent products:", error);
    res.status(500).json({ message: "Server error while fetching parent products" });
  }
};
exports.getVariantsByParentProductId = async (req, res) => {
  try {
    const { parentId } = req.params;

    // Validate parent product exists
    const parentProduct = await Product.findById(parentId);
    if (!parentProduct) {
      return res.status(404).json({ message: "Parent product not found" });
    }

    // Fetch variant products referencing this parent
    const variants = await Product.find({ parentProduct: parentId, isVariant: true });

    return res.status(200).json({
      success: true,
      count: variants.length,
      variants,
    });
  } catch (error) {
    console.error("Error fetching variants:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
