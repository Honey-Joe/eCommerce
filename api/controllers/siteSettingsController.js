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

        // If images are uploaded, upload them to Cloudinary and include in updates
        if (req.files && req.files.length > 0) {
          const cloudinaryResponses = await uploadToCloudinary(
            req.files,
            "product-images"
          );
    
          const imageUrls = cloudinaryResponses.map((img) => ({
            url: img.url,
            alt: img.originalname,
          }));
    
          data.logoUrl = imageUrls; // ✅ correct field name
        }

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
