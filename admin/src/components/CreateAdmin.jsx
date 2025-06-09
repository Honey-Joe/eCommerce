import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import { toast } from "react-toastify";

const CreateAdminForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roleId: "",
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get("/roles");
        setRoles(res.data || []);
        console.log(res.data)
      } catch (err) {
        toast.error("Failed to fetch roles");
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, roleId } = formData;
    if (!name || !email || !password || !roleId) {
      toast.error("Please fill all required fields.");
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
        roleId: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create admin."
      );
      console.log(error)
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

        {/* Role Dropdown */}
        <div className="mb-3">
          <label className="block font-medium mb-1" htmlFor="roleId">
            Select Role <span className="text-red-600">*</span>
          </label>
          <select
            id="roleId"
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Select Role --</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
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
