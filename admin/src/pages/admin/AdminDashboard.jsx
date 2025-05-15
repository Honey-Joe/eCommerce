import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLoading,
  setUsers,
  setSellers,
  setError,
  selectUsers,
  selectSellers,
} from '../../features/admin/adminSlice';
import axiosInstance from '../../axios';
import Layout from '../../layouts/Layout';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const sellers = useSelector(selectSellers);
  const location = useLocation();

  const [openSection, setOpenSection] = useState(null);

  const toggleAccordion = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const fetchAdminData = async () => {
    dispatch(setLoading());
    try {
      const [usersRes, sellersRes] = await Promise.all([
        axiosInstance.get('/admin/users', { withCredentials: true }),
        axiosInstance.get('/admin/sellers', { withCredentials: true }),
      ]);

      dispatch(setUsers(usersRes.data));
      dispatch(setSellers(sellersRes.data));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch admin data'));
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const showDashboardStats = location.pathname === '/admin/dashboard';

  return (
    <Layout>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md overflow-y-auto">
          <div className="p-6 text-lg font-bold text-blue-600">Admin Panel</div>
          <nav className="p-4 space-y-2 text-gray-700">

            {/* Dashboard */}
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? 'font-semibold text-blue-600' : 'hover:text-blue-500'
              }
            >
              🏠 Dashboard
            </NavLink>

            {/* User Management Accordion */}
            <div>
              <button
                onClick={() => toggleAccordion('user')}
                className="w-full text-left hover:text-blue-500 font-semibold"
              >
                👥 User Management
              </button>
              {openSection === 'user' && (
                <div className="ml-4 mt-2 space-y-1">
                  <NavLink to="/admin/users" className="block hover:text-blue-500">
                    View Users
                  </NavLink>
                  {/* Add more user links here if needed */}
                </div>
              )}
            </div>

            {/* Seller Management Accordion */}
            <div>
              <button
                onClick={() => toggleAccordion('seller')}
                className="w-full text-left hover:text-blue-500 font-semibold"
              >
                🛍️ Seller Management
              </button>
              {openSection === 'seller' && (
                <div className="ml-4 mt-2 space-y-1">
                  <NavLink to="/admin/sellers/approved" className="block hover:text-blue-500">
                    ✅ Approved Sellers
                  </NavLink>
                  <NavLink to="/admin/sellers/pending" className="block hover:text-blue-500">
                    ⏳ Pending Sellers
                  </NavLink>
                  <NavLink to="/admin/sellers/disabled" className="block hover:text-blue-500">
                    ❌ Disabled Sellers
                  </NavLink>
                </div>
              )}
            </div>

            {/* Site Settings Accordion */}
            <div>
              <button
                onClick={() => toggleAccordion('site')}
                className="w-full text-left hover:text-blue-500 font-semibold"
              >
                ⚙️ Site Settings
              </button>
              {openSection === 'site' && (
                <div className="ml-4 mt-2 space-y-1">
                  <NavLink to="/admin/site-settings" className="block hover:text-blue-500">
                    General Settings
                  </NavLink>
                  {/* Add more site setting links here */}
                </div>
              )}
            </div>

            {/* Other Settings Accordion */}
            <div>
              <button
                onClick={() => toggleAccordion('other')}
                className="w-full text-left hover:text-blue-500 font-semibold"
              >
                📦 Other Settings
              </button>
              {openSection === 'other' && (
                <div className="ml-4 mt-2 space-y-1">
                  <NavLink to="/admin/others" className="block hover:text-blue-500">
                    Misc Settings
                  </NavLink>
                </div>
              )}
            </div>

            {/* Product Management  */}
            <div>
              <button
                onClick={() => toggleAccordion('product')}
                className="w-full text-left hover:text-blue-500 font-semibold"
              >
                📦 Product Management
              </button>
              {openSection === 'product' && (
                <div className="ml-4 mt-2 space-y-1">
                  <NavLink to="/admin/products/approved" className="block hover:text-blue-500">
                    Approved Products
                  </NavLink>
                  <NavLink to="/admin/products/disabled" className="block hover:text-blue-500">
                    Disabled Products
                  </NavLink>
                  <NavLink to="/admin/products/pending" className="block hover:text-blue-500">
                    Pending Products
                  </NavLink>
                </div>
                
              )}
            </div>

          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {showDashboardStats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm text-gray-500">Total Users</h3>
                <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm text-gray-500">Total Sellers</h3>
                <p className="text-2xl font-bold text-orange-600">{sellers.length}</p>
              </div>
              {/* You can add more cards here for orders, products, etc. */}
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
