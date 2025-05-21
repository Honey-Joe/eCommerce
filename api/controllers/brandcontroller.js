const Brand = require('../models/Brand');

const uploadToCloudinary = require('../utils/uploadToCloudinary'); // adjust path as needed

exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if files are present
    let logoUrl = null;
    if (req.files && req.files.length > 0) {
      const uploaded = await uploadToCloudinary(req.files, 'brands');
      logoUrl = uploaded[0].url; // use the first image
    }

    const brand = await Brand.create({
      name,
      description,
      logoUrl,
    });

    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single brand
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateBrandStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!['approved', 'disabled', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({ message: 'Brand not found.' });
    }

    res.status(200).json(updatedBrand);
  } catch (error) {
    console.error('Error updating brand status:', error);
    res.status(500).json({ message: 'Server error while updating status.' });
  }
};
// @desc    Update brand
exports.updateBrand = async (req, res) => {
  try {
    const { name, description, logoUrl, isActive,status } = req.body;
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, description, logoUrl, isActive,status },
      { new: true, runValidators: true }
    );
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete brand
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
