// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from '../components/Logout';

const Navbar = () => {
  const {  role } = useSelector((state) => state.auth);
  const isLoggedIn = !!role;

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-2xl font-bold text-blue-600">ShopEase</Link>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact</Link> 
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
            🛒
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">3</span>
          </Link>

          {isLoggedIn ? (
            <>
              <Link to={`/${role}/dashboard`} className="hover:text-blue-600">
                Dashboard
              </Link>
              <Logout />
            </>
          ) : (
            <Link to="/login" className="hover:text-blue-600">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
