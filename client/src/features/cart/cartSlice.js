// src/features/cart/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axios";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    clearCartState: (state) => {
      state.items = [];
    },
  },
});

export const { setCart, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;

// ✅ Fetch cart items (GET /cart)
export const fetchCart = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get("/cart");
    dispatch(setCart(res.data.items));
  } catch (err) {
    console.error("Failed to fetch cart:", err.message);
  }
};

// ✅ Add item to cart (POST /cart)
export const addToCart = (productId) => async (dispatch) => {
  try {
    const res = await axiosInstance.post("/cart", { productId });
    dispatch(setCart(res.data.items));
  } catch (err) {
    console.error("Failed to add to cart:", err.message);
  }
};

// ✅ Update quantity (PUT /cart/quantity)
export const updateQuantity = (productId, type) => async (dispatch) => {
  try {
    const res = await axiosInstance.put("/cart/quantity", { productId, type });
    dispatch(setCart(res.data.items));
  } catch (err) {
    console.error("Failed to update quantity:", err.message);
  }
};

// ✅ Remove item from cart (DELETE /cart/:productId)
export const removeFromCart = (productId) => async (dispatch) => {
  try {
    const res = await axiosInstance.delete(`/cart/${productId}`);
    dispatch(setCart(res.data.items));
  } catch (err) {
    console.error("Failed to remove item:", err.message);
  }
};

// ✅ Clear entire cart (DELETE /cart)
export const clearCart = () => async (dispatch) => {
  try {
    await axiosInstance.delete("/cart");
    dispatch(clearCartState());
  } catch (err) {
    console.error("Failed to clear cart:", err.message);
  }
};
