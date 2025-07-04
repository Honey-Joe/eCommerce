const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");
const Role = require("../models/Role");

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find or create super-admin role
    let superAdminRole = await Role.findOne({ name: "super-admin" });
    if (!superAdminRole) {
      superAdminRole = await Role.create({
        name: "super-admin",
        permissions: [
          "user:manage",
          "seller:manage",
          "product:manage",
          "category:manage",
          "brand:manage",
          "settings:manage",
          "role:manage",
          "page:user",
          "page:seller",
          "page:product",
          "page:category",
          "page:brand",
          "page:settings",
          "page:roles",
        ],
      });
      console.log("Super Admin Role created");
    } else {
      console.log("Super Admin Role found");
    }

    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ email: "superadmin@example.com" });
    if (existingAdmin) {
      console.log("Super admin already exists");
      process.exit(0);
    }

    // Create super admin with role reference
    const superAdmin = new Admin({
      name: "Super Admin",
      email: "superadmin@example.com",
      phone: "9999999999",
      password: "supersecret123",
      role: superAdminRole._id, // Reference to Role document
    });

    await superAdmin.save();
    console.log("Super admin created ✅");
    process.exit(0);
  } catch (error) {
    console.error("Error creating super admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();
