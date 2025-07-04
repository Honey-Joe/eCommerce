const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logoUrl: {
      type: String, // Optional: Cloudinary or static URL
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status:{
        type:String,
        enum:['pending','approved','disabled'],
        default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Brand', brandSchema);

