import { Routes, Route } from "react-router-dom";
import SellerDashboard from "./pages/seller/SellerDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import Login from "./pages/auth/Login";
import Unauthorized from "./components/Unauthorized";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserRegister from "./pages/auth/UserRegister";
import SellerRegister from "./pages/auth/SellerRegister";
import axiosInstance from "./axios";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./features/auth/authSlice";
import { useEffect } from "react";
import SellerProfile from "./pages/seller/SellerProfile";
import ProductDetails from "./pages/product/ProductDetails";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("auth/me");
        const {
          role,
          status,
          userId,
          name,
          email,
          storeLocation,
          businessName,
        } = res.data;
        dispatch(
          loginSuccess({
            role,
            status,
            userId,
            name,
            email,
            storeLocation,
            businessName,
          })
        );
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
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Home />} />
        <Route path="/userregister" element={<UserRegister />} />
        <Route path="/sellerregister" element={<SellerRegister />} />

        {/* Protected User Route */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>

        {/* Protected Seller Route */}
        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route path="/seller/products" element={<SellerDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route path="/seller/profile" element={<SellerProfile />} />
        </Route>
        <Route path="/product/:id" element={<ProductDetails></ProductDetails>} />
      </Routes>
    </>
  );
}

export default App;
