import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://intern-8zoy.onrender.com/api',
  // baseURL: "http://localhost:5000/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
