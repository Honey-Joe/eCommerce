const express = require('express');
const router = express.Router();

const roleController = require('../controllers/roleController');
const adminMiddleware = require('../middleware/adminMiddleware');
const authorizePermissions = require('../middleware/authorizePermissions');
const PERMISSIONS = require('../config/permission');

// Create Role - requires role management feature permission
router.post(
  '/',
  adminMiddleware,
  authorizePermissions([PERMISSIONS.ROLE_MANAGEMENT]),
  roleController.createRole
);

// Get all Roles - requires page permission to view roles page
router.get(
  '/',
  adminMiddleware,
  authorizePermissions([PERMISSIONS.PAGE_ROLES]),
  roleController.getRoles
);

// Get Role by ID
router.get(
  '/:id',
  adminMiddleware,
  authorizePermissions([PERMISSIONS.PAGE_ROLES]),
  roleController.getRoleById
);

// Update Role - requires role management feature permission
router.put(
  '/:id',
  adminMiddleware,
  authorizePermissions([PERMISSIONS.ROLE_MANAGEMENT]),
  roleController.updateRole
);

// Delete Role
router.delete(
  '/:id',
  adminMiddleware,
  authorizePermissions([PERMISSIONS.ROLE_MANAGEMENT]),
  roleController.deleteRole
);

module.exports = router;
