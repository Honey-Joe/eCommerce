// routes/cronRoutes.js
const express = require('express');
const router = express.Router();
const checkDocumentExpiry = require('../cron/documentExpiryChecker');
const connectDB = require('../config/db');
router.get('/trigger-document-check', async (req, res) => {
  try {
    await connectDB();
    await checkDocumentExpiry();
    res.status(200).json({ message: 'Document expiry check completed.' });
  } catch (error) {
    console.error('Cron error:', error);
    res.status(500).json({ message: 'Cron job failed.' });
  }
});

module.exports = router;
