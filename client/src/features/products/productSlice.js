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
  setProduct
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


export const deleteProductById = async (productId) => {
  const response = await axiosInstance.delete(`/products/${productId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const isSoldProductById = async (productId) => {
  const response = await axiosInstance.patch(`/products/${productId}/is-sold`,{isSold:true}, {
    withCredentials: true,
  });
  return response.data;
};

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

export default productSlice.reducer;
