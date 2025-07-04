import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../axios";
import { getAdmin, setError } from "../../../features/admin/adminSlice";
import moment from "moment";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";
import UpdateAdminForm from "./UpdateAdminForm";

const GetAdmin = () => {
  const { admins, error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axiosInstance.get("/admin/get-admins");
        dispatch(getAdmin(res.data));
        console.log(res.data);
      } catch (err) {
        dispatch(setError(err));
      }
    };
    fetchAdmin();
  }, [dispatch]);

  console.log(admins);
  const deleteAdmin = async (adminId) => {
    if (!window.confirm("Delete this Admin?")) return;

    try {
      const res = await axiosInstance.delete("/admin/" + adminId);
      toast.success(res.data.message || "Admin Deleted Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Admin Users</h2>
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Role ID</th>
                <th className="py-3 px-6 text-left">Created At</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {admins?.length > 0 ? (
                admins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6">{admin.name}</td>
                    <td className="py-3 px-6">{admin.email}</td>
                    <td className="py-3 px-6">{admin.phone}</td>
                    <td className="py-3 px-6">{admin.role}</td>
                    <td className="py-3 px-6">
                      {moment(admin.createdAt).format("DD MMM YYYY, h:mm A")}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link to={"/admin/update/"+admin._id}>
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        </Link>
                        
                        
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          onClick={() => {
                            deleteAdmin(admin._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No admin users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GetAdmin;
