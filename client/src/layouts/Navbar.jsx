// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "../components/Logout";
import { useState } from "react";

const Navbar = () => {
  const { role } = useSelector((state) => state.auth);
  const isLoggedIn = !!role;
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ShopEase
          </Link>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/products" className="hover:text-blue-600">
            Products
          </Link>
          <Link to="/about" className="hover:text-blue-600">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-600">
            Contact
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-blue-600"
          >
            🛒
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
              3
            </span>
          </Link>

          {isLoggedIn ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <img
                  src="https://i.pravatar.cc/40" // Replace with dynamic user image if available
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border"
                />
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-md z-50 border">
                  {role === "user" ? (
                    <>
                      <Link
                        to="/user/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/user/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                    </>
                  ) : role === "seller" ? (
                    <>
                      <Link
                        to="/seller/products"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Product Management
                      </Link>
                      <Link
                        to="/seller/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      <Link
                        to="/seller/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Seller Profile
                      </Link>
                    </>
                  ) : null}

                  <div className="border-t my-1" />
                  <div className="flex justify-between w-full py-2">
                    <Logout />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link to="/userregister" className="hover:text-blue-600">
                Register
              </Link>
              <Link to="/sellerregister" className="hover:text-blue-600">
                Become a Seller
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
