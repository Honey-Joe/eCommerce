const express = require('express');
const { registerUser, login, logout, getUserProfile, userLogin, sellerLogin } = require('../controllers/authController');
const {registerSeller} = require("../controllers/sellerController");
const adminMiddleware = require('../middleware/adminMiddleware');
const {verifyToken, userAuth, sellerAuth} = require("../middleware/authMiddleware");
const upload = require('../middleware/upload');
const router = express.Router();

// User registration route
router.post('/register/user',upload.single('profilePicture'), registerUser);

// Seller registration route
router.post('/register/seller',upload.single('profilePicture'), registerSeller); // Limit to 3 files
router.get('/me',verifyToken, getUserProfile);

// Login route (for both users and sellers)
router.post('/user/login', userLogin);
router.post('/seller/login', sellerLogin);
router.post('/logout', logout);


module.exports = router;
