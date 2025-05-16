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
    brand: {
      type: String,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
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
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
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
    },
  },
  { timestamps: true }
);

productSchema.index({location:'2dsphere'})

module.exports = mongoose.model("Product", productSchema);
