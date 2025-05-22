import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  updateProductStatus,
} from "../../../features/admin/productSlice";
import { toast } from "react-toastify";
import axiosInstance from "../../../axios";

const ApprovedProducts = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDisable = async (id) => {
    if (!window.confirm("Disable this product?")) return;

    try {
      await axiosInstance.patch(
        `/products/${id}/status`,
        { status: "DisabledByAdmin" },
        { withCredentials: true }
      );
      dispatch(updateProductStatus({ id, status: "disabled" }));
      toast.success("Product disabled");
    } catch (error) {
      toast.error(error.response?.data?.message || "Disable failed");
    }
  };

  const approved = list.filter((p) => p.status === "Approved");

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Approved Products
      </h2>

      {approved.length ? (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Seller</th>
                <th className="px-6 py-3 text-left">isSold</th>
                <th className="px-6 py-3 text-left">Brand</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {approved.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {product.seller?.name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.isSold
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {product.isSold ? "Sold" : "Unsold"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {product?.brand}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDisable(product._id)}
                      className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
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
        <p className="text-center text-gray-600">No approved products found.</p>
      )}
    </div>
  );
};

export default ApprovedProducts;
