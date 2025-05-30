import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";

const productSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    error: null,
    product: null,
    products: [],
    parentProducts: [],
    variants: [],
    isSold: false,
    sellerProducts: [], // ✅ Make sure this is initialized
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
    setSellerProducts: (state, action) => {
      state.sellerProducts = action.payload;
    },
    setProduct:(state,action) =>{
      state.loading = false
      state.product = action.payload;
    },
    removeSellerProduct: (state, action) => {
      const productId = action.payload;
      if (Array.isArray(state.sellerProducts)) {
        state.sellerProducts = state.sellerProducts.filter(
          (product) => product._id !== productId
        );
      }
    },
    setIssoldStatus: (state,action)=>{
      state.isSold = action.payload;
    },
    setProductLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProductError: (state, action) => {
      state.error = action.payload;
    },
    setParentProduct: (state, action) => {
      state.parentProducts = action.payload;},
    setVariants: (state, action) => {
      state.variants = action.payload;
    },
  },
});

export const {
  addProductStart,
  addProductSuccess,
  addProductFail,
  getProductsFailure,
  getProductsStart,
  getProductsSuccess,
  setProductError,
  setProductLoading,
  setSellerProducts,
  removeSellerProduct,
  setIssoldStatus,
  setProduct,
  setParentProduct,
  setVariants
} = productSlice.actions;

export const addProduct = (formData) => async (dispatch) => {
  try {
    dispatch(addProductStart());
    const res = await axiosInstance.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    dispatch(addProductSuccess(res.data.product));
    toast.success("Product Added Successfully");
  } catch (err) {
    dispatch(addProductFail(err.response?.data?.message || "Upload failed"));
    console.log(err);
  }
};

export const fetchProductById = (id) => async (dispatch) => {
  try {
    dispatch(setProductLoading(true));
    const response = await axiosInstance.get(`/products/${id}`);
    dispatch(setProduct(response.data));
  } catch (err) {
    dispatch(setProductError(err.message));
  } finally {
    dispatch(setProductLoading(false));
  }
};

export const fetchParentProducts = (sellerId) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get(`products/parent-products/seller/${sellerId}`);
    dispatch(setParentProduct(data));
  } catch (err) {
    console.error("Error fetching parent products:", err);
  }
};
export const deleteProductById = (productId) => async (dispatch) => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error; // So .unwrap() works
  }
};

// FIXED: Thunk version
export const isSoldProductById = (productId) => async (dispatch) => {
  try {
    const response = await axiosInstance.patch(
      `/products/${productId}/is-sold`,
      { isSold: true },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error; // So .unwrap() works
  }
}
export const fetchSellerProducts = (sellerId) => async (dispatch) => {
  try {
    dispatch(getProductsStart());
    const { data } = await axiosInstance.get(`/products/seller/${sellerId}`);
    dispatch(getProductsSuccess(data));
  } catch (error) {
    dispatch(
      getProductsFailure(error.response?.data?.message || error.message)
    );
  }
};
export const fetchVariantsByParentProductId = (parentId) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get(`/products/parents/${parentId}/variants`);
    dispatch(setVariants(data));
  } catch (error) {
    console.error("Error fetching variants:", error);
  }
};

export default productSlice.reducer;
