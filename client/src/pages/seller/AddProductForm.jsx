import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../../features/products/productSlice';

const AddProductForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    isFeatured: false,
  });

  const [media, setMedia] = useState({ images: []});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMediaChange = (e, type) => {
    setMedia((prev) => ({
      ...prev,
      [type]: [...prev[type], ...Array.from(e.target.files)],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));

    media.images.forEach((img) => data.append('images', img));

    dispatch(addProduct(data));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Add Product</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="text"
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

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="p-3 border rounded-xl"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="p-3 border rounded-xl"
          required
        />
      </div>

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
        <label className="block mb-1 font-medium text-gray-700">Upload Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleMediaChange(e, 'images')}
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
        {loading ? 'Submitting...' : 'Add Product'}
      </button>
    </form>
  );
};

export default AddProductForm;
