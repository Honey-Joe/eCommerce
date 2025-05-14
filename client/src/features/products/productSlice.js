import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../axios';
import {toast} from "react-toastify"

const productSlice = createSlice({
  name: 'products',
  initialState: {
    loading: false,
    error: null,
    products: [],
  },
  reducers: {
    addProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addProductSuccess: (state, action) => {
      state.loading = false;
      state.products.push(action.payload);
    },
    addProductFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getProductsStart: (state) => {
      state.loading = true;
    },
    getProductsSuccess: (state, action) => {
      state.products = action.payload;
      state.loading = false;
    },
    getProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    deleteProductSuccess: (state, action) => {
      state.products = state.products.filter(p => p._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { addProductStart, addProductSuccess, addProductFail , getProductsFailure ,getProductsStart ,getProductsSuccess , setError,setLoading,setProducts,deleteProductSuccess } = productSlice.actions;

export const addProduct = (formData) => async (dispatch) => {
  try {
    dispatch(addProductStart());
    const res = await axiosInstance.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
    dispatch(addProductSuccess(res.data.product));
    toast.success("Product Added Successfully")
  } catch (err) {
    dispatch(addProductFail(err.response?.data?.message || 'Upload failed'));

    console.log(err)
  }
};


export const fetchSellerProducts = (sellerId) => async (dispatch) => {
  try {
    dispatch(getProductsStart());
    const { data } = await axiosInstance.get(`/products/seller/${sellerId}`);
    dispatch(getProductsSuccess(data));
  } catch (error) {
    dispatch(getProductsFailure(error.response?.data?.message || error.message));
  }
};



export default productSlice.reducer;
