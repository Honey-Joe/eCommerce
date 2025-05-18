// cron/documentExpiryChecker.js
const cron = require('node-cron');
const Seller = require('../models/Seller'); // adjust the path if needed

// Runs every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('⏰ Checking for expired seller documents...');

  try {
    const now = new Date();
    const sellers = await Seller.find({});

    for (const seller of sellers) {
      const documents = Array.isArray(seller.documents) ? seller.documents : [seller.documents];
      const hasExpired = documents.some((doc) => doc.expiry && new Date(doc.expiry) < now);

      if (hasExpired && seller.status !== 'pending') {
        seller.status = 'pending';
        await seller.save();
        console.log(`✅ Seller ${seller.email} set to pending due to expired document.`);
      }
    }

    console.log('✅ Seller document expiry check completed.');
  } catch (err) {
    console.error('❌ Error checking document expiries:', err);
  }
});
