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
    const { name, email, password, businessName, storeLocation, location } = req.body;

    // Check for existing seller
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Parse and validate location
    let geoLocation = null;
    if (location) {
      try {
        const parsed = JSON.parse(location); // expecting { latitude, longitude }

        if (!parsed.latitude || !parsed.longitude) {
          return res.status(400).json({ message: 'Latitude and longitude are required in location' });
        }

        geoLocation = {
          type: "Point",
          coordinates: [parsed.longitude, parsed.latitude], // GeoJSON format: [lng, lat]
        };
      } catch (err) {
        return res.status(400).json({ message: 'Invalid location format' });
      }
    }

    const newSeller = new Seller({
      name,
      email,
      password,
      businessName,
      storeLocation,
      location: geoLocation,
      documents: [],
    });

    await newSeller.save();

    res.status(201).json({
      message: 'Seller registered successfully',
      user: newSeller,
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};





const uploadSellerDocuments = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No documents uploaded' });
    }

    // Parse expiryDates from JSON string
    let parsedExpiryDates = {};
    if (req.body.expiryDates) {
      try {
        parsedExpiryDates = JSON.parse(req.body.expiryDates);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid expiryDates format' });
      }
    }

    // Upload to Cloudinary
    const uploadedDocs = await uploadToCloudinary(req.files, 'seller-documents');

    // Take only the first uploaded document (since schema is not an array anymore)
    const firstDoc = uploadedDocs[0];
    const documentToStore = {
      url: firstDoc.url,
      expiry: parsedExpiryDates[firstDoc.originalname]
        ? new Date(parsedExpiryDates[firstDoc.originalname])
        : null,
    };

    // Update Seller
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    seller.documents = documentToStore; // overwrite the document object
    seller.status = 'pending';
    await seller.save();

    // Disable all unsold products
    const products = await Product.find({ seller: sellerId });
    await Promise.all(
      products.map((product) => {
        product.status = product.isSold ? 'Approved' : 'Disabled';
        return product.save();
      })
    );

    res.status(200).json({
      message: 'Document uploaded and statuses updated',
      seller,
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      message: 'Server error during document upload',
      error: error.message,
    });
  }
};



const updateSellerApproval = async (req, res) => {
  try {
    const { id } = req.params;

    // Find seller
    const seller = await Seller.findById(id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    // Update seller status
    seller.status = "approved";
    await seller.save();

    // Approve only products that are Pending and not sold
    const updatedProducts = await Product.updateMany(
      {
        seller: id,
        status: "Disabled",
        isSold: false
      },
      {
        $set: { status: "Approved" }
      }
    );

    res.status(200).json({
      message: "Seller approved successfully",
      seller,
      updatedProductCount: updatedProducts.modifiedCount
    });

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

    const updatedProducts = await Product.updateMany(
      {
        seller: id,
        status: "Approved",
        isSold: false
      },
      {
        $set: { status: "Disabled" }
      }
    );

    res.status(200).json({ message: "Seller approved successfully", seller ,updatedCount:updatedProducts.modifiedCount });
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
