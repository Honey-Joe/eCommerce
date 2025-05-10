const express = require('express');
const { registerUser, registerSeller, login, logout, getUserProfile } = require('../controllers/authController');
const adminMiddleware = require('../middleware/adminMiddleware');
const {verifyToken} = require("../middleware/authMiddleware");
const upload = require('../middleware/upload');
const router = express.Router();

// User registration route
router.post('/register/user', registerUser);

// Seller registration route
router.post('/register/seller', upload.array('documents', 3), registerSeller); // Limit to 3 files
router.get('/me',verifyToken, getUserProfile);

// Login route (for both users and sellers)
router.post('/login', login);
router.post('/logout', logout);


module.exports = router;
