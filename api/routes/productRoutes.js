const express = require('express');
const router = express.Router();
const { sellerAuth } = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

// Create product (only approved seller)
router.post('/', sellerAuth, upload.array('images'), productController.createProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get single product
router.get('/:id', productController.getProductById);

// Update product (only original seller)
router.put('/:id', sellerAuth, upload.array('images'), productController.updateProduct);

// Delete product (only original seller)
router.delete('/:id', sellerAuth, productController.deleteProduct);
router.get('/seller/:sellerId', sellerAuth, productController.getProductBySeller);


module.exports = router;
