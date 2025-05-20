import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "../components/Logout";

const Navbar = () => {
  const { role } = useSelector((state) => state.auth);
  const isLoggedIn = !!role;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link to="/" className="text-3xl font-extrabold text-blue-600 tracking-tight">
            ShopEase
          </Link>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-8 text-gray-700 font-medium text-base">
          <Link to="/" className="hover:text-blue-600 transition-colors duration-200">
            Home
          </Link>
          <Link to="/products" className="hover:text-blue-600 transition-colors duration-200">
            Products
          </Link>
          <Link to="/about" className="hover:text-blue-600 transition-colors duration-200">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors duration-200">
            Contact
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-5">
          {/* Cart */}
          <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 text-xl">
            🛒
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1 animate-pulse">
              3
            </span>
          </Link>

          {/* Authenticated User */}
          {isLoggedIn ? (
            role === "seller" ? (
              <Link to="/seller/profile" className="group">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="Avatar"
                  className="w-9 h-9 rounded-full border border-blue-500 group-hover:scale-110 transition-transform duration-200"
                />
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/user/profile"
                  className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                >
                  Profile
                </Link>
                <Logout />
              </div>
            )
          ) : (
            <div className="flex items-center space-x-3 text-sm">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/userregister"
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                Register
              </Link>
              <Link
                to="/sellerregister"
                className="text-white bg-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-700 transition font-medium"
              >
                Become a Seller
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
