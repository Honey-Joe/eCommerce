import React, { useEffect } from 'react';
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
    <>
    <Layout>
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-lg font-bold text-blue-600">Admin Panel</div>
        <nav className="flex flex-col p-4 space-y-2 text-gray-700">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? 'font-semibold text-blue-600' : 'hover:text-blue-500'
            }
          >
            🏠 Dashboard
          </NavLink>
          <NavLink to="/admin/users" className="hover:text-blue-500">
            👥 User Management
          </NavLink>
          <NavLink to="/admin/sellers" className="hover:text-blue-500">
            🛍️ Seller Management
          </NavLink>
          <NavLink to="/admin/site-settings" className="hover:text-blue-500">
            ⚙️ Site Settings
          </NavLink>
          <NavLink to="/admin/others" className="hover:text-blue-500">
            📦 Other Settings
          </NavLink>
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
            {/* Add more cards here for products, orders, etc. */}
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>

    </Layout>
    </>
  );
};

export default AdminDashboard;
