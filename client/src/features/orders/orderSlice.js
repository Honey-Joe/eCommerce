import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    error: null,
    success: false,
    isDelivered: false,
    order: null,
    myOrders: [],
    myOrdersLoading: false,
    myOrdersError: null,
  },
  reducers: {
    placeOrderRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    placeOrderSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload;
    },
    placeOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.order = null;
    },
    getMyOrdersRequest: (state) => {
      state.myOrdersLoading = true;
      state.myOrdersError = null;
    },
    getMyOrdersSuccess: (state, action) => {
      state.myOrdersLoading = false;
      state.myOrders = action.payload;
    },
    getMyOrdersFail: (state, action) => {
      state.myOrdersLoading = false;
      state.myOrdersError = action.payload;
    },
    updateDeliveryStatus: (state,action)=>{
      state.isDelivered = true
    }
  },
});

export const {
  placeOrderRequest,
  placeOrderSuccess,
  placeOrderFail,
  clearOrderState,
  getMyOrdersRequest,
  getMyOrdersSuccess,
  getMyOrdersFail,
} = orderSlice.actions;

export default orderSlice.reducer;
