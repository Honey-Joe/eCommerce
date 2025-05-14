import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../../layouts/Layout";
import { uploadSellerDocuments } from "../../features/seller/sellerSlice";
import AddProductForm from "./AddProductForm";
import SellerProducts from "./SellerProducts";

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const seller = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);
  console.log(seller);
  const { uploadStatus, uploadMessage } = useSelector((state) => state.seller);

  const [documents, setDocuments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => setShowForm((prev) => !prev);
const handleDocumentChange = (e) => {
  const selectedFiles = Array.from(e.target.files);
  setDocuments((prevDocs) => {
    const existingFileNames = prevDocs.map((f) => f.name);
    const newFiles = selectedFiles.filter((f) => !existingFileNames.includes(f.name));
    return [...prevDocs, ...newFiles];
  });
};

  const handleUploadDocuments = () => {
    if (documents.length === 0) return;

    const formData = new FormData();
    documents.forEach((doc) => formData.append("documents", doc));
    dispatch(uploadSellerDocuments(formData, token));
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
        <p className="text-lg mb-4">Welcome to your seller dashboard!</p>

        {seller.statusApproved === "approved" ? (
          <>
            <div className=" flex gap-5 items-center">
              <button
                onClick={handleToggleForm}
                className="bg-blue-600 text-white px-4 py-2 h-[50px] rounded mb-4"
              >
                {showForm ? "Close Form" : "Add Product"}
              </button>
              {showForm && <AddProductForm />}

              <div className="mt-6">
                <label className="block mb-1 font-medium text-gray-700">
                  Upload Documents
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  multiple
                  onChange={handleDocumentChange}
                  className="block w-full text-sm"
                />

                {/* Preview Area */}
                <div className="flex flex-wrap mt-2 gap-3">
                  {documents.map((file, idx) => {
                    const fileType = file.type;
                    const isImage = fileType.startsWith("image/");

                    return (
                      <div
                        key={idx}
                        className="w-20 h-20 border rounded flex items-center justify-center overflow-hidden"
                      >
                        {isImage ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Document Preview"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="text-xs text-center px-1">
                            📄 {file.name.split(".").pop().toUpperCase()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Upload Button */}
                <button
                  onClick={handleUploadDocuments}
                  disabled={uploadStatus === "loading"}
                  className="mt-3 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-200"
                >
                  {uploadStatus === "loading"
                    ? "Uploading..."
                    : "Upload Documents"}
                </button>

                {/* Upload Status Message */}
                {uploadMessage && (
                  <p
                    className={`mt-2 ${
                      uploadStatus === "succeeded"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {uploadMessage}
                  </p>
                )}
              </div>
            </div>
          </>
        ) : seller.statusApproved === "pending" ? (
          <div className="bg-yellow-100 p-4 rounded shadow-md">
            <p className="text-yellow-700 font-semibold">
              Your documents are under review. Please wait for admin approval.
              Upload the Documents
            </p>
            <div className="mt-6">
              <label className="block mb-1 font-medium text-gray-700">
                Upload Documents
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                multiple
                onChange={handleDocumentChange}
                className="block w-full text-sm"
              />

              {/* Preview Area */}
              <div className="flex flex-wrap mt-2 gap-3">
                {documents.map((file, idx) => {
                  const fileType = file.type;
                  const isImage = fileType.startsWith("image/");

                  return (
                    <div
                      key={idx}
                      className="w-20 h-20 border rounded flex items-center justify-center overflow-hidden"
                    >
                      {isImage ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Document Preview"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="text-xs text-center px-1">
                          📄 {file.name.split(".").pop().toUpperCase()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUploadDocuments}
                disabled={uploadStatus === "loading"}
                className="mt-3 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-200"
              >
                {uploadStatus === "loading"
                  ? "Uploading..."
                  : "Upload Documents"}
              </button>

              {/* Upload Status Message */}
              {uploadMessage && (
                <p
                  className={`mt-2 ${
                    uploadStatus === "succeeded"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {uploadMessage}
                </p>
              )}
            </div>
          </div>
        ) : seller.statusApproved === "disabled" ? (
          <div className="bg-red-100 p-4 rounded shadow-md">
            <p className="text-red-600 font-semibold mb-2">
              Your account is disabled yet. Please contact the Admin
            </p>

           <div className="mt-6">
                <label className="block mb-1 font-medium text-gray-700">
                  Upload Documents
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  multiple
                  onChange={handleDocumentChange}
                  className="block w-full text-sm"
                />

                {/* Preview Area */}
                <div className="flex flex-wrap mt-2 gap-3">
                  {documents.map((file, idx) => {
                    const fileType = file.type;
                    const isImage = fileType.startsWith("image/");

                    return (
                      <div
                        key={idx}
                        className="w-20 h-20 border rounded flex items-center justify-center overflow-hidden"
                      >
                        {isImage ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Document Preview"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="text-xs text-center px-1">
                            📄 {file.name.split(".").pop().toUpperCase()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Upload Button */}
                <button
                  onClick={handleUploadDocuments}
                  disabled={uploadStatus === "loading"}
                  className="mt-3 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-200"
                >
                  {uploadStatus === "loading"
                    ? "Uploading..."
                    : "Upload Documents"}
                </button>

                {/* Upload Status Message */}
                {uploadMessage && (
                  <p
                    className={`mt-2 ${
                      uploadStatus === "succeeded"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {uploadMessage}
                  </p>
                )}
              </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded shadow-md">
            <p className="text-gray-700">Unknown seller status.</p>
          </div>
        )}
      </div>
      <div className="p-6">
      <SellerProducts sellerId={seller?.user?.userId} />
    </div>
    </Layout>
  );
};

export default SellerDashboard;
