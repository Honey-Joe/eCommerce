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
  Legend,
} from "recharts";
import {
  FaUsers,
  FaBoxOpen,
  FaRupeeSign,
  FaShoppingCart,
} from "react-icons/fa";
import axiosInstance from "../../axios";
import LocationDashboard from "../../components/LocationDashboard";

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    users: 0,
    products: 0,
  });

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/admin/get-dashboard-stats");
        
        // Set all data from response
        console.log(res.data)
        setData(res.data)
        setStats(res.data.stats || {
          orders: 0,
          revenue: 0,
          users: 0,
          products: 0,
        });
        
        setSalesData(res.data.salesData || []);
        setUserGrowth(res.data.userGrowthData || []);
        
        // Process revenue data with colors
        const coloredRevenueData = (res.data.revenueData || []).map((item) => ({
          ...item,
          color: getRandomColor(),
        }));
        
        setRevenueData(coloredRevenueData);
        
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-700">📊 Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            icon: FaShoppingCart,
            label: "Orders",
            value: stats?.orders?.toLocaleString() || "0",
            color: "text-blue-500",
          },
          {
            icon: FaRupeeSign,
            label: "Revenue",
            value: stats?.revenue ? `₹${(stats.revenue / 100000).toFixed(2)}L` : "₹0",
            color: "text-green-500",
          },
          {
            icon: FaUsers,
            label: "Users",
            value: stats?.users?.toLocaleString() || "0",
            color: "text-purple-500",
          },
          {
            icon: FaBoxOpen,
            label: "Products",
            value: stats?.products?.toLocaleString() || "0",
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
        {/* Sales Chart */}
        {salesData?.length > 0 && (
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
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* User Growth Chart */}
        {userGrowth?.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold mb-4 text-gray-700">User Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userGrowth}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#82ca9d" />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Revenue by Category */}
        {revenueData?.length > 0 && (
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
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <LocationDashboard data={data}></LocationDashboard>
    </div>
  );
};

export default Dashboard;