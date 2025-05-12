import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./features/auth/authSlice";
import axiosInstance from "./axios";
import Unauthorized from "./components/Unauthourized";
import ProtectedRoute from "./components/ProtectedRoute";
import UserManagement from "./pages/admin/UserManagement";
import AllSellers from "./pages/admin/SellerManagement";
import UsersManagement from "./pages/admin/UserManagement";
import SellersManagement from "./pages/admin/SellerManagement";

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
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
       <Routes>
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        
        <Route path="users" element={<UsersManagement />} />
        <Route path="sellers" element={<SellersManagement />} />

        {/* Add other routes as necessary */}
      </Route>
        <Route path="login" element={<Login></Login>}></Route>
        <Route path="/" element={<Home></Home>}></Route>
    </Routes>
    </>
  );
}

export default App;
