import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../axios';

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    brands: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchBrandsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBrandsSuccess: (state, action) => {
      state.loading = false;
      state.brands = action.payload;
    },
    fetchBrandsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addBrand: (state, action) => {
      state.brands.push(action.payload);
    },
  },
});

export const {
  fetchBrandsStart,
  fetchBrandsSuccess,
  fetchBrandsFailure,
  addBrand,
} = brandSlice.actions;

export const fetchBrands = () => async (dispatch) => {
  dispatch(fetchBrandsStart());
  try {
    const { data } = await axiosInstance.get('/brands');
    dispatch(fetchBrandsSuccess(data));
  } catch (err) {
    dispatch(fetchBrandsFailure(err.message));
  }
};

export const createBrand = (brandName) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('name', brandName);

    const { data } = await axiosInstance.post('/brands', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch(addBrand(data));
    return data;
  } catch (err) {
    console.error('Create brand error:', err);
    throw err;
  }
};

export default brandSlice.reducer;
