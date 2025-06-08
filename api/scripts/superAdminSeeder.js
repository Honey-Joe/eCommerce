const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");

dotenv.config();

const createSuperAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ email: "superadmin@example.com" });
  if (existing) {
    console.log("Super admin already exists");
    process.exit(0);
  }

  const superAdmin = new Admin({
    name: "Super Admin",
    email: "superadmin@example.com",
    phone: "9999999999",
    password: "supersecret123",
    role: "super-admin",
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

  await superAdmin.save();
  console.log("Super admin created ✅");
  process.exit(0);
};

createSuperAdmin();
