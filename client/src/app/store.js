// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import sellerReducer from "../features/seller/sellerSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    seller : sellerReducer
  },
});

export default store;
