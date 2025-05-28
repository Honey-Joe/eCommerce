const Category = require('../models/Category');
const Product = require('../models/Product');

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, attributes } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({ name, attributes });
    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create category', error: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch category', error: error.message });
  }
};


exports.searchCategories = async (req, res) => {
  try {
    const { search } = req.query;

    // Find categories matching the search keyword (case-insensitive)
    const categories = await Category.find({
      name: { $regex: search || "", $options: "i" }
    }).limit(20);

    // For each category, find products related to that category
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({ categoryId: category._id }).limit(10); // limit products per category

        return {
          _id: category._id,
          name: category.name,
          attributes: category.attributes,
          products, // embed related products
        };
      })
    );

    res.status(200).json(categoriesWithProducts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories", details: err.message });
  }
};


// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, attributes } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, attributes },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};
