const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Seller = require("../models/Seller");

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
      {
        userId: admin._id,
        role: admin.role,
        permissions: admin.permissions,
      },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store JWT in HTTP-only cookie
    res.cookie("adminToken", token, {
      httpOnly: false,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 hour
    });

    // Sample response
    res.json({
      role: admin.role,
      permissions: admin.permissions || [], // e.g., ['user-management', 'product-management']
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user info found" });
    }

    // Example structure of permissions could be:
    // req.user.permissions = ['user_management', 'product_management', 'category_management']

    res.status(200).json({
      userId: req.user.userId,
      role: req.user.role,
      permissions: req.user.permissions || [],  // send permissions here
      message: "Authenticated",
    });
  } catch (err) {
    console.error("Error in getAdminProfile:", err);
    res.status(500).json({
      message: "Failed to verify admin",
      error: err.message,
    });
  }
};


const adminLogout = (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: false,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Admin logged out successfully" });
};

// ✅ Create Admin with specific permissions
const createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, role, permissions } = req.body;

    // Only super-admin can create other admins
    if (req.user.role !== "super-admin") {
      return res
        .status(403)
        .json({ message: "Only Super Admin can create new admins." });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const newAdmin = new Admin({
      name,
      email,
      phone,
      password,
      role,
      permissions,
    });
    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get All Admins (Super Admin Only)
const getAllAdmins = async (req, res) => {
  try {
    if (req.user.role !== "super-admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching admins", error: err.message });
  }
};

// ✅ Update Admin Permissions
const updateAdminPermissions = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { permissions } = req.body;

    if (req.user.role !== "super-admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { permissions },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Permissions updated", admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all sellers

module.exports = {
  loginAdmin,
  adminLogout,
  getAdminProfile,
  getAllAdmins,
  createAdmin,
  updateAdminPermissions,
};
