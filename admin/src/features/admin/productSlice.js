import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axios";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateProductStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.list.findIndex((p) => p._id === id);
      if (index !== -1) {
        state.list[index].status = status;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setProducts, updateProductStatus, setLoading, setError } = productSlice.actions;

export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get("/products");
    dispatch(setProducts(res.data));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to load products"));
  }
};

export default productSlice.reducer;
