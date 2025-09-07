import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createApiCall } from "@/config/api";

const initialState = {
  isLoading: false,
  reviews: [],
};

// Create CSRF-enabled API instance
const api = createApiCall(axios);

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata) => {
    const response = await api.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/shop/review/add`,
      formdata
    );

    return response.data;
  }
);

export const getReviews = createAsyncThunk("/order/getReviews", async (id) => {
  const response = await api.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/shop/review/${id}`
  );

  return response.data;
});

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add the new review to the reviews array
        if (action.payload.success && action.payload.data) {
          state.reviews.push(action.payload.data);
        }
      })
      .addCase(addReview.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
