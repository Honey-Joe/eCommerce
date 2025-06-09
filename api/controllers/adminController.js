const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Seller = require("../models/Seller");
const Role = require("../models/Role");

// controller/adminController.js

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).populate("role");

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!admin.role) {
      return res.status(403).json({ message: "No role assigned to admin" });
    }

    const permissions = admin.role.permissions || [];

    const token = jwt.sign(
      {
        userId: admin._id,
        roleId: admin.role._id, // role ID in token
        roleName: admin.role.name, // optional if needed later
        permissions, // include permissions directly
      },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        message: "Login successful",
        role: {
          _id: admin.role._id,
          name: admin.role.name,
        },
        permissions,
      });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getAdminProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user info found" });
    }

    res.status(200).json({
      userId: req.user.userId,
      role: {
        _id: req.user.roleId || null,
        name: req.user.roleName || "N/A",
      },
      permissions: req.user.permissions || [],
      message: "Authenticated",
    });
  } catch (err) {
    console.error("Error in getAdminProfile:", err);
    res.status(500).json({
      message: "Failed to fetch profile",
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
    const { name, email, phone, password, roleId } = req.body;

    // Ensure only super-admin can create other admins
    if (req.user.roleName !== "super-admin") {
      return res
        .status(403)
        .json({ message: "Only Super Admin can create new admins." });
    }

    // Check if admin with email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Fetch and validate role
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ message: "Invalid role selected." });
    }

    // Create new admin using role's permissions
    const newAdmin = new Admin({
      name,
      email,
      phone,
      password,
      role: role._id,
      permissions: role.permissions,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        role: role.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ✅ Get All Admins (Super Admin Only)
const getAllAdmins = async (req, res) => {
  try {
    if (req.user.roleName !== "super-admin") {
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
