const Admin = require('../models/Admin');

module.exports = function authorizePermissions(requiredPermissions = []) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized: Missing user info" });
      }

      const admin = await Admin.findById(userId).populate({
        path: 'role',
        select: 'name permissions',
      });

      if (!admin) {
        return res.status(403).json({ error: "Unauthorized: Admin not found" });
      }

      if (!admin.role) {
        return res.status(403).json({ error: "Unauthorized: No role assigned" });
      }

      if (admin.role.name === 'super-admin') {
        return next(); // super-admin bypass
      }

      const rolePermissions = admin.role.permissions || [];

      const hasAccess = requiredPermissions.every((perm) =>
        rolePermissions.includes(perm)
      );

      if (!hasAccess) {
        return res.status(403).json({
          error: "Forbidden: You do not have required permissions",
          requiredPermissions,
          yourPermissions: rolePermissions,
        });
      }

      next();
    } catch (err) {
      console.error("Authorization error:", err);
      return res.status(500).json({
        error: "Authorization error",
        message: err.message,
      });
    }
  };
};
