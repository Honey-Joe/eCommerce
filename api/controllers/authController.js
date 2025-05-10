const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Seller = require('../models/Seller');
const cloudinary = require('../utils/cloudinary');
const uploadToCloudinary = require('../utils/uploadToCloudinary');


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      name,
      email,
      password, // Will be hashed by schema pre-save hook
      role: role || 'user',
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Register a new seller
const registerSeller = async (req, res) => {
  try {
    const { name, email, password, businessName, storeLocation } = req.body;

    // Handle multiple file uploads
    let documentUrls = [];
    if (req.files) {
      documentUrls = await uploadToCloudinary(req.files, 'seller-documents');
    }

    const newSeller = new Seller({
      name,
      email,
      password,
      businessName,
      storeLocation,
      documents: documentUrls, // Store multiple URLs
    });

    await newSeller.save();

    res.status(201).json({ message: 'Seller registered successfully', user: newSeller });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};


// Login for both users and sellers
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await Seller.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'No account found with this email' });
      }
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set token as HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only over HTTPS in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: 'Login successful',
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      userId: req.user.userId,  // From token decoded in authMiddleware
      role: req.user.role,
      message: "Authenticated",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve user profile", error: err.message });
  }
};

// Logout: Clear cookie
const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, registerSeller, login, logout ,getUserProfile}
