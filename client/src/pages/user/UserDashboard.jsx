import React, { useState } from 'react';
import Layout from '../../layouts/Layout';
import UserProfile from './UserProfile';
import MyOrders from './MyOrders';

const tabs = ['Account', 'Orders', 'Update Profile'];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('Account');

  const renderContent = () => {
    switch (activeTab) {
      case 'Account':
        return <UserProfile />;
      case 'Orders':
        return <MyOrders />;
      case 'Update Profile':
        return <p className="text-lg">Update your profile information here.</p>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
  {/* Sidebar */}
  <aside className="w-full md:w-1/4 bg-white border-r shadow-xl">
    
    <ul className="space-y-2 p-4">
      {tabs.map((tab) => (
        <li key={tab}>
          <button
            className={`w-full text-left px-5 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-blue-100'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        </li>
      ))}
    </ul>
  </aside>

  {/* Main Content */}
  <main className="flex-1 p-8 bg-white rounded-tl-3xl shadow-inner">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">{activeTab}</h1>
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition hover:shadow-xl">
      {renderContent()}
    </div>
  </main>
</div>

    </Layout>
  );
};

export default UserDashboard;
