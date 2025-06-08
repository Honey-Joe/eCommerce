module.exports = function authorizePermissions(requiredPermissions = []) {
  return (req, res, next) => {
    if (req.user.role === 'super-admin') return next();

    const userPermissions = req.user.permissions || [];
    const hasAccess = requiredPermissions.every(p => userPermissions.includes(p));

    if (!hasAccess) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};
