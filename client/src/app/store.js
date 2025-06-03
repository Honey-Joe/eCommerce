// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import sellerReducer from "../features/seller/sellerSlice"
import productReducer from "../features/products/productSlice";
import brandReducer from '../features/products/brandSlice';
import userReducer from '../features/user/userSlice';
import searchReducer from '../features/search/searchSlice';
import cartReducer from '../features/cart/cartSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    seller : sellerReducer,
    products : productReducer,
    brands: brandReducer,
    search:searchReducer,
    cart: cartReducer,
  },
});

export default store;
