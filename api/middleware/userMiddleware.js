const { verifyToken, authorizeRoles } = require('./authMiddleware');

// Combined middleware for user routes
const userAuth = [
  verifyToken,
  authorizeRoles('user'),
];

module.exports = userAuth;
