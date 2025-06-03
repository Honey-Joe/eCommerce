import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    error: null,
    success: false,
    order: null,
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
  },
});

export const {
  placeOrderRequest,
  placeOrderSuccess,
  placeOrderFail,
  clearOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;
