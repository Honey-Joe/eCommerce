// lib/checkDocumentExpiry.js
const Seller = require('../models/Seller'); // adjust path as needed

const checkDocumentExpiry = async () => {

  try {
    const now = new Date();
    const sellers = await Seller.find({});

    for (const seller of sellers) {
      const documents = Array.isArray(seller.documents) ? seller.documents : [seller.documents];
      const hasExpired = documents.some((doc) => doc.expiry && new Date(doc.expiry) < now);

      if (hasExpired && seller.status !== 'pending') {
        seller.status = 'pending';
        await seller.save();
      }
    }

  } catch (err) {
    console.error('❌ Error checking document expiries:', err);
  }
};

module.exports = checkDocumentExpiry;
