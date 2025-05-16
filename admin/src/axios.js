// axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ecommerce-api-tawny-mu.vercel.app/api",
  withCredentials: true, // required to send HTTP-only cookies
});

export default axiosInstance;
