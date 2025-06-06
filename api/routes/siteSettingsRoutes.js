const express = require("express");
const router = express.Router();
const {
  getSiteSettings,
  updateSiteSettings,
} = require("../controllers/siteSettingsController");
const adminMiddleware = require("../middleware/adminMiddleware");

// Optional: middleware for admin protection
// const { isAdmin } = require("../middlewares/authMiddleware");

router.get("/", getSiteSettings);
router.put("/", adminMiddleware,updateSiteSettings);

module.exports = router;
