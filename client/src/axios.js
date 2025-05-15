import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ecommerce-api-tawny-mu.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
