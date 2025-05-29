import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRelatedByCategoryId,
  fetchSearchResults,
} from "../features/search/searchSlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import axiosInstance from "../axios";

export default function SearchPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { results, productByCategory, loading } = useSelector(
    (state) => state.search
  );

  const navigate = useNavigate();

  const query = searchParams.get("query");
  const type = searchParams.get("type"); // 'product' or 'category'

  useEffect(() => {
    if (query) dispatch(fetchSearchResults(query));
  }, [dispatch, query]);

  useEffect(() => {
    if (results?.length > 0 && results[0]?.categoryId) {
      dispatch(fetchRelatedByCategoryId(results[0].categoryId));
    }
  }, [dispatch, results]);

  const handleProductClick = async (productId, name) => {
    await axiosInstance.post("/search/increment", {
      name,
      type: "product",
    });
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = async (categoryId, name) => {
    try {
      await axiosInstance.post("/search/increment", {
        name,
        type: "category",
      });
    } catch (error) {
      console.error("Failed to increment category search:", error);
    }
  };

  // Filter out products that already appear in main results from relatedResults
  const mainProductIds = new Set(
    results.filter((item) => item.price).map((item) => item._id)
  );
  const filteredRelatedResults = productByCategory.filter(
    (item) => !mainProductIds.has(item._id)
  );

  return (
    <Layout>
      <div className="w-[80%] mx-auto py-5">
        <h1 className="text-2xl font-bold mb-4">
          Search Results for: <span className="text-blue-600">{query}</span>
        </h1>

        {loading && <p>Loading...</p>}

        {!loading && results?.length === 0 && (
          <p className="text-gray-600">No results found.</p>
        )}

        {/* Products */}
        {results?.some((item) => item.price) && (
          <>
            <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4">
              Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
              {results
                .filter((item) => item.price)
                .map((item, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(item._id, item.name);
                    }}
                  >
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl p-4 border hover:border-blue-500 transition-all cursor-pointer grid grid-cols-3">
                      <div className="w-full h-40 bg-gray-100 rounded-xl col-span-1 overflow-hidden mb-3">
                        <img
                          src={item?.images?.[0]?.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="col-span-2 flex flex-col justify-between p-2">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {item.description || "No description available"}
                        </p>
                        <p className="text-blue-600 font-bold">₹{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* Related Products */}
        {filteredRelatedResults?.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-gray-800 mt-10 mb-4">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredRelatedResults.map((item, i) => (
                <div
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    handleProductClick(item._id, item.name);
                  }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl p-4 border hover:border-green-500 transition-all cursor-pointer grid grid-cols-1"
                >
                  <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-3">
                    <img
                      src={item?.images?.[0]?.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-blue-600 font-bold">₹{item.price}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Categories */}
        {results?.some((item) => !item.price) && (
          <>
            <h2 className="text-xl font-bold text-gray-800 mt-10 mb-4">
              Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results
                .filter((item) => !item.price)
                .map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer p-4 border hover:border-orange-500"
                    onClick={() => handleCategoryClick(item._id, item.name)}
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
          </>
        )}
      </div>
    </Layout>
  );
}
