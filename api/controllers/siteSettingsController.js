const SiteSetting = require("../models/SiteSettings");

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

    let settings = await SiteSetting.findOne();
    if (settings) {
      settings = await SiteSetting.findByIdAndUpdate(settings._id, data, { new: true });
    } else {
      settings = await SiteSetting.create(data);
    }
    await settings.save()

    res.json({ message: "Site settings updated", settings });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error });
  }
};
