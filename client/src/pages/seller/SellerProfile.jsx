import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateSellerProfile,
  uploadSellerDocuments,
} from '../../features/seller/sellerSlice';
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

  const [documents, setDocuments] = useState([]); // For doc upload
  const [uploadMessage, setUploadMessage] = useState('');

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
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map((file) => ({
      file,
      expiryDate: '',
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const handleExpiryDateChange = (index, value) => {
    setDocuments((prev) => {
      const updated = [...prev];
      updated[index].expiryDate = value;
      return updated;
    });
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDocUpload = async (e) => {
    e.preventDefault();
    if (documents.length === 0) return;

    const form = new FormData();
    documents.forEach(({ file }) => {
      form.append('documents', file);
    });

    const expiryDates = {};
    documents.forEach(({ file, expiryDate }) => {
      if (expiryDate) expiryDates[file.name] = expiryDate;
    });
    form.append('expiryDates', JSON.stringify(expiryDates));

    await dispatch(uploadSellerDocuments(form));
    setDocuments([]);
    setUploadMessage('Documents uploaded successfully!');
    setTimeout(() => setUploadMessage(''), 3000);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-10 p-6 bg-white rounded shadow">
        {/* Profile Info */}
        <div>
          <h2 className="text-xl font-bold mb-4">Seller Profile</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
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
                    disabled={field === 'email'}
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
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  disabled={updateStatus === 'loading'}
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

        {/* Document Upload */}
        <div>
          <h2 className="text-xl font-bold mb-4">Upload Documents</h2>
          <form onSubmit={handleDocUpload} className="space-y-4" encType="multipart/form-data">
            <div>
              <label className="block font-medium">Select Files</label>
              <input
                type="file"
                multiple
                accept="application/pdf,image/*"
                onChange={handleFileChange}
              />
            </div>

            {documents.length > 0 && (
              <div className="space-y-2 bg-gray-50 border p-4 rounded">
                {documents.map(({ file, expiryDate }, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <p className="flex-1">{file.name}</p>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => handleExpiryDateChange(idx, e.target.value)}
                      className="border border-gray-300 p-1 rounded"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeDocument(idx)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded"
              disabled={documents.length === 0}
            >
              Upload Documents
            </button>

            {uploadMessage && <p className="text-green-600">{uploadMessage}</p>}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SellerProfile;
