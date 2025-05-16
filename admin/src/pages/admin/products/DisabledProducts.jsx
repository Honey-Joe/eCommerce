import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateProductStatus } from "../../../features/admin/productSlice";
import { toast } from "react-toastify";
import axiosInstance from "../../../axios";

const disabledProducts = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this Product ?")) return;

    try {
      await axiosInstance.patch(`/products/${id}/status`, {status:"Approved"},{withCredentials: true});
      dispatch(updateProductStatus({ id, status: "Approved" }));
      toast.success("Product Approved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Approved failed");
    }
  };

  const disabled = list.filter(p => p.status === "Disabled");
const disabledByAdmin = list.filter(p => p.status === "DisabledByAdmin");


  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-blue-500">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Disabled Products</h2>
      {disabled.length ? (
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
              {disabled.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">{product.seller?.name}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleApprove(product._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
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
        <p>No disabled products found.</p>
      )}
      <h2 className="text-xl font-semibold mb-4">Disabled Products by Admin</h2>
      {disabledByAdmin.length ? (
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
              {disabledByAdmin.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">{product.seller?.name}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleApprove(product._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
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
        <p>No disabled products found.</p>
      )}
    </div>
  );
};

export default disabledProducts;
