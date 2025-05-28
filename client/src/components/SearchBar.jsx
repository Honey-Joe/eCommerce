import { useDispatch, useSelector } from "react-redux";
import {
  setKeyword,
  fetchSearchResults,
  fetchTopSearched,
} from "../features/search/searchSlice";
import { useEffect, useState } from "react";
import axiosInstance from "../axios";
import { fetchProductById } from "../features/products/productSlice";
import { Link, useNavigate } from "react-router-dom";

export default function SearchBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleProductClick = (id) => {
  navigate(`/product/${id}`);
};
  const { keyword, results, loading, topProducts, topCategories } = useSelector(
    (state) => state.search
  );
  const { product } = useSelector((state) => state.products);
  console.log("Product from search bar:", product);
  const [input, setInput] = useState("");
  console.log("SearchBar rendered with keyword:", results);
  console.log(topProducts, topCategories);

  const handleResultClick = async (item) => {
    try {
      await axiosInstance.post("/search/increment", {
        name: item.name,
        type: item.price ? "product" : "category", // assuming products have price
      });
      console.log("Search count incremented");
    } catch (err) {
      console.error("Failed to increment search count", err);
    }
  };

  useEffect(() => {
    dispatch(fetchTopSearched());
    dispatch(fetchProductById(topProducts[0]?.productId || ""));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch(fetchSearchResults(input.trim()));
    }
  };

  return (
    <div className="p-4">
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 max-w-md mx-auto"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search products or categories..."
          className="w-full border rounded-xl px-4 py-2 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center mt-4">Loading...</p>}

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Search Results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {results?.some((item) => item.price) && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {results
                  .filter((item) => item.price)
                  .map((item, i) => (
                    <div
                      key={`product-${i}`}
                      onClick={() => handleResultClick(item)}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer p-4 border hover:border-blue-500"
                    >
                      <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-3">
                        <img
                          src={item?.images?.[0]?.url}
                          alt={item.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-blue-600 font-bold text-md">
                          ₹{item.price}
                        </p>
                        {item.description && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {results?.some((item) => !item.price) && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Categories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {results
                  .filter((item) => !item.price)
                  .map((item, i) => (
                    <div
                      key={`category-${i}`}
                      onClick={() => handleResultClick(item)}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer p-4 border hover:border-orange-500"
                    >
                      <div className="w-full h-32 bg-orange-100 rounded-xl flex items-center justify-center text-orange-700 font-semibold text-lg">
                        {item.name}
                      </div>
                      <p className="text-gray-500 text-sm mt-2 text-center">
                        Tap to explore products in this category
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div>
          <h3 className="font-semibold text-md text-gray-800">Top Products</h3>
          <ul className="mt-2 list-decimal ml-5 text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                      src={item?.images?.map((e) => e.url)[0]}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div>
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
                </div>
                
              
              ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-md text-gray-800">
            Top Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
      </div>
    </div>
  );
}
