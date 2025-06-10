const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  adminLogout,
  getAdminProfile,
  getAllAdmins,
  createAdmin,
  deleteAdmin,
  updateAdmin,
  getAdminById,
} = require("../controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getAllSellers,
  updateSellerApproval,
  deleteSeller,
  updateSellerDisable,
} = require("../controllers/sellerController");
const authorizePermissions = require("../middleware/authorizePermissions");
const { getAllUsers } = require("../controllers/userController");

// Admin login route
router.post("/login", loginAdmin);
router.post("/logout", adminMiddleware, adminLogout);

// Protected admin-only route
router.get("/dashboard", adminMiddleware, (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome Admin! Protected dashboard access granted." });
});

router.get("/me", adminMiddleware, getAdminProfile);

router.get("/users", adminMiddleware, getAllUsers); // GET /api/admin/users
router.get("/sellers", adminMiddleware, getAllSellers);
router.put("/seller/:id/approve", adminMiddleware, updateSellerApproval);
router.put("/seller/:id/disable", adminMiddleware, updateSellerDisable);

router.delete("/seller/:id", adminMiddleware, deleteSeller);
router.post(
  "/create-admin",
  adminMiddleware,
  authorizePermissions(["role:manage"]),
  createAdmin
);

router.delete("/:id", adminMiddleware, deleteAdmin);

// GET ALL ADMINS
router.get(
  "/get-admins",
  adminMiddleware,
  authorizePermissions(["role:manage"]),
  getAllAdmins
);

// UPDATE ADMIN PERMISSIONS
router.put(
  "/:adminId",
  adminMiddleware,
  authorizePermissions(["role:manage"]),
  updateAdmin
);
router.get("/:adminId",adminMiddleware, getAdminById);

module.exports = router;
