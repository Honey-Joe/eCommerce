import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useEffect } from "react";
import { useDispatch , useSelector} from "react-redux";
import { loginSuccess, logout } from "./features/auth/authSlice";
import axiosInstance from "./axios";
import UsersManagement from "./pages/admin/UserManagement";
import SellersManagement from "./pages/admin/SellerManagement";
import UserList from "./pages/admin/users/UserList";
import ApprovedSellers from "./pages/admin/seller/ApprovedSellers";
import PendingSellers from "./pages/admin/seller/PendingSellers";
import DisabledSellers from "./pages/admin/seller/DisabledSellers";
import SiteSettings from "./pages/admin/sitesettings/SiteSettings";
import OtherSettings from "./pages/admin/sitesettings/OtherSettings";
import ApprovedProducts from "./pages/admin/products/ApprovedProducts";
import PendingProducts from "./pages/admin/products/PendingProducts";
import DisabledProducts from "./pages/admin/products/DisabledProducts";
import { fetchProducts } from "./features/admin/productSlice";
import AdminCreateCategory from "./pages/admin/category/AdminCreateCategory";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/admin/me");
        const { role } = res.data;
        dispatch(loginSuccess({ role }));
      } catch (err) {
        dispatch(logout());
      }
    };

    checkAuth(); // Run on every refresh
    dispatch(fetchProducts())
  }, [dispatch]);



  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="users" element={<UsersManagement />} />
          <Route path="sellers" element={<SellersManagement />} />
          <Route path="users" element={<UserList />} />
          <Route path="sellers/approved" element={<ApprovedSellers />} />
          <Route path="sellers/pending" element={<PendingSellers />} />
          <Route path="sellers/disabled" element={<DisabledSellers />} />
          <Route path="products/approved" element={<ApprovedProducts />} />
          <Route path="products/pending" element={<PendingProducts />} />
          <Route path="products/disabled" element={<DisabledProducts />} />
          <Route path="site-settings" element={<SiteSettings />} />
          <Route path="others" element={<OtherSettings />} />
          <Route path="addcategory" element={<AdminCreateCategory />} />

          {/* Add other routes as necessary */}
        </Route>
        <Route path="login" element={<Login></Login>}></Route>
        <Route path="/" element={<Home></Home>}></Route>
      </Routes>
    </>
  );
}

export default App;
