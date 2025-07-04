// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided in cookie' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: unauthorized role' });
    }
    next();
  };
};

const sellerAuth = [verifyToken, authorizeRoles('seller')];
const userAuth = [verifyToken, authorizeRoles('user')];

module.exports = {
  verifyToken,
  authorizeRoles,
  sellerAuth,
  userAuth,
};
