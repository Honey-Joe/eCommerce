import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCategoryMessages, createCategory } from "../../../features/admin/categorySlice";

const AdminCreateCategory = () => {
  const [name, setName] = useState("");
  const [attributes, setAttributes] = useState([]);

  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.category);

  const handleAddAttribute = () => {
    setAttributes((prev) => [...prev, { name: "", type: "text", options: [] }]);
  };

  const handleAttributeChange = (index, field, value) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const handleOptionsChange = (index, value) => {
    const updated = [...attributes];
    updated[index].options = value.split(",").map((o) => o.trim());
    setAttributes(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCategory({ name, attributes }));

    setName("");
    setAttributes([]);

    setTimeout(() => dispatch(clearCategoryMessages()), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold">Create Category</h2>

      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
        className="w-full p-2 border rounded"
        required
      />

      <button type="button" onClick={handleAddAttribute} className="btn">
        + Add Attribute
      </button>

      {attributes.map((attr, index) => (
        <div key={index} className="border p-2 rounded">
          <input
            type="text"
            placeholder="Attribute Name"
            value={attr.name}
            onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            value={attr.type}
            onChange={(e) => handleAttributeChange(index, "type", e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="dropdown">Dropdown</option>
          </select>
          {attr.type === "dropdown" && (
            <input
              type="text"
              placeholder="Comma separated options"
              onChange={(e) => handleOptionsChange(index, e.target.value)}
              className="w-full p-2 border rounded"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        className="btn bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
};

export default AdminCreateCategory;
