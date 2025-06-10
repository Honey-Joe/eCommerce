import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminDashboard from "./pages/admin/AdminDashboard";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./features/auth/authSlice";
import axiosInstance from "./axios";

import UsersManagement from "./pages/admin/UserManagement";
import SellersManagement from "./pages/admin/SellerManagement";
import UserList from "./pages/admin/users/UserList";

import ApprovedSellers from "./pages/admin/seller/ApprovedSellers";
import PendingSellers from "./pages/admin/seller/PendingSellers";
import DisabledSellers from "./pages/admin/seller/DisabledSellers";

import OtherSettings from "./pages/admin/sitesettings/OtherSettings";

import ApprovedProducts from "./pages/admin/products/ApprovedProducts";
import PendingProducts from "./pages/admin/products/PendingProducts";
import DisabledProducts from "./pages/admin/products/DisabledProducts";

import { fetchProducts } from "./features/admin/productSlice";

import AdminCategoryManager from "./pages/admin/category/AdminCategoryManager";

import BrandManagement from "./pages/admin/brand/BrandManagement";
import BrandList from "./pages/admin/brand/PendingBrand";

import SiteSettingForm from "./pages/admin/sitesettings/SiteSettingForm";

import ProtectedRoute from "./components/ProtectedRoute";
import CreateAdminForm from "./components/CreateAdmin";
import CreateRoleForm from "./components/CreateRoleForm";
import GetAdmin from "./pages/admin/role/GetAdmin";
import UpdateAdminForm from "./pages/admin/role/UpdateAdminForm";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/admin/me");
        dispatch(loginSuccess(res.data));
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    checkAuth();
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route
            path="roles"
            element={
              <ProtectedRoute
                element={<CreateRoleForm />}
                requiredPermission="role-management"
              />
            }
          />
          <Route
            path="create"
            element={
              <ProtectedRoute
                element={<CreateAdminForm />}
                requiredPermission="role-management"
              />
            }
          />
          <Route
            path="get"
            element={
              <ProtectedRoute
                element={<GetAdmin />}
                requiredPermission="role-management"
              />
            }
          />
          <Route
            path="update/:adminId"
            element={
              <ProtectedRoute
                element={<UpdateAdminForm />}
                requiredPermission="role-management"
              />
            }
          />
          {/* Default admin dashboard page, e.g. stats */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route
            path="dashboard"
            element={
              // Put your DashboardPage component here if you have one
              <div>Admin Dashboard Home / Stats</div>
            }
          />

          {/* User management */}
          <Route
            path="users"
            element={
              <ProtectedRoute
                element={<UsersManagement />}
                requiredPermission="page:user"
              />
            }
          />

          {/* Sellers management */}
          <Route
            path="sellers"
            element={
              <ProtectedRoute
                element={<SellersManagement />}
                requiredPermission="page:seller"
              />
            }
          >
            {/* Nested seller sub-routes */}
          </Route>
          <Route
            path="sellers/approved"
            element={
              <ProtectedRoute
                element={<ApprovedSellers />}
                requiredPermission="page:seller"
              />
            }
          />
          <Route
            path="sellers/pending"
            element={
              <ProtectedRoute
                element={<PendingSellers />}
                requiredPermission="page:seller"
              />
            }
          />
          <Route
            path="sellers/disabled"
            element={
              <ProtectedRoute
                element={<DisabledSellers />}
                requiredPermission="page:seller"
              />
            }
          />
          {/* Products management */}
          <Route
            path="products/approved"
            element={
              <ProtectedRoute
                element={<ApprovedProducts />}
                requiredPermission="page:product"
              />
            }
          />
          <Route
            path="products/pending"
            element={
              <ProtectedRoute
                element={<PendingProducts />}
                requiredPermission="page:product"
              />
            }
          />
          <Route
            path="products/disabled"
            element={
              <ProtectedRoute
                element={<DisabledProducts />}
                requiredPermission="page:product"
              />
            }
          />

          {/* Category management */}
          <Route
            path="addcategory"
            element={
              <ProtectedRoute
                element={<AdminCategoryManager />}
                requiredPermission="page:category"
              />
            }
          />

          {/* Brand management */}
          <Route
            path="brand"
            element={
              <ProtectedRoute
                element={<BrandManagement />}
                requiredPermission="page:brand"
              />
            }
          />
          <Route
            path="pendingbrands"
            element={
              <ProtectedRoute
                element={<BrandList />}
                requiredPermission="page:brand"
              />
            }
          />

          {/* Site settings */}
          <Route
            path="site-settings"
            element={
              <ProtectedRoute
                element={<SiteSettingForm />}
                requiredPermission="page:settings"
              />
            }
          />

          {/* Other settings */}
          <Route
            path="others"
            element={
              <ProtectedRoute
                element={<OtherSettings />}
                requiredPermission="other-settings"
              />
            }
          />
        </Route>

        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Home />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
