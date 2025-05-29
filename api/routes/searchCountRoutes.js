const express = require("express");
const router = express.Router();
const {
  incrementSearchCount,
  getTopSearched,
  getSuggestions,
} = require("../controllers/searchCountController");

router.post("/increment", incrementSearchCount); // POST /api/search/increment
router.get("/top", getTopSearched); 
router.get("/suggestions", getSuggestions);
            // GET  /api/search/top?type=product|category&limit=5

module.exports = router;
