import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axios";

const sellersSlice = createSlice({
  name: "sellers",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
  fetchSellersStart: (state) => {
    state.loading = true;
    state.error = null;
  },
  fetchSellersSuccess: (state, action) => {
    state.loading = false;
    state.list = action.payload;
  },
  fetchSellersFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  updateSellerStatus: (state, action) => {
    const { id, status } = action.payload;
    const index = state.list.findIndex((seller) => seller._id === id);
    if (index !== -1) {
      state.list[index].status = status;
    }
  },
}

});

export const {
  fetchSellersStart,
  fetchSellersSuccess,
  fetchSellersFailure,
  updateSellerStatus
} = sellersSlice.actions;

export const fetchSellers = () => async (dispatch) => {
  dispatch(fetchSellersStart());
  try {
    const res = await axiosInstance.get("/admin/sellers", {
      withCredentials: true,
    });
    dispatch(fetchSellersSuccess(res.data));
  } catch (err) {
    dispatch(
      fetchSellersFailure(err.response?.data?.message || "Failed to fetch sellers")
    );
  }
};

export default sellersSlice.reducer;
