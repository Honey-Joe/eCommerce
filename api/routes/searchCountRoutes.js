const express = require("express");
const router = express.Router();
const {
  incrementSearchCount,
  getSuggestions,
  getTopSearchedItems,
} = require("../controllers/searchCountController");
const { searchSellerProducts } = require("../controllers/productController");
const {searchSellerProduct } = require("../controllers/sellerController");

router.post("/increment", incrementSearchCount); // POST /api/search/increment
router.get("/top", getTopSearchedItems); 
router.get("/suggestions", getSuggestions);
router.get("/seller/suggestions", searchSellerProducts);
router.get("/seller", searchSellerProduct);


            // GET  /api/search/top?type=product|category&limit=5

module.exports = router;
