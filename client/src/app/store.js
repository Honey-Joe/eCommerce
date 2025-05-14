// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import sellerReducer from "../features/seller/sellerSlice"
import productReducer from "../features/products/productSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    seller : sellerReducer,
    products : productReducer
  },
});

export default store;
