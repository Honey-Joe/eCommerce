const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SiteSetting = require('../models/SiteSetting');
const User = require('../models/User');
const Seller = require('../models/Seller');


const registerAdmin = async (req, res) => {
    const { name, email, phone, password } = req.body;
  
    try {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
      }
  
      const admin = new Admin({ name, email, phone, password }); // Password hashed via schema
      await admin.save();
  
      res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error registering admin', error: error.message });
    }
  };

// controller/adminController.js

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store JWT in HTTP-only cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000 // 1 hour
    });

    res.status(200).json({ message: "Login successful", role: admin.role });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};


 const getAdminProfile = async (req, res) => {
  try {
    res.status(200).json({
      userId: req.user.userId,
      role: req.user.role,
      message: "Authenticated"
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify admin", error: err.message });
  }
};

  const adminLogout = async (req, res) => {
    res.clearCookie('adminToken');
    res.status(200).json({ message: 'Admin logged out successfully' });
  }



// Get all sellers






  module.exports = {
    loginAdmin,
    registerAdmin,
    adminLogout,
    getAdminProfile,
  };
  