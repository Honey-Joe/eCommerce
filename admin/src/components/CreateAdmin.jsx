import React, { useState } from "react";
import axiosInstance from "../axios";
import { toast } from "react-toastify";

const permissionsList = [
  { key: "user-management", label: "User Management" },
  { key: "seller-management", label: "Seller Management" },
  { key: "product-management", label: "Product Management" },
  { key: "category-management", label: "Category Management" },
  { key: "brand-management", label: "Brand Management" },
  { key: "site-settings", label: "Site Settings" },
];

const CreateAdminForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    permissions: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionToggle = (permissionKey) => {
    setFormData((prev) => {
      const hasPermission = prev.permissions.includes(permissionKey);
      if (hasPermission) {
        return {
          ...prev,
          permissions: prev.permissions.filter((p) => p !== permissionKey),
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permissionKey],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      formData.permissions.length === 0
    ) {
      toast.error("Please fill all required fields and select at least one permission.");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/admin/create-admin", formData);
      toast.success("Admin created successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        permissions: [],
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create admin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New Admin</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-3">
          <label className="block font-medium mb-1" htmlFor="name">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="Enter name"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="block font-medium mb-1" htmlFor="email">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter email"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label className="block font-medium mb-1" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="text"
            placeholder="Enter phone number"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block font-medium mb-1" htmlFor="password">
            Password <span className="text-red-600">*</span>
          </label>
          <input
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Enter password"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Permissions */}
        <div className="mb-3">
          <label className="block font-medium mb-1">
            Permissions <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {permissionsList.map(({ key, label }) => (
              <label
                key={key}
                className="inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(key)}
                  onChange={() => handlePermissionToggle(key)}
                  className="mr-2"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
};

export default CreateAdminForm;
