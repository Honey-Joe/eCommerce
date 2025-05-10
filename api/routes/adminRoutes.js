const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin, adminLogout, getAllSellers, getAllUsers, getAdminProfile} = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Admin login route
router.post('/login', loginAdmin);
router.post('/register', adminMiddleware, registerAdmin);
router.post('/logout', adminMiddleware, adminLogout);

// Protected admin-only route
router.get('/dashboard', adminMiddleware, (req, res) => {
  res.status(200).json({ message: 'Welcome Admin! Protected dashboard access granted.' });
});

router.get("/me", adminMiddleware, getAdminProfile);


router.get('/users' , getAllUsers);      // GET /api/admin/users
router.get('/sellers', getAllSellers);  



module.exports = router;
