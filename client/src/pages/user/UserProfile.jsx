import React, { useEffect, useState } from 'react'
import Layout from '../../layouts/Layout'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../features/user/userSlice';

const UserProfile = () => {
    const dispatch = useDispatch();

  const { users, loading, error } = useSelector((state) => state.user);
  const{ user }= useSelector((state) => state.auth);
  const userId = user.userId // Get userId from auth state
   


  useEffect(() => {
    if (userId) {
      dispatch(fetchUser(userId));
    }
   

  }, [dispatch, userId]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!user) return <p className="text-center mt-4">No user found.</p>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
  <div className="max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 transition-all duration-300 hover:shadow-blue-200">
    <div className="flex flex-col items-center space-y-4">
      <img
        src={users?.profilePicture}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
      />
      <h2 className="text-3xl font-bold text-blue-700">{users.name}</h2>
      <p className="text-gray-600 text-sm">{users.email}</p>
    </div>

    <div className="mt-6 border-t pt-4 text-gray-700 space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800">Name:</span>
        <span>{users.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800">Email:</span>
        <span>{users.email}</span>
      </div>
    </div>
  </div>
</div>

  )
}

export default UserProfile
