import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../../layouts/Layout";
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

  return (
    <Layout>
      {/* 🔥 Header Section */}
      <div className="relative h-64 w-full bg-cover bg-center" style={{ backgroundImage: "url('https://ik.imagekit.io/HoneyJoe/18824950.jpg?updatedAt=1747725578653')" }}>
        <div className="absolute inset-0 bg-[#00000070] flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold tracking-wide">
            Product Management
          </h1>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-[100%]">
        <div className="w-[80%] mx-auto grid grid-cols-1 py-8">
          <div className="flex justify-between">
            <div>
              <SellerProducts sellerId={seller?.user?.userId} />
            </div>
            <div>
              {seller.statusApproved === "approved" ? (
                <div className="flex gap-5 items-center">
                  <div>
                    <button
                      onClick={handleToggleForm}
                      className="bg-blue-600 text-white px-6 text-nowrap py-3 w-full rounded mb-4"
                    >
                      {showForm ? "Close Form" : "Add Product"}
                    </button>

                    <Modal isOpen={showForm} onClose={handleToggleForm}>
                      <AddProductForm />
                    </Modal>
                  </div>
                </div>
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
        </div>
      </div>
    </Layout>
  );
};

export default SellerDashboard;
