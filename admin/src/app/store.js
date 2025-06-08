// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminReducer from '../features/admin/adminSlice';
import userReducer from "../features/admin/userSlice";
import sellersReducer from "../features/admin/sellersSlice"
import productReducer from "../features/admin/productSlice";
import categoryReducer from '../features/admin/categorySlice';
import brandReducer from "../features/admin/brandSlice"
import siteSettingReducer from "../features/siteSetting/siteSettingSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    user: userReducer,
    sellers: sellersReducer,
    products: productReducer,
    category  : categoryReducer,
    brand : brandReducer,
    siteSetting: siteSettingReducer
  },
});

export default store;
