// features/seller/sellerSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../axios';

const sellerSlice = createSlice({
  name: 'seller',
  initialState: {
    uploadStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    uploadMessage: '',
  },
  reducers: {
    setSellerInfo(state, action) {
      state.sellerInfo = action.payload;
    },
    uploadStart(state) {
      state.uploadStatus = 'loading';
      state.uploadMessage = '';
    },
    uploadSuccess(state, action) {
      state.uploadStatus = 'succeeded';
      state.uploadMessage = action.payload;
    },
    uploadFailure(state, action) {
      state.uploadStatus = 'failed';
      state.uploadMessage = action.payload;
    },
    updateStart(state) {
      state.updateStatus = 'loading';
    },
    updateSuccess(state, action) {
      state.updateStatus = 'succeeded';
      state.sellerInfo = action.payload;
      state.updateMessage = 'Profile updated successfully.';
    },
    updateFailure(state, action) {
      state.updateStatus = 'failed';
      state.updateMessage = action.payload;
    },
  },
});

export const { uploadStart, uploadSuccess, uploadFailure , setSellerInfo, updateFailure,updateStart, updateSuccess } = sellerSlice.actions;
export default sellerSlice.reducer;

export const uploadSellerDocuments = (formData) => async (dispatch) => {
  try {
    dispatch(uploadStart());

    const res = await axiosInstance.post('/sellers/upload-documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // 👈 Ensure cookies are sent
    });

    if (res.status === 200) {
      dispatch(uploadSuccess('Documents uploaded successfully.'));
    } else {
      dispatch(uploadFailure(res.data.message || 'Upload failed.'));
    }
  } catch (err) {
    dispatch(uploadFailure('Error uploading documents.'));
    console.log(err)
  }
};

export const updateSellerProfile = (updatedData) => async (dispatch) => {
  try {
    dispatch(updateStart());
    const res = await axiosInstance.put('/sellers/profile', updatedData, {
      withCredentials: true,
    });
    dispatch(updateSuccess(res.data.seller));
  } catch (err) {
    dispatch(updateFailure('Failed to update profile.'));
  }
};

