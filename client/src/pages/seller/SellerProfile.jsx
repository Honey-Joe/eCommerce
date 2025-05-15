import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSellerProfile } from '../../features/seller/sellerSlice';
import Layout from '../../layouts/Layout';

const SellerProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { updateStatus, updateMessage } = useSelector((state) => state.seller);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    storeLocation: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(formData);

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        email: user.email || '',
        businessName: user.businessName || '',
        storeLocation: user.storeLocation || '',
      };
      setFormData(userData);
      setTempData(userData);
    }
  }, [user]);

  const handleChange = (e) => {
    if (!editMode) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setFormData(tempData);
    setEditMode(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSellerProfile(formData));
    setEditMode(false);
  };

  return (

    <Layout>

    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Seller Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'email', 'businessName', 'storeLocation'].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize">{field}</label>
            {editMode ? (
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                disabled={field === 'email'} // Email is non-editable
              />
            ) : (
              <p className="text-gray-700 bg-gray-100 p-2 rounded">{formData[field]}</p>
            )}
          </div>
        ))}

        {!editMode ? (
          <button
            type="button"
            onClick={handleEditClick}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {updateStatus === 'loading' ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}

        {updateMessage && (
          <p className="text-green-600 mt-2">{updateMessage}</p>
        )}
      </form>
    </div>

    </Layout>
  );
};

export default SellerProfile;
