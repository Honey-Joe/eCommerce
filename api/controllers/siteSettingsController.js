const SiteSetting = require("../models/SiteSettings");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Get current site settings
exports.getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSetting.findOne();
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ message: "Error fetching site settings", error });
  }
};

// Update or create site settings
exports.updateSiteSettings = async (req, res) => {
  try {
    const data = req.body;

    // Handle logo upload
    if (req.file) {
      const uploaded = await uploadToCloudinary([req.file], "site-settings");
      data.logoUrl = uploaded[0]?.url;
    }
    console.log(data);

    let settings = await SiteSetting.findOne();
    if (settings) {
      settings = await SiteSetting.findByIdAndUpdate(settings._id, data, { new: true });
    } else {
      settings = await SiteSetting.create(data);
    }

    res.json({ message: "Site settings updated", settings });
  } catch (error) {
    console.error("Site settings update error:", error);
    res.status(500).json({ message: "Error updating settings", error });
  }
};


