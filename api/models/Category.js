const mongoose = require('mongoose')
const attributeSchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: ["text", "number", "dropdown"],
    required: true,
  },
  options: [String], // for dropdown
});

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    attributes: [attributeSchema],
  },
  { timestamps: true }
);

module.exports =  mongoose.model("Category", categorySchema);
