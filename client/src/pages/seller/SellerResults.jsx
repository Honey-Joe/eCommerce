import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchSellerSearchResults,
} from "../../features/search/searchSlice";
import Layout from "../../layouts/Layout";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const SellerResults = () => {
  const dispatch = useDispatch();
  const query = useQuery();
  const {user} = useSelector((state) => state.auth);
  console.log("User:", user.userId);
  const keyword = query.get("query");
  const sellerId = user.userId; // Make sure this is passed in URL
  const type = query.get("type");

  const { results, loading, error } = useSelector((state) => state.search);
 
    const navigate = useNavigate();


  useEffect(() => {
    if (keyword && sellerId) {
      dispatch(fetchSellerSearchResults(keyword, sellerId));
    }
  }, [keyword, sellerId, dispatch]);
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Layout>
      <div className="w-[80%] mx-auto py-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Search Results for: "<span className="text-blue-600">{keyword}</span>"
        </h2>

        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {error && (
          <p className="text-center text-red-600">Error: {error}</p>
        )}

        {!loading && results.length === 0 && (
          <p className="text-center text-gray-500">No products found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="bg-white rounded-xl shadow p-4 border hover:border-blue-500 cursor-pointer"
            >
              <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-3">
                <img
                  src={product?.images?.[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {product.name}
              </h3>
              <p className="text-blue-600 font-bold">₹{product.price}</p>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SellerResults;
