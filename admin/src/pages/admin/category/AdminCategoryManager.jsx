import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  fetchCategories,
  deleteCategoryById,
  updateCategoryById,
  clearCategoryMessages,
} from "../../../features/admin/categorySlice";

const AdminCategoryManager = () => {
  const dispatch = useDispatch();
  const { categories, loading, error, successMessage } = useSelector(
    (state) => state.category
  );

  const [name, setName] = useState("");
  const [slug, setSlug] = useState(""); // New slug state
  const [aliases, setAliases] = useState([]); // New aliases state (array)
  const [attributes, setAttributes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [aliasesInput, setAliasesInput] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const resetForm = () => {
    setName("");
    setSlug("");
    setAliases([]);
    setAttributes([]);
      setAliasesInput("");

    setEditId(null);
    setTimeout(() => dispatch(clearCategoryMessages()), 3000);
  };

  const handleAddAttribute = () => {
    setAttributes((prev) => [...prev, { name: "", type: "text", options: [] }]);
  };

  const handleAttributeChange = (index, field, value) => {
    const updated = [...attributes];
    updated[index][field] = value;
    if (field === "type" && value !== "dropdown") {
      updated[index].options = [];
    }
    setAttributes(updated);
  };

  const handleOptionsChange = (index, value) => {
    const updated = [...attributes];
    updated[index].options = value.split(",").map((opt) => opt.trim());
    setAttributes(updated);
  };

  const handleRemoveAttribute = (index) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle aliases input as comma-separated string
  const handleAliasesChange = (value) => {
    setAliases(
      value
        .split(",")
        .map((alias) => alias.trim())
        .filter(Boolean)
    );
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const aliasesArray = aliasesInput
    .split(",")
    .map((alias) => alias.trim())
    .filter(Boolean);

  const categoryData = { name, slug, aliases: aliasesArray, attributes };

  if (editId) {
    dispatch(updateCategoryById(editId, categoryData));
  } else {
    dispatch(createCategory(categoryData));
  }

  resetForm();
};


  const handleEdit = (cat) => {
    setEditId(cat._id);
    setName(cat.name);
    setSlug(cat.slug || "");
    setAliases(cat.aliases || []);
      setAliasesInput((cat.aliases || []).join(", "));

    setAttributes(JSON.parse(JSON.stringify(cat.attributes || [])));
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure to delete this category?")) {
      dispatch(deleteCategoryById(id));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Category Manager
      </h1>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-gray-100"
      >
        <h2 className="text-2xl font-semibold text-gray-700">
          {editId ? "Edit Category" : "Create New Category"}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && (
          <p className="text-green-600 text-sm">{successMessage}</p>
        )}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* New Slug input */}
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Slug (e.g. category-name)"
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* New Aliases input */}
        <input
          type="text"
          value={aliasesInput}
          onChange={(e) => setAliasesInput(e.target.value)}
          placeholder="Aliases (comma separated)"
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Attributes */}
        <div className="space-y-4">
          {attributes.map((attr, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm relative"
            >
              <input
                type="text"
                placeholder="Attribute Name"
                value={attr.name}
                onChange={(e) =>
                  handleAttributeChange(index, "name", e.target.value)
                }
                className="w-full p-2 mb-2 border rounded-md focus:ring-2 focus:ring-blue-300"
              />
              <select
                value={attr.type}
                onChange={(e) =>
                  handleAttributeChange(index, "type", e.target.value)
                }
                className="w-full p-2 mb-2 border rounded-md"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="dropdown">Dropdown</option>
              </select>
              {attr.type === "dropdown" && (
                <input
                  type="text"
                  placeholder="Comma separated options"
                  value={attr.options.join(", ")}
                  onChange={(e) => handleOptionsChange(index, e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              )}
              <button
                type="button"
                onClick={() => handleRemoveAttribute(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
                title="Remove attribute"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddAttribute}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            + Add Attribute
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-5 py-2 rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            {loading
              ? "Saving..."
              : editId
              ? "Update Category"
              : "Create Category"}
          </button>
        </div>
      </form>

      {/* CATEGORY LIST */}
      <div className="bg-white mt-10 p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          All Categories
        </h2>
        <ul className="space-y-6">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition bg-gray-50"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div className="flex-1 space-y-2">
                  <p className="text-lg font-semibold text-gray-800">
                    {cat.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Slug: <em>{cat.slug}</em>
                  </p>
                  {cat.aliases?.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Aliases: {cat.aliases.join(", ")}
                    </p>
                  )}
                  {cat.attributes?.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                      {cat.attributes.map((attr, idx) => (
                        <li key={idx}>
                          <strong>{attr.name}</strong> ({attr.type}
                          {attr.type === "dropdown"
                            ? `: ${attr.options.join(", ")}`
                            : ""}
                          )
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminCategoryManager;
