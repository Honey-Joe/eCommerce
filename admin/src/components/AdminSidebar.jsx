import React from "react";
import { Link, useLocation } from "react-router-dom";

const sidebarLinks = [
  { label: "Users", path: "/admin/users", perm: "user:manage" },
  { label: "Sellers", path: "/admin/sellers", perm: "page:seller" },
  { label: "Products", path: "/admin/products", perm: "page:product" },
  { label: "Categories", path: "/admin/categories", perm: "page:category" },
  { label: "Brands", path: "/admin/brands", perm: "page:brand" },
  { label: "Settings", path: "/admin/settings", perm: "page:settings" },
  { label: "Roles", path: "/admin/roles", perm: "page:roles" },
];

const AdminSidebar = ({ user }) => {
  const location = useLocation();

  if (!user || !user.role || !user.permissions) return null;

  const allowedLinks = sidebarLinks.filter(
    (link) =>
      user.role === "super-admin" || user.permissions.includes(link.perm)
  );

  return (
    <nav className="w-64 bg-gray-100 p-4 h-full" aria-label="Admin Sidebar">
      <ul className="space-y-2">
        {allowedLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block px-3 py-2 rounded hover:bg-gray-200 ${
                location.pathname === link.path ? "bg-gray-300 font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminSidebar;
