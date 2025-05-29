import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../axios";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    keyword: "",
    results: [],
    topProducts: [],
    topCategories: [],
    loading: false,
    error: null,
  },
  reducers: {
    setKeyword(state, action) {
      state.keyword = action.payload;
    },
    setResults(state, action) {
      state.results = action.payload;
    },
    setTopProducts(state, action) {
      state.topProducts = action.payload;
    },
    setTopCategories(state, action) {
      state.topCategories = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setKeyword,
  setResults,
  setTopProducts,
  setTopCategories,
  setLoading,
  setError,
} = searchSlice.actions;

export default searchSlice.reducer;

// Custom non-asyncThunk fetchers
export const fetchSearchResults = (keyword) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setKeyword(keyword));

    const productRes = await axiosInstance.get(
      `products/search?search=${keyword}`
    );
    const categoryRes = await axiosInstance.get(
      `categories/search?search=${keyword}`
    );

    dispatch(setResults([...productRes.data, ...categoryRes.data]));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchTopSearched = () => async (dispatch) => {
  try {
    const topProd = await axiosInstance.get("search/top?type=product");
    const topCat = await axiosInstance.get("search/top?type=category");

    dispatch(setTopProducts(topProd.data.products));
    dispatch(setTopCategories(topCat.data.categories));
  } catch (err) {
    dispatch(setError(err.message));
  }
};
