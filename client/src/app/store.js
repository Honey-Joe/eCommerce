// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import sellerReducer from "../features/seller/sellerSlice"
import productReducer from "../features/products/productSlice";
import brandReducer from '../features/products/brandSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    seller : sellerReducer,
    products : productReducer,
    brands: brandReducer
  },
});

export default store;
