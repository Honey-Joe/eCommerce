import { Routes, Route } from "react-router-dom";
import UserDashboard from "./pages/user/UserDashboard";
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
import SellerProfilePage from "./pages/seller/SellerProfilePage";
import UserLogin from "./pages/auth/UserLogin";
import SellerLogin from "./pages/auth/SellerLogin";
import UserProfile from "./pages/user/UserProfile";
import SearchPage from "./components/SearchPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("auth/me");
        const { role, status, userId, name, email, businessName, location } =
          res.data;
        dispatch(
          loginSuccess({
            role,
            status,
            userId,
            name,
            email,
            businessName,
            location,
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
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/seller/login" element={<SellerLogin />} />
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
          <Route path="/seller/profile" element={<SellerProfilePage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route path="/seller/product" element={<SellerProfile />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route
            path="/product/:id"
            element={<ProductDetails></ProductDetails>}
          />
        </Route>

        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </>
  );
}

export default App;
