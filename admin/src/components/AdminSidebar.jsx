import React from "react";
import { Link } from "react-router-dom";

const sidebarLinks = [
  { label: "Users", path: "/admin/users", perm: "page:user" },
  { label: "Sellers", path: "/admin/sellers", perm: "page:seller" },
  { label: "Products", path: "/admin/products", perm: "page:product" },
  { label: "Categories", path: "/admin/categories", perm: "page:category" },
  { label: "Brands", path: "/admin/brands", perm: "page:brand" },
  { label: "Settings", path: "/admin/settings", perm: "page:settings" },
  { label: "Roles", path: "/admin/roles", perm: "page:roles" },
];

const AdminSidebar = ({ user }) => {
  if (!user || !user.permissions) return null;

  const allowed = sidebarLinks.filter(link =>
    user.role === "super-admin" || user.permissions.includes(link.perm)
  );

  return (
    <aside className="sidebar">
      {allowed.map(link => (
        <Link to={link.path} key={link.path}>
          {link.label}
        </Link>
      ))}
    </aside>
  );
};

export default AdminSidebar;
