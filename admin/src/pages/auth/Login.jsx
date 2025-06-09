// src/pages/admin/AdminLogin.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";
import axiosInstance from "../../axios";
import { loginSchema } from "../../validation/LoginSchema";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../layouts/Layout";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/admin/login", data);

      // Assuming backend sends user object with role and permissions
      const user = response.data.user || response.data; 
      // Example user shape: { role: 'super-admin', permissions: ['user-management', ...], name: 'John' }
      console.log(user);
      dispatch(loginSuccess(user));

      // Redirect based on role
      if (user.role.name === "super-admin") {
        navigate("/admin/dashboard");
      } else if (user.role.name) {
        navigate("/admin/dashboard");
      } else {
        navigate("/unauthorized");
        toast.error("Unauthorized role");
        return;
      }

      toast.success("Login successful!");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data.message : error.message
      );
      toast.error(
        error.response?.data?.message || "Login failed! Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
          noValidate
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Admin Login
          </h2>

          {/* Email field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
