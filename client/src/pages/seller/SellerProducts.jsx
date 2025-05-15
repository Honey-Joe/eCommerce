import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductById,
  fetchSellerProducts,
  removeSellerProduct,
  setProductError,
  setProductLoading,
} from "../../features/products/productSlice";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { toast } from "react-toastify";

const SellerProducts = ({ sellerId }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (sellerId) dispatch(fetchSellerProducts(sellerId));
  }, [dispatch, sellerId]);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    try {
      dispatch(setProductLoading(true));
      await deleteProductById(id);
      dispatch(removeSellerProduct(id));
      toast.success("Product Deleted Successfully");
    } catch (err) {
      dispatch(
        setProductError(err.response?.data?.message || "Delete failed")
      );
      toast.error("Delete failed");
    } finally {
      dispatch(setProductLoading(false));
    }
  };

  // Group products by their status
  const groupedProducts = products.reduce((acc, product) => {
    const status = product.status || "Unknown";
    if (!acc[status]) acc[status] = [];
    acc[status].push(product);
    return acc;
  }, {});

  // Optional: Display in a fixed order
  const statusOrder = ["Approved", "Pending", "Disabled"];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Products</h2>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {statusOrder.map(
        (status) =>
          groupedProducts[status]?.length > 0 && (
            <div key={status} className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">
                {status} Products
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedProducts[status].map((product) => (
                  <div
                    key={product._id}
                    className="border p-4 rounded shadow hover:shadow-lg transition"
                  >
                    <Carousel
                      showArrows={true}
                      showThumbs={false}
                      infiniteLoop
                      autoPlay
                      interval={3000}
                      className="w-full max-w-md mx-auto rounded-lg shadow"
                    >
                      {product.images.map((image, index) => (
                        <div key={index}>
                          <img
                            src={image.url}
                            alt={image.alt || product.name}
                            className="h-64 object-cover rounded"
                          />
                        </div>
                      ))}
                    </Carousel>

                    <h4 className="font-semibold text-lg mt-2">
                      {product.name}
                    </h4>
                    <p className="text-gray-600">₹{product.price}</p>
                    <p className="text-sm text-gray-500">
                      {product.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {product.status}
                    </p>
                    <button
                      className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(product._id)}
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default SellerProducts;
