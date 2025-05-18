import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellers, updateSellerStatus } from "../../../features/admin/sellersSlice";
import { toast } from "react-toastify";
import axiosInstance from "../../../axios";

const ApprovedSellers = () => {
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
      console.log(error)
    }
  };

  if (loading) return <div>Loading..</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  const approvedSellers = list.filter((seller) => seller.status === "approved");

  return (
    <div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Approved Sellers</h2>
        {approvedSellers.length > 0 ? (
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
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approvedSellers.map((seller) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-green-500 font-semibold">
                      {seller.status}
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
                    <td className="px-6 py-4 whitespace-nowrap">
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
          <p className="text-gray-500">No approved sellers found</p>
        )}
      </div>
    </div>
  );
};

export default ApprovedSellers;
