import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateProductStatus } from "../../../features/admin/productSlice";
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

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this Product ?")) return;
    try {
      await axiosInstance.patch(`/products/${id}/status`, { status: "Approved" });
      dispatch(updateProductStatus({ id, status: "Approved" }));
      toast.success("Product Approved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    }
  };

  const handleDisable = async (id) => {
    if (!window.confirm("Disable this product?")) return;
    try {
      await axiosInstance.patch(`/products/${id}/status`, { status: "Disabled" });
      dispatch(updateProductStatus({ id, status: "Disabled" }));
      toast.success("Product Disabled");
    } catch (error) {
      toast.error(error.response?.data?.message || "Disable failed");
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

  const pending = list.filter(p => p.status === "Pending");

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Products</h2>
      {pending.length ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Seller</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pending.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 text-center">{product.name}</td>
                  <td className="px-6 py-4 text-center">₹{product.price}</td>
                  <td className="px-6 py-4 text-center">{product.seller?.name}</td>
                  <td className="px-6 py-4 flex gap-3 justify-center">
                    <button
                      onClick={() => openModal(product)}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(product._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDisable(product._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
        <p>No pending products found.</p>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedProduct && (
          <div>
            <h3 className="text-xl font-semibold mb-2">{selectedProduct.name}</h3>
            <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Stock:</strong> {selectedProduct.stock}</p>
            <p><strong>Status:</strong> {selectedProduct.status}</p>
            <p><strong>Seller:</strong> {selectedProduct.seller?.name}</p>
            {selectedProduct.images?.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {selectedProduct.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingProducts;
