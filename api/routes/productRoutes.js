const express = require('express');
const router = express.Router();
const { sellerAuth } = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');
const adminMiddleware = require('../middleware/adminMiddleware');

// Create product (only approved seller)
router.post('/', sellerAuth, upload.array('images'), productController.createProduct);

// Get all products
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/parents', productController.getParentProducts);
router.get('/parents/:parentId/variants', productController.getVariantsByParentProductId);
router.get("/parent-products/seller/:sellerId",sellerAuth, productController.getParentProductsBySeller);
router.get("/category/:categoryId", productController.getProductsByCategory);



// Get single product
router.get('/:id', productController.getProductById);

// Update product (only original seller)
router.put('/:id', sellerAuth, upload.array('images'), productController.updateProduct);

// Delete product (only original seller)
router.delete('/:id', sellerAuth, productController.deleteProduct);
router.get('/seller/:sellerId', sellerAuth, productController.getProductBySeller);
router.patch('/:id/status',adminMiddleware, productController.updateProductStatus);
router.patch("/:id/is-sold", productController.updateIsSold);




module.exports = router;
