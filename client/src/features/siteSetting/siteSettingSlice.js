// src/features/siteSetting/siteSettingSlice.js

import axiosInstance from "../../axios";
import { createSlice } from "@reduxjs/toolkit";

const siteSettingSlice = createSlice({
  name: "siteSettings",
  initialState: {
    settings: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSiteSettings: (state, action) => {
      state.settings = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSiteSettingsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSiteSettingsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setSiteSettings,
  setSiteSettingsLoading,
  setSiteSettingsError,
} = siteSettingSlice.actions;

export const fetchSiteSettings = () => async (dispatch) => {
  dispatch(setSiteSettingsLoading(true));
  try {
    const res = await axiosInstance.get("/site-settings");
    dispatch(setSiteSettings(res.data));
  } catch (error) {
    dispatch(setSiteSettingsError(error.response?.data?.message || "Failed to load settings"));
  }
};



export default siteSettingSlice.reducer;
