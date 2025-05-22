// middleware/adminOrSellerAuth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your_admin_jwt_secret';

const adminOrSellerAuth = (req, res, next) => {
  const userToken = req.cookies.token;
  const adminToken = req.cookies.adminToken;

  let decoded;

  try {
    if (adminToken) {
      decoded = jwt.verify(adminToken, ADMIN_JWT_SECRET);
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: not an admin' });
      }
    } else if (userToken) {
      decoded = jwt.verify(userToken, JWT_SECRET);
      if (decoded.role !== 'seller') {
        return res.status(403).json({ message: 'Access denied: not a seller' });
      }
    } else {
      return res.status(401).json({ message: 'No token found, unauthorized' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = adminOrSellerAuth;
