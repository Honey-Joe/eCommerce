import { useDispatch, useSelector } from "react-redux";
import {
  fetchRelatedByCategoryId,
  fetchSearchResults,
  fetchTopSearched,
} from "../features/search/searchSlice";
import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import axiosInstance from "../axios";
import { fetchProductById } from "../features/products/productSlice";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { results, loading, topProducts, topCategories, productByCategory } = useSelector(
    (state) => state.search
  );

    console.log(productByCategory)
  // Grab first categoryId safely
  const categoryId = topCategories?.[0]?._id || "";
  console.log(categoryId)

  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    dispatch(fetchTopSearched());
    if (topProducts?.[0]?.productId) {
      dispatch(fetchProductById(topProducts[0].productId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchRelatedByCategoryId(categoryId));
    }
  }, [dispatch, categoryId]);

  // Fetch suggestions from backend
  const loadOptions = async (inputValue) => {
    if (!inputValue.trim()) return [];

    try {
      const res = await axiosInstance.get(
        `/search/suggestions?query=${inputValue}`
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
  // Handle select suggestion
  const handleSelect = (selected) => {
    setSelectedOption(selected);
    if (!selected) return;

    navigate(
      `/search?query=${encodeURIComponent(selected.name)}&type=${selected.type}`
    );
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="p-4">
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
                  `/search?query=${encodeURIComponent(
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

      {loading && <p className="text-center mt-4">Loading...</p>}

      {/* === TOP SEARCHED === */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        {/* Top Products */}
        <div>
          <h3 className="font-semibold text-md text-gray-800">Top Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
            {[...topProducts]
              .sort((a, b) => b.count - a.count)
              .map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleProductClick(item._id)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer p-4 border hover:border-blue-500"
                >
                  <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-3">
                    <img
                      src={item?.images?.[0]?.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {item.name}
                  </h3>
                  {item.price && (
                    <p className="text-blue-600 font-bold text-md">
                      ₹{item.price}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Top Categories */}
        <div>
          <h3 className="font-semibold text-md text-gray-800">
            Top Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {[...topCategories]
              .sort((a, b) => b.count - a.count)
              .map((item, i) => (
                <div
                  key={i}
                  className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg border hover:border-blue-500 transition-all"
                >
                  <h4 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Searches: {item.count}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Related Products by First Category */}
        {productByCategory?.length > 0 && (
          <div>
            <h3 className="font-semibold text-md text-gray-800 mt-8">
              Products in "{topCategories?.[0]?.name}"
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {productByCategory.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer p-4 border hover:border-blue-500"
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
                  {product.price && (
                    <p className="text-blue-600 font-bold text-md">
                      ₹{product.price}
                    </p>
                  )}
                  {product.description && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
