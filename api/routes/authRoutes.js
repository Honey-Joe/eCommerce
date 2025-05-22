const express = require('express');
const { registerUser, login, logout, getUserProfile } = require('../controllers/authController');
const {registerSeller} = require("../controllers/sellerController");
const adminMiddleware = require('../middleware/adminMiddleware');
const {verifyToken, userAuth, sellerAuth} = require("../middleware/authMiddleware");
const upload = require('../middleware/upload');
const router = express.Router();

// User registration route
router.post('/register/user', registerUser);

// Seller registration route
router.post('/register/seller', registerSeller); // Limit to 3 files
router.get('/me',verifyToken, getUserProfile);

// Login route (for both users and sellers)
router.post('/login', login);
router.post('/logout', logout);


module.exports = router;
