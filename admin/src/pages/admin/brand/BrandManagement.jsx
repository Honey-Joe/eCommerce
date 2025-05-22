import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBrand,
  changeBrandStatus,
  fetchBrands,
  removeBrand,
} from "../../../features/admin/brandSlice";
import axiosInstance from "../../../axios";

const BrandManagement = () => {
  const dispatch = useDispatch();
  const { brands, loading, error } = useSelector((state) => state.brand);

  const [form, setForm] = useState({ name: "", description: "", logo: null });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setForm({ ...form, logo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const handleStatusChange = (id, newStatus) => {
      dispatch(changeBrandStatus(id, newStatus));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    if (form.logo) {
      formData.append("logo", form.logo); // Match backend key
    }

    try {
      const res = await axiosInstance.post("/brands", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(addBrand(res.data)); // Only dispatch clean response
      setForm({ name: "", description: "", logo: null }); // Reset form
    } catch (err) {
      console.error("Brand creation failed:", err);
    }
  };
  

  const handleEdit = (brand) => {
    setEditId(brand._id);
    setForm({ name: brand.name, description: brand.description, logo: null });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      dispatch(removeBrand(id));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {editId ? "Edit" : "Add"} Brand
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border p-4 rounded bg-white shadow"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Brand Name"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          name="logo"
          onChange={handleChange}
          accept="image/*"
          className="w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editId ? "Update" : "Create"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-2">Brand List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
       <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Brand Management</h2>
      {loading ? (
        <p className="text-blue-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Brand Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {brands.map((brand, index) => (
                <tr key={brand._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{brand.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        brand.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : brand.status === 'disabled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {brand.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(brand._id, 'approved')}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(brand._id, 'disabled')}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Disable
                    </button>
                    <button
                      onClick={() => handleDelete(brand._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No brands found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
      )}
    </div>
  );
};

export default BrandManagement;
