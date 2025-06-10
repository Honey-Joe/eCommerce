import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../axios";

const UpdateAdminForm = () => {
    const {adminId} = useParams();
  const [admin, setAdmin] = useState(null);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    permissions: [],
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axiosInstance.get(`/admin/${adminId}`);
        setAdmin(res.data);
        console.log(res.data)
        setFormData({
          name: res.data.admin.name,
          email: res.data.admin.email,
          phone: res.data.admin.phone,
          role: res.data.admin.role?._id,
          permissions: res.data.permissions || [],
        });
      } catch (err) {
        toast.error("Failed to fetch admin");
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get("/roles");
        setRoles(res.data);
      } catch (err) {
        toast.error("Failed to fetch roles");
      }
    };
    fetchAdmin();
    fetchRoles();
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionToggle = (perm) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(perm);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== perm)
          : [...prev.permissions, perm],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/admin/${adminId}`, formData);
      toast.success("Admin updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const availablePermissions = [
    "user:manage",
    "seller:manage",
    "product:manage",
    "category:manage",
    "brand:manage",
    "site:manage",
    "role-management",
    "page:user",
    "page:seller",
    "page:product",
    "page:category",
    "page:brand",
    "page:settings",
    "page:roles",
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Update Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Permissions</label>
          <div className="grid grid-cols-2 gap-2">
            {availablePermissions.map((perm) => (
              <label key={perm} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(perm)}
                  onChange={() => handlePermissionToggle(perm)}
                />
                <span>{perm}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Admin
        </button>
      </form>
    </div>
  );
};

export default UpdateAdminForm;
