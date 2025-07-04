import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../features/auth/authSlice";
import { userRegisterSchema } from "../../validation/RegisterSchema";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../layouts/Layout";

const UserRegister = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userRegisterSchema),
  });

  const [location, setLocation] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
      },
      (err) => {
        console.error("Geolocation error:", err);
        toast.warn("Enable location services to register.");
      }
    );
  }, []);

  const onSubmit = async (formData) => {
    if (!location) return toast.error("Location is required to register.");

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("location[latitude]", location.latitude);
    payload.append("location[longitude]", location.longitude);

    if (profilePicture) {
      payload.append("profilePicture", profilePicture);
    }

    try {
      dispatch(registerStart());
      const res = await axiosInstance.post("/auth/register/user", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(registerSuccess({ user: res.data.user, role: "user" }));
      navigate("/user/login");
      toast.success("User registered successfully!");
    } catch (err) {
      dispatch(registerFailure(err.response?.data?.message || "Registration failed"));
      toast.error(err.response?.data?.message || "Registration failed");
      console.error("Registration error:", err);
    }
  };

  return (
    <Layout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">User Register</h2>

        <div>
          <input
            {...register("name")}
            placeholder="Name"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <input
            {...register("password")}
            placeholder="Password"
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            className="w-full text-gray-700 text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Upload profile picture (optional)</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">User registered successfully!</p>}
      </form>
    </Layout>
  );
};

export default UserRegister;
