import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../features/auth/authSlice";
import { sellerSchema } from "../../validation/SellerSchema";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../layouts/Layout";
import { useState } from "react";

const SellerRegister = () => {
  const dispatch = useDispatch();
  const { loading, error, success, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sellerSchema),
  });

  const onSubmit = async (data) => {
    try {
      dispatch(registerStart());

      // Prepare form data for the registration request
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("businessName", data.businessName);
      formData.append("storeLocation", data.storeLocation);

      // Send the registration request
      const res = await axiosInstance.post("/auth/register/seller", formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Important!
      });

      // Dispatch success action and navigate to login
      dispatch(registerSuccess({ user: res.data.user, role: "seller" }));
      toast.success("Seller registered successfully!");
      navigate("/login");
    } catch (err) {
      dispatch(
        registerFailure(err.response?.data?.message || "Registration failed")
      );
      toast.error(err.response?.data?.message || "Registration failed");
      console.log(err)
    }
  };

  return (
    <Layout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Seller Registration
        </h2>

        {/* Name Input */}
        <input
          {...register("name")}
          placeholder="Name"
          className="w-full px-4 py-2 border rounded focus:ring-blue-500"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}

        {/* Email Input */}
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded focus:ring-blue-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        {/* Password Input */}
        <input
          {...register("password")}
          placeholder="Password"
          type="password"
          className="w-full px-4 py-2 border rounded focus:ring-blue-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {/* Business Name Input */}
        <input
          {...register("businessName")}
          placeholder="Business Name"
          className="w-full px-4 py-2 border rounded focus:ring-blue-500"
        />
        {errors.businessName && (
          <p className="text-red-500 text-sm">{errors.businessName.message}</p>
        )}

        {/* Store Location Input */}
        <input
          {...register("storeLocation")}
          placeholder="Store Location"
          className="w-full px-4 py-2 border rounded focus:ring-blue-500"
        />
        {errors.storeLocation && (
          <p className="text-red-500 text-sm">{errors.storeLocation.message}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Error/Success Message */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">
            Seller registered successfully!
          </p>
        )}
      </form>
    </Layout>
  );
};

export default SellerRegister;
