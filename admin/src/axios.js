// axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://intern-8zoy.onrender.com/api",
  // baseURL: "http://localhost:5000/api",

  withCredentials: true, // required to send HTTP-only cookies
});

export default axiosInstance;
