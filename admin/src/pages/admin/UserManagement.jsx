// UsersManagement.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUsers, setError, selectUsers } from '../../features/admin/adminSlice';
import axiosInstance from '../../axios';

const UsersManagement = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);

  const fetchUsers = async () => {
    dispatch(setLoading());
    try {
      const res = await axiosInstance.get('/admin/users', { withCredentials: true });
      dispatch(setUsers(res.data));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch users'));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">Status: {user.status}</p>
            {/* Add buttons for actions, such as "Approve" or "Deactivate" */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersManagement;
