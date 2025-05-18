import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../features/products/productSlice";
import { toast } from "react-toastify";
import { places } from "../../data/places";
import axiosInstance from "../../axios";

const AddProductForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.products);

  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [extraFields, setExtraFields] = useState({});
  const [coordinates, setCoordinates] = useState([]);
  const [media, setMedia] = useState({ images: [] });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    isFeatured: false,
    location: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get("/categories");
        setCategories(data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const selected = categories.find((cat) => cat.name === formData.category);
    if (selected) {
      setAttributes(selected.attributes || []);
    } else {
      setAttributes([]);
    }
  }, [formData.category, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "location") {
      const place = places.find((p) => p.name === value);
      if (place) {
        setCoordinates([place.longitude, place.latitude]);
      } else {
        setCoordinates([]);
      }
    }
  };

  const handleMediaChange = (e, type) => {
    const files = Array.from(e.target.files);
    setMedia((prev) => ({
      ...prev,
      [type]: [...prev[type], ...files],
    }));
  };

  const handleExtraFieldChange = (name, value) => {
    setExtraFields((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return toast.error("Please select a valid location before submitting.");
  }

  const data = new FormData();
  Object.entries(formData).forEach(([key, val]) => data.append(key, val));
  data.append("longitude", coordinates[0]);
  data.append("latitude", coordinates[1]);

  // ✅ Fix: Send attributes as JSON string
  data.append("attributes", JSON.stringify(extraFields));

  // Upload media
  media.images.forEach((img) => data.append("images", img));

  await dispatch(addProduct(data));

  // Reset form
  setFormData({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    isFeatured: false,
    location: "",
  });
  setCoordinates([]);
  setAttributes([]);
  setExtraFields({});
  setMedia({ images: [] });
};

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto mt-10 space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Add Product
      </h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 border rounded-xl"
        required
      />


      <textarea
        name="description"
        placeholder="Product Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-3 border rounded-xl"
        required
      />

      <input
        name="price"
        placeholder="Product price"
        value={formData.price}
        onChange={handleChange}
        className="w-full p-3 border rounded-xl"
        required
      />

      <div>
        <label className="block mb-1 font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        >
          <option value="">-- Select a Category --</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {attributes.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {attributes.map((attr, index) => (
            <div key={index}>
              <label className="block font-medium">{attr.name}</label>
              {attr.type === "text" && (
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    handleExtraFieldChange(attr.name, e.target.value)
                  }
                />
              )}
              {attr.type === "number" && (
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    handleExtraFieldChange(attr.name, e.target.value)
                  }
                />
              )}
              {attr.type === "dropdown" && (
                <select
                  className="w-full p-2 border rounded"
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

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          className="p-3 border rounded-xl"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="p-3 border rounded-xl"
          required
        />
      </div>

      <label className="flex items-center space-x-2 text-gray-600">
        <input
          type="checkbox"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
        />
        <span>Mark as Featured</span>
      </label>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Select Location
        </label>
        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        >
          <option value="">-- Select a Location --</option>
          {places.map((place) => (
            <option key={place.name} value={place.name}>
              {place.name}
            </option>
          ))}
        </select>
        {coordinates.length === 2 && (
          <p className="text-sm text-gray-500 mt-1">
            Coordinates: Longitude {coordinates[0]}, Latitude {coordinates[1]}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Upload Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleMediaChange(e, "images")}
          className="block w-full text-sm"
        />
        <div className="flex flex-wrap mt-2 gap-2">
          {media.images.map((file, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
