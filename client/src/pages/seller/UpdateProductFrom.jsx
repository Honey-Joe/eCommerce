import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateProductById,
  setProductLoading,
  setProductError,
} from "../../features/products/productSlice";
import { toast } from "react-toastify";

const UpdateProductForm = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: product.name || "",
    price: product.price || "",
    description: product.description || "",
    brand: product.brand || "",
    stock: product.stock || 0,
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  console.log(images)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      dispatch(setProductLoading(true));

      const updatedForm = new FormData();
      updatedForm.append("name", formData.name);
      updatedForm.append("price", formData.price);
      updatedForm.append("description", formData.description);
      updatedForm.append("brand", formData.brand);
      updatedForm.append("stock", formData.stock);

      images.forEach((image) => {
        updatedForm.append("images", image);
        
      });
      await dispatch(updateProductById({ id: product._id, data: updatedForm }));
      toast.success("Product updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      dispatch(setProductError(err.message || "Update failed"));
      toast.error("Update failed");
    } finally {
      dispatch(setProductLoading(false));
    }
  };

  return (
    <div className="p-4 w-full max-w-lg bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Update Product</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        {/* File Input */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border rounded px-3 py-2"
        />

        {/* Preview Images */}
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previewUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Preview ${idx}`}
                className="h-24 w-full object-cover rounded"
              />
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductForm;
