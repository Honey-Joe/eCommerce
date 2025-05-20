import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateProductStatus } from "../../../features/admin/productSlice";
import { toast } from "react-toastify";
import axiosInstance from "../../../axios";

const DisabledProducts = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this product?")) return;
    try {
      await axiosInstance.patch(`/products/${id}/status`, { status: "Approved" });
      dispatch(updateProductStatus({ id, status: "Approved" }));
      toast.success("Product Approved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    }
  };

  const renderTable = (products, title) => (
    <>
      <h2 className="text-2xl font-bold my-4">{title}</h2>
      {products.length ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Seller</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">{product.seller?.name}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleApprove(product._id)}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No products in this category.</p>
      )}
    </>
  );

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const disabled = list.filter((p) => p.status === "Disabled");
  const disabledByAdmin = list.filter((p) => p.status === "DisabledByAdmin");

  return (
    <div>
      {renderTable(disabled, "Disabled Products by Seller")}
      {renderTable(disabledByAdmin, "Disabled Products by Admin")}
    </div>
  );
};

export default DisabledProducts;
