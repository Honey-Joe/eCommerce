const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandcontroller');
const adminMiddleware = require('../middleware/adminMiddleware');
const { sellerAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Create
router.post('/',adminMiddleware,sellerAuth, upload.array('logo'), brandController.createBrand);

// Read
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);

// Update
router.put('/:id', adminMiddleware, brandController.updateBrand);
router.put('/:id/status',adminMiddleware, brandController.updateBrandStatus);
// Delete
router.delete('/:id',adminMiddleware, brandController.deleteBrand);

module.exports = router;
