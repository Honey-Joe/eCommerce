const Category = require("../models/Category");
const Product = require("../models/Product");
const SearchCount = require("../models/SearchCount");

// Increment or create a search count
exports.incrementSearchCount = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: "Name and type are required" });
    }

    const filter = { type, name };
    const update = {
      $inc: { count: 1 },
      $setOnInsert: {}, // this only sets on insert
    };

    if (type === "product") {
      const product = await Product.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
      if (product) {
        filter.productId = product._id;
        update.$setOnInsert.productId = product._id;
        update.$setOnInsert.categoryId = product.categoryId; // Assuming you want to also set the categoryId on insert
      }
    } else if (type === "category") {
      const category = await Category.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
      if (category) {
        filter.categoryId = category._id;
        update.$setOnInsert.categoryId = category._id;
      }
    }

    const result = await SearchCount.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to increment search count", details: err.message });
  }
};
exports.getSuggestions = async (req, res) => {
  const { query } = req.query;
  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const regex = new RegExp(query, "i"); // case-insensitive

    const products = await Product.find({ name: regex }).limit(5).select("name");
    const categories = await Category.find({ name: regex }).limit(5).select("name");

    res.json({
      products,
      categories,
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ message: "Server error while fetching suggestions" });
  }
};
// Get top searched items
exports.getTopSearched = async (req, res) => {
  const { type, limit = 5 } = req.query;

  if (!type || !["product", "category"].includes(type)) {
    return res.status(400).json({ message: "Invalid type query" });
  }

  try {
    const topItems = await SearchCount.find({ type })
      .sort({ count: -1 })
      .limit(parseInt(limit));

    // Get names or IDs from topItems
    const names = topItems.map((item) => item.name);

    let detailedItems = [];

    if (type === "product") {
      detailedItems = await Product.find({ name: { $in: names }, status:"Approved" });
    } else if (type === "category") {
      detailedItems = await Category.find({ name: { $in: names } });
    }

    // Attach the count to each result (optional)
    const detailedWithCount = detailedItems.map((item) => {
      const countObj = topItems.find((e) => e.name === item.name);
      return {
        ...item._doc, // to include full document
        count: countObj?.count || 0,
      };
    });

    res.status(200).json(detailedWithCount);
  } catch (err) {
    console.error("Error fetching top searched:", err);
    res.status(500).json({ message: "Server error" });
  }
};
