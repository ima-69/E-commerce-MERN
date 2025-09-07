import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createApiCall } from "@/config/api";

// Create CSRF-enabled API instance
const api = createApiCall(axios);

// Async thunks for wishlist operations
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/shop/wishlist/add`,
        {
          productId,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/shop/wishlist/remove`,
        {
          productId,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove from wishlist");
    }
  }
);

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/shop/wishlist/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);

export const checkWishlistStatus = createAsyncThunk(
  "wishlist/checkWishlistStatus",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/shop/wishlist/status/${userId}/${productId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to check wishlist status");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlistItems: [],
    wishlistStatus: {}, // Store wishlist status for each product
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.wishlistItems = [];
      state.wishlistStatus = {};
      state.error = null;
    },
    updateWishlistStatus: (state, action) => {
      const { productId, isInWishlist } = action.payload;
      state.wishlistStatus[productId] = isInWishlist;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload.data;
        // Update wishlist status for the product
        const productId = action.meta.arg.productId;
        state.wishlistStatus[productId] = true;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload.data;
        // Update wishlist status for the product
        const productId = action.meta.arg.productId;
        state.wishlistStatus[productId] = false;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload.data;
        // Update wishlist status for all products
        action.payload.data.forEach((product) => {
          state.wishlistStatus[product._id] = true;
        });
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check wishlist status
      .addCase(checkWishlistStatus.fulfilled, (state, action) => {
        const { productId } = action.meta.arg;
        state.wishlistStatus[productId] = action.payload.data.isInWishlist;
      });
  },
});

export const { clearWishlist, updateWishlistStatus } = wishlistSlice.actions;
export default wishlistSlice.reducer;
