import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSellers,
  updateSellerStatus,
} from "../../../features/admin/sellersSlice";
import { toast } from "react-toastify";
import axiosInstance from "../../../axios";

const PendingSellers = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.sellers);

  useEffect(() => {
    dispatch(fetchSellers());
  }, [dispatch]);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to disable this seller?"))
      return;

    try {
      const res = await axiosInstance.put(`/admin/seller/${id}/disable`, {
        withCredentials: true,
      });
      dispatch(updateSellerStatus({ id, status: "disabled" }));
      toast.success("Seller disabled successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Disabled  failed");
      console.log(error);
    }
  };
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

  if (loading) return <div>Loading..</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  const pendingSellers = list.filter((seller) => seller.status === "pending");

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Sellers</h2>
        {pendingSellers.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expriy Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingSellers.map((seller) => (
                  <tr key={seller._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {seller.businessName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {seller.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600">
                      {seller.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {seller.storeLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-yellow-500 font-semibold">
                      Pending
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-y-1">
                      {seller.documents ? (
                        <>
                          <a
                            href={seller.documents.url}
                            className="text-green-500"
                          >
                            View Document
                          </a>
                        </>
                      ) : (
                        <></>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-y-1">
                      {seller.documents ? (
                        <>
                          <div>
                            {seller.documents.expiry
                              ? new Date(
                                  seller.documents.expiry
                                ).toLocaleDateString()
                              : "No expiry date"}
                          </div>{" "}
                        </>
                      ) : (
                        <></>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
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
                        Disable
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No pending sellers found</p>
        )}
      </div>
    </div>
  );
};

export default PendingSellers;
