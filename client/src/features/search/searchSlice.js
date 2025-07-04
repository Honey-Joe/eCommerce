import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axios";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    keyword: "",
    results: [],
    relatedResults: [],
    productByCategory: [],
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
    setRelatedResults(state, action) {
      state.productByCategory = action.payload;
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
  setRelatedResults,
  setTopProducts,
  setTopCategories,
  setLoading,
  setError,
} = searchSlice.actions;

export default searchSlice.reducer;

//
// 🔍 Async Logic
//

// Fetch search results + related products
export const fetchSearchResults = (keyword, categoryId = "") => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setKeyword(keyword));

    const [productRes, categoryRes] = await Promise.all([
      axiosInstance.get(`/products/search?search=${keyword}&categoryId=${categoryId}`),
      axiosInstance.get(`/categories/search?search=${keyword}`),
    ]);

    dispatch(setResults([...productRes.data.searched, ...categoryRes.data]));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
// Search only seller-specific products
export const fetchSellerSearchResults = (query, sellerId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setKeyword(query));
    dispatch(setError(null));

    const res = await axiosInstance.get(
      `/search/seller?query=${query}&sellerId=${sellerId}`
    );
    console.log("Seller search results:", res.data.products);
    dispatch(setResults(res.data.products));
  } catch (err) {
    dispatch(setError(err.message));
    console.error("Error fetching seller search results:", err);
  } finally {
    dispatch(setLoading(false));
  }
};

// Fetch top searched products & categories
export const fetchTopSearched = () => async (dispatch) => {
  try {
    const [topProd, topCat] = await Promise.all([
      axiosInstance.get("/search/top?type=product"),
      axiosInstance.get("/search/top?type=category"),
    ]);

    dispatch(setTopProducts(topProd.data.products));
    dispatch(setTopCategories(topCat.data.categories));
  } catch (err) {
    dispatch(setError(err.message));
  }
};
export const fetchRelatedByCategoryId = (categoryId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const res = await axiosInstance.get(`/products/category/${categoryId}`);
    dispatch(setRelatedResults(res.data));
  } catch (err) {
    dispatch(setError(err.message));
    console.error("Error fetching related products:", err);
  } finally {
    dispatch(setLoading(false));
  }
};
