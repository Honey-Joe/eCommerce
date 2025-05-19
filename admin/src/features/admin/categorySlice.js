// features/category/categorySlice.js
import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axios";

const initialState = {
  categories: [],
  loading: false,
  error: null,
  successMessage: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    createCategoryStart: (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    createCategorySuccess: (state, action) => {
      state.loading = false;
      state.categories.push(action.payload);
      state.successMessage = "Category created successfully.";
    },
    createCategoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCategoryMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(cat => cat._id === action.payload._id);
      if (index !== -1) state.categories[index] = action.payload;
    },
    deleteCategory: (state, action) => {
      state.list = state.categories.filter(cat => cat._id !== action.payload);
    },
  },
});

export const {
  createCategoryStart,
  createCategorySuccess,
  createCategoryFailure,
  clearCategoryMessages,
  updateCategory,
  deleteCategory,
  setCategories 
} = categorySlice.actions;

export const createCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch(createCategoryStart());
    const res = await axiosInstance.post("/categories", categoryData);
    dispatch(createCategorySuccess(res.data));
  } catch (err) {
    dispatch(
      createCategoryFailure(
        err.response?.data?.message || "Failed to create category"
      )
    );
  }
};
export const fetchCategories = () => async dispatch => {
  try {
    const { data } = await axiosInstance.get('/categories');
    dispatch(setCategories(data));
  } catch (err) {
    console.error(err);
  }
};

export const updateCategoryById = (id, updatedData) => async dispatch => {
  try {
    const { data } = await axiosInstance.put(`/categories/${id}`, updatedData);
    dispatch(updateCategory(data));
  } catch (err) {
    console.error(err);
  }
};

export const deleteCategoryById = id => async dispatch => {
  try {
    await axiosInstance.delete(`/categories/${id}`);
    dispatch(deleteCategory(id));
  } catch (err) {
    console.error(err);
  }
};
export default categorySlice.reducer;
