// scripts/seedSiteSettings.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const SiteSetting = require("../models/SiteSettings");

dotenv.config();

// Replace with your MongoDB URI
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/your-db-name";

const seedSiteSettings = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear previous settings (optional)
    await SiteSetting.deleteMany();

    const siteSetting = await SiteSetting.create({
      siteName: "My E-Commerce",
      logoUrl: "https://example.com/logo.png",
      contactEmail: "support@example.com",
      contactPhone: "+91 1234567890",
      address: "123 Main Street, Bengaluru, India",
      aboutUs: "We are the best store for electronics and fashion.",
      termsAndConditions: "Use of this site is subject to terms and conditions.",
      privacyPolicy: "We collect data to serve you better. No sharing with third-parties.",
      socialLinks: {
        facebook: "https://facebook.com/myshop",
        instagram: "https://instagram.com/myshop",
        twitter: "https://twitter.com/myshop",
      },
    });

    console.log("✅ Site settings seeded successfully:", siteSetting);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding site settings:", err);
    process.exit(1);
  }
};

seedSiteSettings();
