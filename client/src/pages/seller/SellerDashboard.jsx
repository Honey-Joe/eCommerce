import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../../layouts/Layout";
import { uploadSellerDocuments } from "../../features/seller/sellerSlice";
import AddProductForm from "./AddProductForm";
import SellerProducts from "./SellerProducts";
import Modal from "../../components/Modal";

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const seller = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);

  const { uploadStatus, uploadMessage } = useSelector((state) => state.seller);

  const [documents, setDocuments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => setShowForm(!showForm);
  const handleDocumentChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setDocuments((prevDocs) => {
      const existingFileNames = prevDocs.map((f) => f.name);
      const newFiles = selectedFiles.filter(
        (f) => !existingFileNames.includes(f.name)
      );
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
      <div className="max-w-[100%]">
        <div className="w-[80%] mx-auto grid grid-cols-1 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
              <p className="text-lg mb-4">Welcome to your seller dashboard!</p>
            </div>
            <div>
              {seller.statusApproved === "approved" ? (
                <>
                  <div className=" flex gap-5 items-center">
                    <div>
                      <button
                        onClick={handleToggleForm}
                        className="bg-blue-600 text-white px-4 py-2 h-[50px] rounded mb-4"
                      >
                        {showForm ? "Close Form" : "Add Product"}
                      </button>

                      <Modal isOpen={showForm} onClose={handleToggleForm}>
                        <AddProductForm />
                      </Modal>
                    </div>
                  </div>
                </>
              ) : seller.statusApproved === "pending" ? (
                <div className="bg-yellow-100 p-4 rounded shadow-md">
                  <p className="text-yellow-700 font-semibold">
                    Your documents are under review. Please wait for admin
                    approval. Upload the Documents
                  </p>
                </div>
              ) : seller.statusApproved === "disabled" ? (
                <div className="bg-red-100 p-4 rounded shadow-md">
                  <p className="text-red-600 font-semibold mb-2">
                    Your account is disabled yet. Please contact the Admin
                  </p>
                </div>
              ) : (
                <div className="bg-gray-100 p-4 rounded shadow-md">
                  <p className="text-gray-700">Unknown seller status.</p>
                </div>
              )}
            </div>
          </div>
          <div className="">
            <SellerProducts sellerId={seller?.user?.userId} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerDashboard;
