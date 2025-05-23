import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  fetchParentProducts,
} from "../../features/products/productSlice";
import { toast } from "react-toastify";
import { places } from "../../data/places";
import axiosInstance from "../../axios";
import Select from "react-select";

import { createBrand, fetchBrands } from "../../features/products/brandSlice";

const initialFormData = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  isFeatured: false,
  location: "",
};

const AddProductForm = () => {
  const dispatch = useDispatch();
  const { parentProducts, loading, error } = useSelector(
    (state) => state.products
  );
  const [imagePreviews, setImagePreviews] = useState([]);

  const { brands } = useSelector((state) => state.brands);
  const [customBrand, setCustomBrand] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [extraFields, setExtraFields] = useState({});
  const [coordinates, setCoordinates] = useState([]);
  const [media, setMedia] = useState({ images: [] });

  const [formData, setFormData] = useState(initialFormData);

  const [isVariant, setIsVariant] = useState(false);
  const [parentProduct, setParentProduct] = useState(null);
  console.log("Parent Product:", parentProduct);
  useEffect(() => {
    dispatch(fetchParentProducts());
  }, [dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get("/categories");
        setCategories(data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    dispatch(fetchBrands());
    fetchCategories();
  }, [dispatch]);

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setSelectedBrand(value);
    if (value !== "Other") setCustomBrand("");
  };

  useEffect(() => {
    const selected = categories.find((cat) => cat.name === formData.category);
    setAttributes(selected?.attributes || []);
  }, [formData.category, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "location") {
      const place = places.find((p) => p.name === value);
      setCoordinates(
        place ? [place.longitude, place.latitude, place.name] : []
      );
    }
  };

  const handleExtraFieldChange = (name, value) => {
    setExtraFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e, type) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setMedia((prev) => ({
      ...prev,
      [type]: [...prev[type], ...files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Array.isArray(coordinates) || coordinates.length !== 3) {
      return toast.error("Please select a valid location before submitting.");
    }

    let brandToSubmit = selectedBrand;

    if (selectedBrand === "Other") {
      if (!customBrand.trim()) {
        return toast.error("Please enter a brand name.");
      }

      try {
        const resultAction = await dispatch(createBrand(customBrand));
        brandToSubmit = resultAction.name;
      } catch (err) {
        console.error("Brand creation error:", err);
        return toast.error("Failed to create brand.", err);
      }
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    data.append("longitude", coordinates[0]);
    data.append("latitude", coordinates[1]);
    data.append("place", coordinates[2]);
    data.append("brand", brandToSubmit);
    data.append("attributes", JSON.stringify(extraFields));
    media.images.forEach((img) => data.append("images", img));
    if (isVariant && parentProduct?.value) {
      data.append("parentProduct", parentProduct.value);
      data.append("isVariant", true);
    }
    console.log(data);
    await dispatch(addProduct(data));

    setFormData(initialFormData);
    setCoordinates([]);
    setAttributes([]);
    setExtraFields({});
    setMedia({ images: [] });
    setSelectedBrand("");
    setCustomBrand("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow-lg max-w-md w-full mx-auto space-y-4 border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-center text-gray-800">
        Add Product
      </h2>
      <label className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
        <input
          type="checkbox"
          checked={isVariant}
          onChange={() => setIsVariant((prev) => !prev)}
          className="accent-blue-600"
        />
        <span>Is Variant?</span>
      </label>

      {isVariant && (
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Parent Product
          </label>
          <Select
            options={parentProducts.map((prod) => ({
              label: prod.name,
              value: prod._id,
              category: prod.category,
              brand: prod.brand,
            }))}
            onChange={(selected) => {
              setParentProduct(selected);

              // Auto-fill logic
              setFormData((prev) => ({
                ...prev,
                category: selected.category,
                name: selected.label + " Variant",
                description: "", // optionally clear or fetch from parent
                price: "",
                stock: "",
                isFeatured: false,
              }));

              setSelectedBrand(selected.brand);
              setCustomBrand("");

              const selectedCategory = categories.find(
                (cat) => cat.name === selected.category
              );
              if (selectedCategory?.attributes) {
                setAttributes(selectedCategory.attributes);

                // Pre-fill attributes with default or empty values
                const initialExtraFields = {};
                selectedCategory.attributes.forEach((attr) => {
                  initialExtraFields[attr.name] = "";
                });
                setExtraFields(initialExtraFields);
              }
            }}
            placeholder="Search for parent product..."
            className="text-sm"
          />
        </div>
      )}

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <input
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
        required
      />

      <textarea
        name="description"
        placeholder="Product Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
        required
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brand
        </label>
        <select
          value={selectedBrand}
          onChange={handleBrandChange}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          required
        >
          <option value="">-- Select Brand --</option>
          {brands
            .filter((brand) => brand.status === "approved")
            .map((brand) => (
              <option key={brand._id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          <option value="Other">Other</option>
        </select>

        {selectedBrand === "Other" && (
          <input
            type="text"
            placeholder="Enter new brand name"
            value={customBrand}
            onChange={(e) => setCustomBrand(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm"
            required
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {attributes.length > 0 && (
        <div className="space-y-3">
          {attributes.map((attr, index) => (
            <div key={index}>
              <label className="block text-sm text-gray-700 font-medium mb-1">
                {attr.name}
              </label>
              {attr.type === "text" && (
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  onChange={(e) =>
                    handleExtraFieldChange(attr.name, e.target.value)
                  }
                />
              )}
              {attr.type === "number" && (
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  onChange={(e) =>
                    handleExtraFieldChange(attr.name, e.target.value)
                  }
                />
              )}
              {attr.type === "dropdown" && (
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  onChange={(e) =>
                    handleExtraFieldChange(attr.name, e.target.value)
                  }
                >
                  <option value="">-- Select --</option>
                  {attr.options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
        required
      />

      <label className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
        <input
          type="checkbox"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
          className="accent-blue-600"
        />
        <span>Featured</span>
      </label>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          required
        >
          <option value="">-- Select Location --</option>
          {places.map((place) => (
            <option key={place.name} value={place.name}>
              {place.name}
            </option>
          ))}
        </select>
        {coordinates.length === 3 && (
          <p className="text-xs text-gray-500 mt-1">
            Coordinates: {coordinates[0]}, {coordinates[1]}, {coordinates[2]}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleMediaChange(e, "images")}
          className="w-full text-sm"
        />

        {/* Image Preview */}
        <div className="mt-4 flex flex-wrap gap-2">
          {imagePreviews.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Preview ${index + 1}`}
              className="h-24 w-24 object-cover rounded border"
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
