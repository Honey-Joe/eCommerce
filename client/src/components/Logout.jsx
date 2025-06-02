// src/components/LogoutButton.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import { FiLogOut } from "react-icons/fi";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(logout());
    try {
      await axiosInstance.post("/auth/logout",{},{ withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  return (
    <button
      className="flex items-center gap-3 px-4 py-2 rounded-xl w-full text-left transition-all duration-200 hover:bg-red-100 text-red-600 hover:shadow"
      onClick={handleLogout}
    >
      <FiLogOut className="text-lg" /> Logout
    </button>
  );
};

export default Logout;
