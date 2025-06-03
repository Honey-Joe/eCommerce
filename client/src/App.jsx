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
import UserProductDetails from "./pages/user/UserProductDetails";
import UserHome from "./pages/user/UserHome";
import SellerHome from "./pages/seller/SellerHome";
import SellerProductMain from "./pages/seller/SellerProductMain";
import UserProduct from "./pages/user/UserProduct";
import UserSearch from "./pages/user/UserSearch";
import SellerSearch from "./pages/seller/SellerSearch";
import UserCategory from "./pages/user/UserCategory";
import SellerResults from "./pages/seller/SellerResults";
import CartPage from "./pages/user/CartPage";
import PlaceOrderPage from "./pages/user/PlaceOrderPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("auth/me");
        const { role, status, userId, name, email, businessName, location, profilePicture } =
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
            profilePicture,
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
          <Route path="/seller/products" element={<SellerProductMain />} />
        </Route>
         <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route path="/seller/home" element={<SellerHome />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route
            path="/product/:id"   
            element={<ProductDetails></ProductDetails>}
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route
            path="user/productdetails/:id"
            element={<UserProductDetails></UserProductDetails>}
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route
            path="user/home"
            element={<UserHome></UserHome>}
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route
            path="user/product"
            element={<UserProduct></UserProduct>}
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route
            path="user/search"
            element={<UserSearch></UserSearch>}
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route
            path="user/category/:categoryId"
            element={<UserCategory></UserCategory>}
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route
            path="user/cart"
            element={<CartPage></CartPage>}
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route
            path="user/checkout"
            element={<PlaceOrderPage></PlaceOrderPage>}
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route
            path="seller/search"
            element={<SellerSearch></SellerSearch>}
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route
            path="seller/results/search"
            element={<SellerResults></SellerResults>}
          />
        </Route>


        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </>
  );
}

export default App;
