const express = require('express');
const router = express.Router();
const { loginAdmin, adminLogout, getAdminProfile, updateAdminPermissions, getAllAdmins, createAdmin} = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');
const { getAllUsers } = require('../controllers/userController');
const { getAllSellers, updateSellerApproval, deleteSeller, updateSellerDisable } = require('../controllers/sellerController');
const authorizePermissions = require('../middleware/authorizePermissions');

// Admin login route
router.post('/login', loginAdmin);
router.post('/logout', adminMiddleware, adminLogout);

// Protected admin-only route
router.get('/dashboard', adminMiddleware, (req, res) => {
  res.status(200).json({ message: 'Welcome Admin! Protected dashboard access granted.' });
});

router.get("/me", adminMiddleware, getAdminProfile);


router.get('/users' ,adminMiddleware, getAllUsers);      // GET /api/admin/users
router.get('/sellers',adminMiddleware, getAllSellers);  
router.put("/seller/:id/approve", adminMiddleware, updateSellerApproval);
router.put("/seller/:id/disable", adminMiddleware, updateSellerDisable);

router.delete("/seller/:id",adminMiddleware, deleteSeller);
router.post(
  "/create-admin",
  adminMiddleware,
  authorizePermissions(["role:manage"]),
  createAdmin
);

// GET ALL ADMINS
router.get(
  "/admins",
  adminMiddleware,
  authorizePermissions(["role:manage"]),
  getAllAdmins
);

// UPDATE ADMIN PERMISSIONS
router.put(
  "/admins/:adminId/permissions",
  adminMiddleware,
  authorizePermissions(["role:manage"]),
  updateAdminPermissions
);



module.exports = router;
