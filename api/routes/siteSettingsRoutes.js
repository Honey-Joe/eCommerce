const express = require("express");
const router = express.Router();
const {
  getSiteSettings,
  updateSiteSettings,
} = require("../controllers/siteSettingsController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

// Optional: middleware for admin protection
// const { isAdmin } = require("../middlewares/authMiddleware");

router.get("/", getSiteSettings);
router.put("/", adminMiddleware,upload.single("logoUrl"),updateSiteSettings);

module.exports = router;
