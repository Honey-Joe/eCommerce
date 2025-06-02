import React, { useState } from "react";
import { FiMenu, FiUser, FiBox, FiFileText, FiLogOut } from "react-icons/fi";
import SellerProfile from "./SellerProfile";
import SellerDashboard from "./SellerDashboard";
import Layout from "../../layouts/Layout";
import SellerDocument from "./SellerDocument";
import Logout from "../../components/Logout";

const SellerProfilePage = () => {
  const [activeTab, setActiveTab] = useState("product");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case "products":
        return <SellerDashboard></SellerDashboard>;
      case "account":
        return <SellerProfile></SellerProfile>;
      case "documents":
        return <SellerDocument></SellerDocument>;
      default:
        return <SellerDashboard />;
    }
  };

  return (
    <Layout>
      <div
        className="relative h-64 w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://ik.imagekit.io/HoneyJoe/18824950.jpg?updatedAt=1747725578653')",
        }}
      >
        <div className="absolute inset-0 bg-[#00000070] flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold tracking-wide">
            Seller Account
          </h1>
        </div>
      </div>

      <div className="flex h-fit bg-gray-100 w-[80%] mx-auto">
        {/* Sidebar */}
        <div
          className={`fixed lg:static top-0 left-0 h-screen w-64 bg-white/70 backdrop-blur-md border-r border-blue-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out rounded-r-2xl ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Header */}
          <div className="p-5 border-b border-blue-200 flex justify-between items-center lg:block">
            <h2 className="text-xl font-bold text-blue-700 tracking-wide">
              Seller Panel
            </h2>
            <button
              className="lg:hidden text-gray-700 text-xl"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Nav */}
          <nav className="p-5 space-y-4">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl w-full text-left transition-all duration-200 hover:bg-blue-100 hover:shadow ${
                activeTab === "products"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700"
              }`}
            >
              <FiBox className="text-lg" /> Products
            </button>

            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl w-full text-left transition-all duration-200 hover:bg-blue-100 hover:shadow ${
                activeTab === "account"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700"
              }`}
            >
              <FiUser className="text-lg" /> Account
            </button>

            <button
              onClick={() => setActiveTab("documents")}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl w-full text-left transition-all duration-200 hover:bg-blue-100 hover:shadow ${
                activeTab === "documents"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700"
              }`}
            >
              <FiFileText className="text-lg" /> Documents
            </button>

            <Logout></Logout>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white p-4 shadow-md flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            <h2 className="text-lg font-semibold">Seller Profile</h2>
          </div>

          <div className="p-6">{renderTab()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerProfilePage;
