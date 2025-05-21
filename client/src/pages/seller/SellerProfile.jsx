import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateSellerProfile,
  uploadSellerDocuments,
} from "../../features/seller/sellerSlice";

const SellerProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { updateStatus, updateMessage } = useSelector((state) => state.seller);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    storeLocation: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(formData);

 

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || "",
        email: user.email || "",
        businessName: user.businessName || "",
        storeLocation: user.location?.place || "",
      };
      console.log(user)
      setFormData(userData);
      setTempData(userData);
    }
  }, [user]);

  // Profile Handlers
  const handleChange = (e) => {
    if (!editMode) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => setEditMode(true);

  const handleCancel = () => {
    setFormData(tempData);
    setEditMode(false);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSellerProfile(formData));
    setEditMode(false);
  };

  // Document Upload Handlers
  

  return (
    <div className="max-w-3xl mx-auto space-y-12 p-6 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100">
      {/* Profile Info */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-blue-800">
          👤 Seller Profile
        </h2>
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          {["name", "email", "businessName", "storeLocation"].map((field) => (
            <div key={field}>
              <label className="block font-semibold text-gray-700 capitalize mb-1">
                {field === "storeLocation" ? "Store Location" : field}
              </label>
              {editMode ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  disabled={field === "email"}
                />
              ) : (
                <p className="text-gray-800 bg-gray-100 px-4 py-2 rounded-md border border-gray-200">
                  {formData[field]}
                </p>
              )}
            </div>
          ))}

          {!editMode ? (
            <button
              type="button"
              onClick={handleEditClick}
              className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-5 py-2 rounded-md shadow"
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 transition-colors text-white px-5 py-2 rounded-md shadow"
                disabled={updateStatus === "loading"}
              >
                {updateStatus === "loading" ? "Saving..." : "💾 Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-400 hover:bg-gray-500 transition-colors text-white px-5 py-2 rounded-md shadow"
              >
                Cancel
              </button>
            </div>
          )}

          {updateMessage && (
            <p className="text-green-600 font-medium mt-2">{updateMessage}</p>
          )}
        </form>
      </div>

      {/* Document Upload */}
      
    </div>
  );
};

export default SellerProfile;
