const mongoose = require("mongoose");

const siteSettingSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
  },
  baseUrl :{
    type:String
  },
  contactEmail: {
    type: String,
  },
  contactPhone: {
    type: String,
  },
  address: {
    type: String,
  },
  aboutUs: {
    type: String,
  },
  termsAndConditions: {
    type: String,
  },
  privacyPolicy: {
    type: String,
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("SiteSettings", siteSettingSchema);
