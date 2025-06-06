// src/components/Footer.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Footer = () => {

  const {settings} = useSelector((state)=>state.siteSetting)

  return (
    <footer className="bg-gray-100 text-gray-700 mt-10 border-t">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div>
          <h3 className="text-xl font-bold text-blue-600 mb-2">{settings?.siteName}</h3>
          <p className="text-sm">
            Your one-stop shop for all things fashion, tech, and lifestyle.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
            <li><Link to="/products" className="hover:text-blue-500">Shop</Link></li>
            <li><Link to="/cart" className="hover:text-blue-500">Cart</Link></li>
            <li><Link to="/contact" className="hover:text-blue-500">Contact</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="font-semibold mb-2">Customer Service</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/faq" className="hover:text-blue-500">FAQ</Link></li>
            <li><Link to="/returns" className="hover:text-blue-500">Returns</Link></li>
            <li><Link to="/support" className="hover:text-blue-500">Support</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-blue-500">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-2">Contact Us</h4>
          <p className="text-sm">📍 Trichy, India</p>
          <p className="text-sm">📞 +91 98765 43210</p>
          <p className="text-sm">✉️ support@shopease.com</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center py-4 text-sm border-t bg-gray-50">
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
