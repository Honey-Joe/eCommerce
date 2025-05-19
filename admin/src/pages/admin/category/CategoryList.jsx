import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  deleteCategoryById,
  updateCategoryById,
} from '../../../features/admin/categorySlice';

const CategoryList = () => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.category.categories);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAttributes, setEditAttributes] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // When starting to edit a category, load its name and attributes into state
  const handleEdit = category => {
    setEditId(category._id);
    setEditName(category.name);
    // Make a deep copy of attributes to safely edit
    setEditAttributes(category.attributes ? JSON.parse(JSON.stringify(category.attributes)) : []);
  };

  const handleDelete = id => {
    if (confirm('Are you sure to delete this category?')) {
      dispatch(deleteCategoryById(id));
    }
  };

  // Update attribute fields on edit
  const handleAttributeChange = (index, field, value) => {
    const updated = [...editAttributes];
    updated[index][field] = value;
    // Reset options if type changes and is no longer dropdown
    if (field === 'type' && value !== 'dropdown') {
      updated[index].options = [];
    }
    setEditAttributes(updated);
  };

  // Update dropdown options (comma-separated)
  const handleOptionsChange = (index, value) => {
    const updated = [...editAttributes];
    updated[index].options = value.split(',').map(o => o.trim());
    setEditAttributes(updated);
  };

  // Add new attribute while editing
  const handleAddAttribute = () => {
    setEditAttributes(prev => [...prev, { name: '', type: 'text', options: [] }]);
  };

  // Remove an attribute
  const handleRemoveAttribute = (index) => {
    setEditAttributes(prev => prev.filter((_, i) => i !== index));
  };

  // Save updated category name + attributes
  const handleUpdate = () => {
    if (editName.trim()) {
      dispatch(updateCategoryById(editId, { name: editName, attributes: editAttributes }));
      setEditId(null);
      setEditName('');
      setEditAttributes([]);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Category List</h1>
      <ul className="space-y-4">
        {categories.map(cat => (
          <li
            key={cat._id}
            className="bg-white shadow-md p-4 rounded-lg"
          >
            {editId === cat._id ? (
              <>
                {/* Edit Category Name */}
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="border px-2 py-1 rounded w-full mb-4"
                />

                {/* Edit Attributes */}
                <div className="space-y-3 mb-4">
                  {editAttributes.map((attr, index) => (
                    <div key={index} className="border p-3 rounded relative">
                      <input
                        type="text"
                        placeholder="Attribute Name"
                        value={attr.name}
                        onChange={e => handleAttributeChange(index, 'name', e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                      />
                      <select
                        value={attr.type}
                        onChange={e => handleAttributeChange(index, 'type', e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="dropdown">Dropdown</option>
                      </select>
                      {attr.type === 'dropdown' && (
                        <input
                          type="text"
                          placeholder="Comma separated options"
                          value={attr.options.join(', ')}
                          onChange={e => handleOptionsChange(index, e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(index)}
                        className="absolute top-2 right-2 text-red-600 font-bold"
                        title="Remove attribute"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    + Add Attribute
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-lg">{cat.name}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {/* Show attributes in read-only mode */}
                {cat.attributes && cat.attributes.length > 0 && (
                  <ul className="pl-4 list-disc text-sm text-gray-700">
                    {cat.attributes.map((attr, idx) => (
                      <li key={idx}>
                        <strong>{attr.name}</strong> ({attr.type}
                        {attr.type === 'dropdown' ? `: ${attr.options.join(', ')}` : ''})
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
