import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProducts } from "../../features/products/productSlice";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import SearchBar from "../../components/SearchBar";
import AsyncSelect from "react-select/async";
import axiosInstance from "../../axios";

export default function SellerHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const handleSelect = (selected) => {
    setSelectedOption(selected);
    if (!selected) return;

    navigate(
  `/seller/results/search?query=${encodeURIComponent(selected.name)}&type=${selected.type}`
);

  };

  const { products, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  console.log(products);

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchSellerProducts(user?.userId));
    }
  }, [dispatch, user?.userId]);
  const loadOptions = async (inputValue) => {
    if (!inputValue.trim()) return [];

    try {
      const res = await axiosInstance.get(
        `/search/seller/suggestions?query=${inputValue}&sellerId=${user?.userId}`
      );

      const products = res.data.products || [];
      const categories = res.data.categories || [];

      const formattedProducts = products.map((p) => ({
        label: `🛍️ ${p.name}`,
        name: p.name,
        value: p._id,
        type: "product",
      }));

      const formattedCategories = categories.map((c) => ({
        label: `📂 ${c.name}`,
        name: c.name,
        value: c._id,
        type: "category",
      }));

      return [...formattedProducts, ...formattedCategories];
    } catch (err) {
      console.error("Failed to load suggestions:", err);
      return [];
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  

  return (
    <Layout>
      <div className="w-[80%] mx-auto py-6">
        <div className="max-w-md mx-auto">
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            value={selectedOption}
            onChange={handleSelect}
            placeholder="Search products or categories..."
            inputValue={inputValue}
            onInputChange={(value) => setInputValue(value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (inputValue.trim()) {
                  navigate(
                    `/seller/results/search?query=${encodeURIComponent(
                      inputValue.trim()
                    )}&type=all`
                  );
                }
              }
            }}
            classNames={{
              control: () => "rounded-xl border px-2 py-1",
              input: () => "py-1",
            }}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Products</h2>

        {loading && <p className="text-center">Loading your products...</p>}

        {!loading && products?.length === 0 && (
          <p className="text-center text-gray-600">
            You haven’t added any products yet.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer p-4 border hover:border-blue-500"
            >
              <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-3">
                <img
                  src={product?.images?.[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {product.name}
              </h3>
              <p className="text-blue-600 font-bold text-md">
                ₹{product.price}
              </p>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
