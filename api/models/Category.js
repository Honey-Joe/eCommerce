const mongoose = require('mongoose');
const slugify = require('slugify');

const attributeSchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: ["text", "number", "dropdown"],
    required: true,
  },
  options: [String],
});

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    aliases: [{ type: String }], // ✅ New: Alternate names like 'sneakers'
    attributes: [attributeSchema],
  },
  { timestamps: true }
);

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
