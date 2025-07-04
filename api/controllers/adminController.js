const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Seller = require("../models/Seller");
const Role = require("../models/Role");
const Order = require("../models/Order");
const Product = require("../models/Product");

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

    res.cookie("adminToken", token, {
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
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
      return res
        .status(401)
        .json({ message: "Unauthorized: No user info found" });
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
const updateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { name, email, phone, role, permissions } = req.body;

    // Only super-admin can update other admins
    if (req.user.roleName !== "super-admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(role && { role }),
        ...(permissions && { permissions }),
      },
      { new: true, runValidators: true }
    ).populate("role");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin details updated successfully",
      admin: updatedAdmin,
    });
  } catch (err) {
    console.error("Update admin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent Super Admin from deleting themselves or others
    const adminToDelete = await Admin.findById(id);
    if (!adminToDelete) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // You can add a role check to prevent deleting Super Admin
    if (adminToDelete.roleName === "superadmin") {
      return res.status(403).json({ message: "Cannot delete Super Admin" });
    }

    await Admin.findByIdAndDelete(id);
    return res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
const getAdminById = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId)
      .populate("role") // populate role if it's a reference
      .select("-password"); // exclude password for security

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 1. Location-based User Count (by state or city)
    const userLocations = await User.aggregate([
      {
        $group: {
          _id: "$location", // This assumes "location" is { type, coordinates }
          count: { $sum: 1 },
        },
      },
    ]);

    const sellerLocation = await Seller.aggregate([
      {
        $group:{
          _id:"$location",
          count:{$sum : 1},
        }
      }
    ])

    // 2. Orders by Shipping City
    const ordersByCity = await Order.aggregate([
      {
        $group: {
          _id: "$shippingInfo.city",
          orders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { orders: -1 } },
      { $limit: 10 },
    ]);

    // 3. Revenue by State
    const revenueByState = await Order.aggregate([
      {
        $group: {
          _id: "$shippingInfo.state",
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
    ]);

    // 4. User Growth
    const userGrowth = await User.aggregate([
      {
        $match: { createdAt: { $gte: startOfYear } },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          users: { $sum: 1 },
        },
      },
    ]);

    const monthMap = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const userGrowthData = monthMap.map((month, i) => {
      const entry = userGrowth.find((e) => e._id === i + 1);
      return { month, users: entry?.users || 0 };
    });

    // 5. Sales by Day of Week
    const salesAgg = await Order.aggregate([
      {
        $match: { createdAt: { $gte: startOfYear } },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          total: { $sum: "$totalPrice" },
        },
      },
    ]);
    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const salesData = dayMap.map((day, i) => {
      const entry = salesAgg.find((e) => e._id === ((i + 1) % 7));
      return { name: day, sales: entry?.total || 0 };
    });

    // 6. Totals
    const [ordersCount, usersCount, productsCount, totalRevenueAgg] =
      await Promise.all([
        Order.countDocuments(),
        User.countDocuments(),
        Product.countDocuments(),
        Order.aggregate([
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
      ]);

    const stats = {
      orders: ordersCount,
      users: usersCount,
      products: productsCount,
      revenue: totalRevenueAgg[0]?.total || 0,
    };

    // Response
    res.json({
      stats,
      salesData,
      userGrowthData,
      locationStats: {
        usersByCoordinates: userLocations,
        ordersByCity,
        revenueByState,
        sellersByCoordinates: sellerLocation
      },
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

// Get all sellers

module.exports = {
  loginAdmin,
  adminLogout,
  getAdminProfile,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminById,
  getDashboardStats,
};
