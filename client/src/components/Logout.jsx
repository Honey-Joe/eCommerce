// src/components/LogoutButton.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {

    dispatch(logout());
    try {
      await axiosInstance.post('/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition mx-auto"
    >
      Logout
    </button>
  );
};

export default Logout;
