// src/pages/UserCategory.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRelatedByCategoryId } from "../../features/search/searchSlice";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layouts/Layout";

const UserCategory = () => {
  const dispatch = useDispatch();
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Access only the specific state from searchSlice
  const { productByCategory, loading, error } = useSelector(
    (state) => state.search
  );
  const handleProductClick = (productId) => {
    navigate(`/user/productdetails/${productId}`);
  };
  const categoryName = productByCategory?.[0]?.category || "";

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchRelatedByCategoryId(categoryId));
    }
  }, [dispatch, categoryId]);

  return (
    <Layout>
      <div className="w-[80%] mx-auto py-4">
        <h2 className="text-xl font-bold mb-2">Products in {categoryName}</h2>

        {/* Loader */}
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* Category-wise Products Section */}
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productByCategory?.length > 0 ? (
              productByCategory.map((item, i) => (
                <div
                  onClick={() => handleProductClick(item._id)}
                  key={i}
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
              ))
            ) : (
              <p className="text-gray-500">
                No products found for this category.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserCategory;
