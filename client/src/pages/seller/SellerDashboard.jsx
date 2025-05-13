import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../../layouts/Layout';
import { uploadSellerDocuments } from '../../features/seller/sellerSlice';

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const seller = useSelector((state)=> state.auth)
  const token = useSelector((state)=>state.auth.token)
  console.log(seller)
  const { uploadStatus, uploadMessage } = useSelector((state) => state.seller);

  const [documents, setDocuments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => setShowForm((prev) => !prev);
  const handleDocumentChange = (e) => setDocuments([...e.target.files]);

  const handleUploadDocuments = () => {
    if (documents.length === 0) return;

    const formData = new FormData();
    documents.forEach((doc) => formData.append('documents', doc));
    dispatch(uploadSellerDocuments(formData, token));
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
        <p className="text-lg mb-4">Welcome to your seller dashboard!</p>

        {seller.statusApproved === 'approved' ? (
          <>
            <button
              onClick={handleToggleForm}
              className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
            >
              {showForm ? 'Close Form' : 'Add Product'}
            </button>
            {showForm && <AddProductForm />}
          </>
        ) : (
          <div className="bg-yellow-100 p-4 rounded shadow-md">
            <p className="text-red-600 font-semibold mb-2">
              Your account is not approved yet. Please upload required documents.
            </p>

            <input
              type="file"
              multiple
              onChange={handleDocumentChange}
              className="block mb-2"
            />

            <button
              onClick={handleUploadDocuments}
              disabled={uploadStatus === 'loading'}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              {uploadStatus === 'loading' ? 'Uploading...' : 'Upload Documents'}
            </button>

            {uploadMessage && (
              <p className={`mt-2 ${uploadStatus === 'succeeded' ? 'text-green-600' : 'text-red-600'}`}>
                {uploadMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SellerDashboard;
