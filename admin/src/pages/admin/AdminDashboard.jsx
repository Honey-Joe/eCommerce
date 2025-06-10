import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setUsers,
  setSellers,
  setError,
  selectUsers,
  selectSellers,
} from "../../features/admin/adminSlice";
import axiosInstance from "../../axios";
import Layout from "../../layouts/Layout";
import { ChevronDown, ChevronUp, Menu, Shield, X } from "lucide-react";
import Dashboard from "./Dashboard";

// Sidebar config with permission keys and a super admin exclusive section
const sidebarSections = [
  {
    label: "User Management",
    icon: "👥",
    sectionKey: "user",
    links: [{ path: "/admin/users", label: "View Users", perm: "page:user" }],
  },
  {
    label: "Seller Management",
    icon: "🛍️",
    sectionKey: "seller",
    links: [
      {
        path: "/admin/sellers/approved",
        label: "Approved Sellers",
        perm: "page:seller",
      },
      {
        path: "/admin/sellers/pending",
        label: "Pending Sellers",
        perm: "page:seller",
      },
      {
        path: "/admin/sellers/disabled",
        label: "Disabled Sellers",
        perm: "page:seller",
      },
    ],
  },
  {
    label: "Product Management",
    icon: "📦",
    sectionKey: "product",
    links: [
      {
        path: "/admin/products/approved",
        label: "Approved Products",
        perm: "page:product",
      },
      {
        path: "/admin/products/pending",
        label: "Pending Products",
        perm: "page:product",
      },
      {
        path: "/admin/products/disabled",
        label: "Disabled Products",
        perm: "page:product",
      },
    ],
  },
  {
    label: "Category Management",
    icon: "📁",
    sectionKey: "category",
    links: [
      {
        path: "/admin/addcategory",
        label: "Add Category",
        perm: "page:category",
      },
    ],
  },
  {
    label: "Brand Management",
    icon: "📁",
    sectionKey: "brand",
    links: [
      { path: "/admin/brand", label: "Manage Brand", perm: "brand-management" },
      {
        path: "/admin/pendingbrands",
        label: "Pending Brands",
        perm: "page:brand",
      },
    ],
  },
  {
    label: "Site Settings",
    icon: "⚙️",
    sectionKey: "site",
    links: [
      {
        path: "/admin/site-settings",
        label: "General Settings",
        perm: "page:settings",
      },
    ],
  },
  {
    label: "Other Settings",
    icon: "🔧",
    sectionKey: "other",
    links: [
      { path: "/admin/others", label: "Misc Settings", perm: "other-settings" },
    ],
  },
  // Super Admin Exclusive section
  {
    label: "Role Management",
    icon: "🛡️",
    sectionKey: "role",
    links: [
      { path: "/admin/roles", label: "Manage Roles", perm: "page:roles" },
    ],
    superAdminOnly: true,
  },
  {
    label: "Admin Management",
    icon: "🛡️",
    sectionKey: "admin",
    links: [
      { path: "/admin/get", label: "All Admins", perm: "page:roles" },
      { path: "/admin/create", label: "Create Admin", perm: "page:roles" },
    ],
    superAdminOnly: true,
  },
];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const sellers = useSelector(selectSellers);
  const user = useSelector((state) => state.auth); // Current user with role & permissions
  const location = useLocation();
  const [openSection, setOpenSection] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef();

  useEffect(() => {
    const fetchAdminData = async () => {
      dispatch(setLoading());
      try {
        const [usersRes, sellersRes] = await Promise.all([
          axiosInstance.get("/admin/users", { withCredentials: true }),
          axiosInstance.get("/admin/sellers", { withCredentials: true }),
        ]);
        dispatch(setUsers(usersRes.data));
        dispatch(setSellers(sellersRes.data));
      } catch (error) {
        dispatch(
          setError(
            error.response?.data?.message || "Failed to fetch admin data"
          )
        );
      }
    };
    fetchAdminData();
  }, [dispatch]);

  const toggleAccordion = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newWidth = Math.min(Math.max(200, e.clientX), 400);
    setSidebarWidth(newWidth);
  };
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const showDashboardStats = location.pathname === "/admin/dashboard";

  const renderSidebarSections = () => {
    if (!user) return null;
    return sidebarSections
      .filter((section) => {
        // Show if super-admin or permission exists
        if (user.role === "super-admin") return true;
        // Skip superAdminOnly sections for non super-admins
        if (section.superAdminOnly) return false;
        // Otherwise, check permissions on links
        return section.links.some((link) =>
          user.permissions.includes(link.perm)
        );
      })
      .map(({ label, icon, sectionKey, links }) => {
        const allowedLinks =
          user.role === "super-admin"
            ? links
            : links.filter((link) => user.permissions.includes(link.perm));
        if (allowedLinks.length === 0) return null;

        return (
          <div key={sectionKey}>
            <button
              onClick={() => toggleAccordion(sectionKey)}
              className="w-full flex justify-between items-center px-2 py-2 hover:text-blue-600 font-medium"
              type="button"
            >
              <span>
                {icon} {label}
              </span>
              <span>
                {openSection === sectionKey ? (
                  <ChevronUp size={"16px"} />
                ) : (
                  <ChevronDown size={"16px"} />
                )}
              </span>
            </button>
            {openSection === sectionKey && (
              <div className="ml-4 mt-1 space-y-1 transition-all duration-300">
                {allowedLinks.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `block px-2 py-1 rounded hover:bg-blue-100 ${
                        isActive ? "text-blue-600 font-semibold" : ""
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <Layout>
      <div className="flex h-screen overflow-hidden bg-gray-100 relative">
        {/* Mobile Toggle */}
        <button
          className="absolute top-4 left-4 z-50 md:hidden bg-white p-2 rounded shadow"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>

        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`bg-white shadow-md overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? "block" : "hidden"
          } md:block`}
          style={{ width: sidebarWidth }}
        >
          <div className="p-6 text-lg font-bold text-blue-600">
            Admin Panel
            <div className="text-xs font-normal text-gray-500 mt-1">
              {/* Show role */}
              Role:{" "}
              <span
                className={`font-semibold ${
                  user?.role === "super-admin"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {user?.role?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>
          </div>

          <nav className="p-4 space-y-3 text-gray-700 text-sm">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `block px-2 py-2 rounded hover:bg-blue-100 ${
                  isActive ? "text-blue-600 font-bold" : ""
                }`
              }
            >
              🏠 Dashboard
            </NavLink>

            {/* Render dynamic sidebar */}
            {renderSidebarSections()}
          </nav>

          {/* Drag Handle */}
          <div
            className="absolute top-0 right-0 h-full w-2 cursor-col-resize"
            onMouseDown={handleMouseDown}
            role="separator"
            aria-orientation="vertical"
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {showDashboardStats ? (
            <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm text-gray-500">Total Users</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {users.length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm text-gray-500">Total Sellers</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {sellers.length}
                </p>
              </div>

            </div>
            <Dashboard></Dashboard>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
