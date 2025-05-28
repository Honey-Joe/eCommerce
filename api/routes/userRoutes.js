const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const adminMiddleware = require('../middleware/adminMiddleware');

// CRUD routes
router.get('/', getAllUsers);          // Read all users
router.get('/:id', getUserById);       // Read single user
router.put('/:id', updateUser);        // Update user
router.delete('/:id', deleteUser);     // Delete user

module.exports = router;
