import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationDashboard = ({ data }) => {
  const { usersByCoordinates = [], ordersByCity = [], revenueByState = [], sellersByCoordinates = [] } = data?.locationStats || {};

  // Enhanced city coordinates mapping
  const cityCoordinates = {
    'Delhi': [28.7041, 77.1025],
    'Mumbai': [19.0760, 72.8777],
    'Bangalore': [12.9716, 77.5946],
    'Hyderabad': [17.3850, 78.4867],
    'Chennai': [13.0827, 80.2707],
    'Kolkata': [22.5726, 88.3639],
    'Pune': [18.5204, 73.8567],
    'Jaipur': [26.9124, 75.7873],
    'Maharashtra': [19.7515, 75.7139],
    'Karnataka': [15.3173, 75.7139],
    'Tamil Nadu': [11.1271, 78.6569],
  };

  // Color palette for different visual elements
  const colors = {
    users: 'bg-purple-100 text-purple-800',
    orders: 'bg-blue-100 text-blue-800',
    revenue: 'bg-green-100 text-green-800',
    mapCircle: 'rgba(59, 130, 246, 0.5)',
    mapBorder: '#3B82F6'
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Geographical Distribution
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-[500px] w-full relative">
            <MapContainer 
              center={[20.5937, 78.9629]}
              zoom={5}
              className="h-full w-full rounded-xl"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* User Locations */}
              {usersByCoordinates.map((location, index) => (
                <Marker 
                  key={`user-${index}`} 
                  position={[location._id.coordinates[1], location._id.coordinates[0]]}
                >
                  <Popup className="rounded-lg shadow-lg">
                    <div className="p-2">
                      <h4 className="font-semibold text-purple-700">Users: {location.count}</h4>
                      <p className="text-sm text-gray-600">Coordinates: {location._id.coordinates.join(', ')}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {sellersByCoordinates.map((location, index) => (
                <Marker 
                  key={`user-${index}`} 
                  position={[location._id.coordinates[1], location._id.coordinates[0]]}                  
                >
                  <Popup className="rounded-lg shadow-lg">
                    <div className="p-2">
                      <h4 className="font-semibold text-purple-700">Store: {location._id.place}</h4>
                      <p className="text-sm text-gray-600">Coordinates: {location._id.coordinates.join(', ')}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* City Orders */}
              
            </MapContainer>
          </div>
        </div>
        
        {/* Stats Panel */}
        <div className="space-y-6">
          {/* Orders by City */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Orders by City
            </h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {ordersByCity.map((city, index) => (
                <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{city._id}</span>
                  <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    {city.orders} orders (₹{city.totalRevenue.toLocaleString()})
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Revenue by State */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Revenue by State
            </h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {revenueByState.map((state, index) => (
                <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{state._id}</span>
                  <span className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded-full">
                    ₹{state.totalRevenue.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Summary Stats */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg ${colors.users}`}>
                <p className="text-sm font-medium">Total Locations</p>
                <p className="text-xl font-bold">{usersByCoordinates.length}</p>
              </div>
              <div className={`p-3 rounded-lg ${colors.users}`}>
                <p className="text-sm font-medium">Store Locations</p>
                <p className="text-xl font-bold">{sellersByCoordinates.length}</p>
              </div>
              <div className={`p-3 rounded-lg ${colors.orders}`}>
                <p className="text-sm font-medium">Cities Covered</p>
                <p className="text-xl font-bold">{ordersByCity.length}</p>
              </div>
              <div className={`p-3 rounded-lg ${colors.revenue}`}>
                <p className="text-sm font-medium">States Covered</p>
                <p className="text-xl font-bold">{revenueByState.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDashboard;