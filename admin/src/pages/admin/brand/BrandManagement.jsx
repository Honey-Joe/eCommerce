import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBrand,
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
        <div className="space-y-4">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="border p-4 rounded bg-gray-50 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{brand.name}</h3>
                <p className="text-sm">{brand.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {brand.logoUrl && (
                  <img
                    src={brand.logoUrl}
                    alt="logo"
                    className="h-10 w-10 rounded object-cover"
                  />
                )}
                <button
                  onClick={() => handleEdit(brand)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(brand._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
             
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandManagement;
