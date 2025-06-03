import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { motion } from "framer-motion";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Layout from "../../layouts/Layout";
import { addToCart } from "../../features/cart/cartSlice";

import {
  deleteProductById,
  fetchProductById,
  fetchVariantsByParentProductId,
  isSoldProductById,
  removeSellerProduct,
  setIssoldStatus,
  setProductError,
  setProductLoading,
} from "../../features/products/productSlice";
import { toast } from "react-toastify";
import { FiShoppingCart } from "react-icons/fi";

const UserProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { product, loading, error, variants } = useSelector(
    (state) => state.products
  );
  console.log(product);
  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product?._id) {
      dispatch(fetchVariantsByParentProductId(product._id));
    }
  }, [dispatch, product?._id]);
  const variant = variants?.variants || [];

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      dispatch(setProductLoading(true));
      await dispatch(deleteProductById(productId));
      dispatch(removeSellerProduct(productId));
      toast.success("Product Deleted Successfully");
      navigate(-1); // Go back after deletion
    } catch (err) {
      dispatch(setProductError(err.message || "Delete failed"));
      toast.error("Delete failed");
    } finally {
      dispatch(setProductLoading(false));
    }
  };

  const handleIsSoldStatus = async (productId) => {
    if (!window.confirm("Are you sure you want to mark this product as sold?"))
      return;

    try {
      dispatch(setProductLoading(true));
      await dispatch(isSoldProductById(productId));
      dispatch(setIssoldStatus(productId));
      toast.success("Product marked as Sold");
    } catch (err) {
      dispatch(setProductError(err.message || "Mark as sold failed"));
      toast.error("Mark as sold failed");
    } finally {
      dispatch(setProductLoading(false));
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-blue-600 font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-10 text-gray-500">Product not found.</div>
    );
  }
  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success("Added to cart");
  };

  return (
    <Layout>
      <motion.div
        className="max-w-7xl mx-auto p-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-blue-600 hover:underline"
        >
          ← Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl overflow-hidden"
          >
            {product.images && product.images.length > 0 ? (
              <Carousel
                showArrows
                showThumbs={false}
                infiniteLoop
                autoPlay
                interval={3000}
                className="rounded-xl"
              >
                {product.images.map((image, index) => (
                  <div key={index} className="h-72 md:h-96">
                    <img
                      src={image.url}
                      alt={image.alt || product.name}
                      className="h-full w-full object-cover rounded-xl"
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="h-72 md:h-96 flex items-center justify-center bg-gray-200 rounded-xl text-gray-500">
                No Images Available
              </div>
            )}
            <p>
              {product.attributes ? (
                <>
                  {Object?.entries(product.attributes)?.map(
                    ([key, value]) =>
                      value && (
                        <span
                          key={key}
                          className="text-sm text-gray-600 font-medium mr-2"
                        >
                          {key}: {value}
                        </span>
                      )
                  )}
                </>
              ) : (
                <></>
              )}
            </p>
          </motion.div>

          {/* Details */}

          <motion.div
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-xl font-semibold text-blue-600">
              ₹{product.price}
            </p>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Status:</span>
              <span
                className={`px-2 py-1 rounded-full font-medium text-xs ${
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
            {variant.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Available Variants
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {variant.map((variant) => (
                    <div
                      key={variant._id}
                      onClick={() =>
                        navigate(`/user/productdetails/${variant._id}`)
                      }
                      className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      <img
                        src={variant.images?.[0]?.url || "/placeholder.jpg"}
                        alt={variant.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-sm font-medium">{variant.name}</p>
                        <p className="text-blue-600 font-semibold text-sm">
                          ₹{variant.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={handleAddToCart}
              className="mt-4 bg-orange-500 items-center flex gap-2 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm transition"
            >
              Add to Cart <FiShoppingCart></FiShoppingCart>
            </button>

            {/* Delete button */}

            <div className="text-sm text-gray-500 mt-4 space-y-1">
              <p>
                <span className="font-medium">Seller:</span>{" "}
                {user?.name || "Unknown"}
              </p>
              <p>
                <span className="font-medium">Posted:</span>{" "}
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Brand:</span> {product.brand}
              </p>
              <p>
                <span className="font-medium">Product ID:</span> {product._id}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default UserProductDetails;
