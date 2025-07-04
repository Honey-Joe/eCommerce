const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Routes
router.post('/',adminMiddleware, categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/search', categoryController.searchCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id',adminMiddleware, categoryController.updateCategory);
router.delete('/:id',adminMiddleware, categoryController.deleteCategory);

module.exports = router;
