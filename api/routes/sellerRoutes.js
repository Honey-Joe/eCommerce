const express = require('express');
const router = express.Router();
const { uploadSellerDocuments, updateSellerProfile } = require('../controllers/sellerController');
const {  sellerAuth } = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Register new seller

// Upload seller documents (requires login)
router.post(
  '/upload-documents',
  sellerAuth,
  upload.array('documents', 5), // Accept up to 5 files
  uploadSellerDocuments
);

router.put("/profile",sellerAuth,updateSellerProfile);
module.exports = router;
