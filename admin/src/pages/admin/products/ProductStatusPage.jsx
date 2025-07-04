import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../axios";
import { toast } from "react-toastify";
import ApprovedProducts from "./ApprovedProducts";
import PendingProducts from "./PendingProducts";
import DisabledProducts from "./DisabledProducts";
import { fetchProducts, updateProductStatus } from "../../../features/admin/productSlice";

const ProductStatusPage = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.products);
    
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    try {
      await axiosInstance.patch(
        `/products/${id}/status`,
        { status },
        { withCredentials: true }
      );
      dispatch(updateProductStatus({ id, status }));
      toast.success(`Product marked as ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  const approved = list.filter((p) => p.status === "approved");
  const pending = list.filter((p) => p.status === "pending");
  const disabled = list.filter((p) => p.status === "disabled");

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Product Status</h1>
      <ApprovedProducts products={approved} onStatusChange={handleStatusChange} />
      <PendingProducts products={pending} onStatusChange={handleStatusChange} />
      <DisabledProducts products={disabled} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default ProductStatusPage;
