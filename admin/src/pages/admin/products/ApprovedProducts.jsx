import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateProductStatus } from "../../../features/admin/productSlice";
import { toast } from "react-toastify";
import axiosInstance from "../../../axios";

const ApprovedProducts = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.products);
  console.log(list);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDisable = async (id) => {
    if (!window.confirm("Disable this product?")) return;

    try {
      await axiosInstance.patch(`/products/${id}/status`, {status:"DisabledByAdmin"}, { withCredentials: true });
      dispatch(updateProductStatus({ id, status: "disabled" }));
      toast.success("Product disabled");
    } catch (error) {
      toast.error(error.response?.data?.message || "Disable failed");
    }
  };

  const approved = list.filter(p => p.status === "Approved");

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Approved Products</h2>
      {approved.length ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Seller</th>
                <th className="px-6 py-3">isSold</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {approved.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 text-center">{product.name}</td>
                  <td className="px-6 py-4 text-center">₹{product.price}</td>
                  <td className="px-6 py-4 text-center">{product.seller?.name}</td>
                  <td className="px-6 py-4 text-center">{product.isSold?(<><p>Sold</p></>):(<><p>Unsold</p></>)}</td>
                  <td className="px-6 py-4 text-center">
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
        <p>No approved products found.</p>
      )}
    </div>
  );
};

export default ApprovedProducts;
