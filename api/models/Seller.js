const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const documentSchema = new mongoose.Schema({
  url: { type: String },
  expiry: { type: Date, default: null }, // Optional expiry date
});

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    storeLocation: {
      type: String,
      required: true,
    },
    role: { type: String, default: "seller" },

    documents: {
      url:{type:String},
      expiry:{type:Date}
    },

    status: {
      type: String,
      enum: ["pending", "approved", "disabled"],
      default: "pending", // Seller starts with pending status for approval
    },
    createdAt: {
      type: Date,
      default: Date.now,
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

sellerSchema.index({ location: "2dsphere" });

// Hash password before saving
sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
sellerSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Seller", sellerSchema);
