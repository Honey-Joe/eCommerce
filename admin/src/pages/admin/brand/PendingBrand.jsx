import { useDispatch, useSelector } from 'react-redux';
import { changeBrandStatus, fetchBrands } from '../../../features/admin/brandSlice';
import { useEffect } from 'react';

const BrandList = () => {
  const dispatch = useDispatch();
  const { brands, loading } = useSelector((state) => state.brand);

  useEffect(() => {
    dispatch(fetchBrands());
  }, []);

  const handleStatusChange = (id, newStatus) => {
    dispatch(changeBrandStatus(id, newStatus));
  };

  return (
    <div>
       <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Brand Management</h2>
      {loading ? (
        <p className="text-blue-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Brand Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {brands.map((brand, index) => (
                <tr key={brand._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{brand.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        brand.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : brand.status === 'disabled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {brand.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(brand._id, 'approved')}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(brand._id, 'disabled')}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Disable
                    </button>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No brands found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
};

export default BrandList;
