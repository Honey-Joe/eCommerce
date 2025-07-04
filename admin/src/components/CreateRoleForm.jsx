import React, { useState } from "react";
import axios from "axios";
import PERMISSIONS from "./Permission"; // Adjust path if needed
import axiosInstance from "../axios";

const CreateRoleForm = () => {
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const permissionOptions = Object.entries(PERMISSIONS).map(([key, value]) => {
    const category = value.startsWith("page:")
      ? "Page Permissions"
      : "Feature Permissions";
    return { key, value, label: value, category };
  });

  const groupedPermissions = permissionOptions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {});

  const togglePermission = (permValue) => {
    setSelectedPermissions((prev) =>
      prev.includes(permValue)
        ? prev.filter((p) => p !== permValue)
        : [...prev, permValue]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Role name is required");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await axiosInstance.post("/roles", {
        name,
        permissions: selectedPermissions,
      });

      setMessage("✅ Role created successfully");
      setName("");
      setSelectedPermissions([]);
    } catch (error) {
      console.error("Failed to create role:", error);
      const msg = error.response?.data?.message || "Error creating role";
      setMessage("❌ " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Create Role</h2>

      {message && (
        <p style={{ textAlign: "center", color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}

      <div style={{ marginBottom: 16 }}>
        <label>
          Role Name: <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. admin, manager"
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </label>
      </div>

      <fieldset style={{ border: "1px solid #ccc", padding: 16 }}>
        <legend><strong>Select Permissions</strong></legend>

        {Object.entries(groupedPermissions).map(([category, perms]) => (
          <div key={category} style={{ marginBottom: 12 }}>
            <strong>{category}</strong>
            <div style={{ paddingLeft: 10 }}>
              {perms.map(({ key, value, label }) => (
                <label key={key} style={{ display: "block", marginBottom: 6 }}>
                  <input
                    type="checkbox"
                    value={value}
                    checked={selectedPermissions.includes(value)}
                    onChange={() => togglePermission(value)}
                  />{" "}
                  {label}
                </label>
              ))}
            </div>
          </div>
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: 16,
          padding: "10px 20px",
          backgroundColor: loading ? "#aaa" : "#4caf50",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading ? "Creating..." : "Create Role"}
      </button>
    </form>
  );
};

export default CreateRoleForm;
