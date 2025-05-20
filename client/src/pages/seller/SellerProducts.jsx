import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductById,
  fetchSellerProducts,
  isSoldProductById,
  removeSellerProduct,
  setIssoldStatus,
  setProductError,
  setProductLoading,
} from "../../features/products/productSlice";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion } from "framer-motion";

import { Carousel } from "react-responsive-carousel";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const SellerProducts = ({ sellerId }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (sellerId) dispatch(fetchSellerProducts(sellerId));
  }, [dispatch, sellerId]);

  

  // Group products by their status
  const groupedProducts = products.reduce((acc, product) => {
    const status = product.status || "Unknown";
    if (!acc[status]) acc[status] = [];
    acc[status].push(product);
    return acc;
  }, {});

  // Optional: Display in a fixed order
  const statusOrder = ["Approved", "Pending", "Disabled", "DisabledByAdmin"];

  return (
    <div className="">
      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {statusOrder.map(
        (status) =>
          groupedProducts[status]?.length > 0 && (
            <div key={status} className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-blue-700">
                {status} Products
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {groupedProducts[status].map((product) => (
                  <motion.div
                    key={product._id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white border border-gray-200 p-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 relative"
                  >
                    <Carousel
                      showArrows
                      showThumbs={false}
                      infiniteLoop
                      autoPlay
                      interval={3000}
                      className="rounded-xl overflow-hidden"
                    >
                      {product.images.map((image, index) => (
                        <div key={index} className="relative h-56 sm:h-64">
                          <img
                            src={image.url}
                            alt={image.alt || product.name}
                            className="object-cover h-full w-full"
                          />
                        </div>
                      ))}
                    </Carousel>

                    <div className="mt-4 space-y-1">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {product.description}
                      </p>
                      <p className="text-blue-600 font-bold text-md">
                        ₹{product.price}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-1 text-xs rounded-full font-medium ${
                          product.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : product.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {/* View button */}
                      <Link to={`/product/${product._id}`} className="block">
                        <button className="w-full py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition">
                          View
                        </button>
                      </Link>

                      
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default SellerProducts;
