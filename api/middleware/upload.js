// middleware/multer.js
const multer = require('multer');

const storage = multer.memoryStorage(); // Store in memory (no disk)
const upload = multer({ storage });

module.exports = upload;
