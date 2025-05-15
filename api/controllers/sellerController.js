const uploadToCloudinary = require('../utils/uploadToCloudinary');
const Seller = require("../models/Seller");
const Product = require('../models/Product');

const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().select('-password');
    res.status(200).json(sellers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sellers', error: err.message });
  }
};


const registerSeller = async (req, res) => {
  try {
    const { name, email, password, businessName, storeLocation } = req.body;

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newSeller = new Seller({
      name,
      email,
      password,
      businessName,
      storeLocation,
      documents: [], // Documents can be uploaded later
    });

    await newSeller.save();

    res.status(201).json({ message: 'Seller registered successfully', user: newSeller });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

module.exports = { registerSeller };



const uploadSellerDocuments = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No documents uploaded' });
    }

    // Upload files to Cloudinary
    const documentUrls = await uploadToCloudinary(req.files, 'seller-documents');

    // Find the seller
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Push new documents and update status
    seller.documents = documentUrls
    seller.status = 'pending';

    // Save updated seller
    await seller.save();

    res.status(200).json({ message: 'Documents uploaded successfully', seller });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ message: 'Failed to upload documents', error: error.message });
  }
};


const updateSellerApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    seller.status = "approved";
    await seller.save();

    res.status(200).json({ message: "Seller approved successfully", seller });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateSellerDisable = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    seller.status = "disabled";
    await seller.save();

    res.status(200).json({ message: "Seller approved successfully", seller });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    await seller.deleteOne();
    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateSellerProfile = async(req,res)=>{
  try{
    const seller = await Seller.findByIdAndUpdate(
      req.user.userId,
      { ...req.body },
      { new: true }
    );
    res.status(200).json({ seller });

  }
  catch(err){
        res.status(500).json({ message: 'Failed to update seller profile.' });

  }
}

module.exports = {getAllSellers , deleteSeller , updateSellerApproval , registerSeller , uploadSellerDocuments , updateSellerDisable, updateSellerProfile}
