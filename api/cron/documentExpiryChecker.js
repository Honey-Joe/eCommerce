const cron = require('node-cron');
const Seller = require('../models/Seller'); // adjust path if needed
const Product = require('../models/Product');
const connectDB = require('../config/db'); // adjust path if needed

// Runs every minute (for testing; use '0 0 * * *' for daily at midnight)
cron.schedule('* * * * *', async () => {
  console.log('⏰ Running daily document expiry check...');

  try {
    const now = new Date();
    const sellers = await Seller.find({});

    for (const seller of sellers) {
      const documents = Array.isArray(seller.documents) ? seller.documents : [seller.documents];
      const hasExpired = documents.some(doc => doc.expiry && new Date(doc.expiry) < now);

      // Find all products by this seller
      const products = await Product.find({ seller: seller._id });

      // If seller has expired documents
      if (hasExpired && seller.status !== 'disabled') {
        seller.status = 'disabled';
        await seller.save();

        // Disable all products of the seller
        for (const product of products) {
          product.status = 'Disabled';
          await product.save();
        }

        console.log(`🔄 Seller ${seller.email} disabled due to expired document.`);
      }

      // Extra check: disable unsold products of disabled sellers
      if (seller.status === 'disabled') {
        for (const product of products) {
          if (!product.isSold && product.status !== 'Disabled') {
            product.status = 'Disabled';
            await product.save();
            console.log(`⚠️ Product ${product._id} disabled (unsold & seller disabled).`);
          }
        }
      }
    }

    console.log('✅ Document expiry check completed.');
  } catch (err) {
    console.error('❌ Error in document expiry cron:', err);
  }
});
