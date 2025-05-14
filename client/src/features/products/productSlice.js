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
  },
});

export const { addProductStart, addProductSuccess, addProductFail } = productSlice.actions;

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

export default productSlice.reducer;
