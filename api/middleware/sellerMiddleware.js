const { verifyToken, authorizeRoles } = require('./authMiddleware');

// Combined middleware for seller routes
const sellerAuth = [
  verifyToken,
  authorizeRoles('seller'),
];

module.exports = sellerAuth;
