import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellers, updateSellerStatus } from "../../features/admin/sellersSlice";
import { toast } from "react-toastify";
import axiosInstance from "../../axios";

const SellersManagement = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.sellers);
  const [documentUrl, setDocumentUrl] = useState("");

  useEffect(() => {
    dispatch(fetchSellers());
  }, [dispatch]);

  const handleApprove = async (id) => {
    try {
      const res = await axiosInstance.put(
        `/admin/seller/${id}/approve`,
        {},
        { withCredentials: true }
      );
      dispatch(updateSellerStatus({ id, status: "approved" }));
      toast.success("Seller approved successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this seller?")) return;

    try {
      const res = await axiosInstance.delete(`/admin/seller/${id}`, {
        withCredentials: true,
      });
      dispatch(updateSellerStatus({ id, status: "deleted" }));
      toast.success("Seller deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Deletion failed");
    }
  };

  const handleViewDocument = async (id) => {
    try {
      // Assuming you have an API endpoint to fetch the document URL
      const res = await axiosInstance.get(`/admin/seller/${id}/document`, {
        withCredentials: true,
      });
      setDocumentUrl(res.data.documentUrl);
    } catch (error) {
      toast.error("Failed to fetch document");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  // Separate the sellers into approved and pending
  const pendingSellers = list.filter((seller) => seller.status === "pending");
  const approvedSellers = list.filter((seller) => seller.status === "approved");

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sellers Management</h1>

      {/* Pending Sellers */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingSellers.length > 0 ? (
            pendingSellers.map((seller) => (
              <div
                key={seller._id}
                className="border p-4 rounded-lg shadow-md space-y-3"
              >
                <h3 className="text-lg font-semibold">{seller.businessName}</h3>
                <p className="text-sm text-gray-500">{seller.email}</p>
                <p className="text-sm text-gray-500">Location: {seller.storeLocation}</p>
                <p className="text-sm font-semibold text-yellow-500">Status: Pending</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleApprove(seller._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDelete(seller._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Decline
                  </button>
                  
                </div>
                {
                    seller.documents.map((e)=>{
                        return(

                            <img src={e} alt="" />
                        )
                    })
                  }
              </div>
            ))
          ) : (
            <p>No pending sellers found</p>
          )}
        </div>
      </div>

      {/* Approved Sellers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Approved Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedSellers.length > 0 ? (
            approvedSellers.map((seller) => (
              <div
                key={seller._id}
                className="border p-4 rounded-lg shadow-md space-y-3"
              >
                <h3 className="text-lg font-semibold">{seller.businessName}</h3>
                <p className="text-sm text-gray-500">{seller.email}</p>
                <p className="text-sm text-gray-500">Location: {seller.storeLocation}</p>
                <p className="text-sm font-semibold text-green-500">Status: Approved</p>
              </div>
            ))
          ) : (
            <p>No approved sellers found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellersManagement;
