const mongoose = require("mongoose");

const searchCountSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["product", "category"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

searchCountSchema.index({ type: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("SearchCount", searchCountSchema);
