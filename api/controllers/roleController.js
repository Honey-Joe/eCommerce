const Role = require('../models/Role');

// Create Role
exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const existing = await Role.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Role already exists' });

    const role = await Role.create({
      name,
      permissions,
      createdBy: req.user.userId,
    });

    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all Roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate('createdBy', 'name email');
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Role
exports.updateRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, permissions },
      { new: true }
    );

    if (!role) return res.status(404).json({ message: 'Role not found' });

    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Role
exports.deleteRole = async (req, res) => {
  try {
    const deleted = await Role.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Role not found' });

    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
