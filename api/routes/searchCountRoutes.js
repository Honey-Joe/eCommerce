const express = require("express");
const router = express.Router();
const {
  incrementSearchCount,
  getTopSearched,
} = require("../controllers/searchCountController");

router.post("/increment", incrementSearchCount); // POST /api/search/increment
router.get("/top", getTopSearched);             // GET  /api/search/top?type=product|category&limit=5

module.exports = router;
