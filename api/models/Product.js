const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: "Product image",
        },
      },
    ],
    brand: {
      type: String,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Disabled", "DisabledByAdmin"],
      default: "Pending",
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false,
      },
      place: {
        type: String,
        required: false,
      },
    },

    // ✅ NEW FIELD: Is this a variant or main product?
    isVariant: {
      type: Boolean,
      default: false,
    },

    // ✅ NEW FIELD: Reference to main product (if variant)
    parentProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    // ✅ NEW FIELD: Array of variant references (used only for main product)
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

// Geospatial index
productSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Product", productSchema);
