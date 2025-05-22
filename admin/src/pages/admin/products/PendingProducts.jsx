import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  updateProductStatus,
} from "../../../features/admin/productSlice";
import { toast } from "react-toastify";
import axiosInstance from "../../../axios";
import Modal from "../../../components/Modal";

const PendingProducts = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleStatusChange = async (id, status, message) => {
    if (!window.confirm(`${message} this product?`)) return;
    try {
      await axiosInstance.patch(`/products/${id}/status`, { status });
      dispatch(updateProductStatus({ id, status }));
      toast.success(`Product ${message}`);
    } catch (error) {
      toast.error(error.response?.data?.message || `${message} failed`);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const pending = list.filter((p) => p.status === "Pending");

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pending Products</h2>
      {pending.length ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Seller</th>
                <th className="px-6 py-3 text-left">Location</th>
                <th className="px-6 py-3 text-left">Brand</th>
                <th className="px-6 py-3 text-center">Actions</th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pending.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">{product.seller?.name}</td>
                  <td className="px-6 py-4">{product.location.place}</td>
                  <td className="px-6 py-4">{product.brand}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => openModal(product)}
                      className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(product._id, "Approved", "Approve")
                      }
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(
                          product._id,
                          "DisabledByAdmin",
                          "Disable"
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                    >
                      Disable
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No pending products found.</p>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedProduct && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              {selectedProduct.name}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-700">Price</p>
                <p className="text-base text-green-600 font-semibold">
                  ₹{selectedProduct.price}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Category</p>
                <p>{selectedProduct.category}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Stock</p>
                <p>{selectedProduct.stock}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Status</p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedProduct.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : selectedProduct.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedProduct.status}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-700">Seller</p>
                <p>{selectedProduct.seller?.name}</p>
              </div>
            </div>

            <div>
              <p className="font-medium text-gray-700 mb-1">Description</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {selectedProduct.images?.length > 0 && (
              <div>
                <p className="font-medium text-gray-700 mb-2">Images</p>
                <div className="grid grid-cols-2 gap-3">
                  {selectedProduct.images.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={`Product ${i}`}
                      className="rounded-lg h-32 w-full object-cover border"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingProducts;
