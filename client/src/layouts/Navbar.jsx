import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "../components/Logout";

const Navbar = () => {
  const { role } = useSelector((state) => state.auth);
  console.log(role);
  const isLoggedIn = !!role;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div>
          {isLoggedIn ? (
            role === "seller" ? (
              <>
                {
                  <Link
                    to="/seller/home"
                    className="text-3xl font-extrabold text-blue-600 tracking-tight"
                  >
                    ShopEase
                  </Link>
                }
              </>
            ) : role === "user" ? (
              <>
                <Link
                  to="/user/home"
                  className="text-3xl font-extrabold text-blue-600 tracking-tight"
                >
                  ShopEase
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-3xl font-extrabold text-blue-600 tracking-tight"
                >
                  ShopEase
                </Link>
              </>
            )
          ) : (
            <>
              <Link
                to="/"
                className="text-3xl font-extrabold text-blue-600 tracking-tight"
              >
                ShopEase
              </Link>
            </>
          )}
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-8 text-gray-700 font-medium text-base">
          
          {isLoggedIn ? (
            role === "seller" ? (
              <Link
                to="/seller/products"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Products
              </Link>
            ) : role === "user" ? (
              <Link
                to="/user/product"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Products
              </Link>
            ) : (
              <Link
                to="/"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Products
              </Link>
            )
          ) : null}
        </div>

        {/* Right Side Desktop */}
        <div className="hidden md:flex items-center space-x-5">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-blue-600 text-xl"
            aria-label="Cart"
          >
            🛒
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1 animate-pulse">
              3
            </span>
          </Link>

          {/* Authenticated User */}
          {isLoggedIn ? (
            role === "seller" ? (
              <Link
                to="/seller/profile"
                className="group"
                aria-label="Seller Profile"
              >
                <img
                  src="https://i.pravatar.cc/40"
                  alt="Avatar"
                  className="w-9 h-9 rounded-full border border-blue-500 group-hover:scale-110 transition-transform duration-200"
                />
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/user/dashboard"
                  className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                >
                  Profile
                </Link>
                <Logout />
              </div>
            )
          ) : (
            <>
              <Link
                to="/user/login"
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                User Login
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
              <Link
                to="/seller/login"
                className="text-white bg-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-700 transition font-medium"
              >
                Seller Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
          aria-label="Toggle menu"
        >
          <svg
            className="h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-inner">
          <div className="px-4 pt-4 pb-5 space-y-4">
            
             {isLoggedIn ? (
            role === "seller" ? (
              <Link
                to="/seller/products"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Products
              </Link>
            ) : role === "user" ? (
              <Link
                to="/user/product"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Products
              </Link>
            ) : (
              <Link
                to="/"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Products
              </Link>
            )
          ) : null}

            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="block relative text-gray-700 hover:text-blue-600 text-xl"
              aria-label="Cart"
            >
              🛒
              <span className="absolute top-0 right-0 mt-0.5 -mr-2 text-xs bg-red-500 text-white rounded-full px-1 animate-pulse">
                3
              </span>
            </Link>

            {isLoggedIn ? (
              role === "seller" ? (
                <Link
                  to="/seller/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-3"
                >
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="Avatar"
                    className="w-9 h-9 rounded-full border border-blue-500"
                  />
                  <span className="text-blue-600 font-medium">
                    Seller Profile
                  </span>
                </Link>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/user/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition text-center font-medium"
                  >
                    Profile
                  </Link>
                  <Logout />
                </div>
              )
            ) : (
              <div className="space-y-3">
                <Link
                  to="/user/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                >
                  User Login
                </Link>
                <Link
                  to="/userregister"
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                >
                  Register
                </Link>
                <Link
                  to="/sellerregister"
                  onClick={() => setMenuOpen(false)}
                  className="block text-white bg-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-700 transition text-center font-medium"
                >
                  Become a Seller
                </Link>
                <Link
                  to="/seller/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-white bg-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-700 transition text-center font-medium"
                >
                  Seller Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
