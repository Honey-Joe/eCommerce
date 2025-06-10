// src/pages/admin/Dashboard.jsx

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  FaUsers,
  FaBoxOpen,
  FaRupeeSign,
  FaShoppingCart,
} from "react-icons/fa";
import axios from "axios";
import axiosInstance from "../../axios";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    users: 0,
    products: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get("/admin/get-dashboard-stats");
      setSalesData(res.data.salesData);
      setUserGrowth(res.data.userGrowthData);
      setRevenueData(res.data.revenueData);
      setStats(res.data.stats);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-700">📊 Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            icon: FaShoppingCart,
            label: "Orders",
            value: stats.orders.toLocaleString(),
            color: "text-blue-500",
          },
          {
            icon: FaRupeeSign,
            label: "Revenue",
            value: `₹${(stats.revenue / 100000).toFixed(2)}L`,
            color: "text-green-500",
          },
          {
            icon: FaUsers,
            label: "Users",
            value: stats.users.toLocaleString(),
            color: "text-purple-500",
          },
          {
            icon: FaBoxOpen,
            label: "Products",
            value: stats.products.toLocaleString(),
            color: "text-yellow-500",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl shadow p-4 flex items-center space-x-4"
          >
            <Icon className={`text-3xl ${color}`} />
            <div>
              <p className="text-gray-500 text-sm">{label}</p>
              <h2 className="text-xl font-bold text-gray-800">{value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold mb-4 text-gray-700">Sales (Weekly)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold mb-4 text-gray-700">User Growth</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userGrowth}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 md:col-span-2">
          <h2 className="font-semibold mb-4 text-gray-700">
            Revenue by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                dataKey="value"
              >
                {revenueData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
