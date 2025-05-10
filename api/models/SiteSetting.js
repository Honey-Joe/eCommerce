const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, required: true },
  logoUrl: { type: String },
  contactEmail: { type: String },
  taxRate: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  allowRegistrations: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
