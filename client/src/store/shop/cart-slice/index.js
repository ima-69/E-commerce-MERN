import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createApiCall } from "@/config/api";

// Create CSRF-enabled API instance
const api = createApiCall(axios);

const initialState = {
  cartItems: [],
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }) => {
    const response = await api.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/shop/cart/add`,
      {
        userId,
        productId,
        quantity,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    const response = await api.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/shop/cart/get/${userId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    const response = await api.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/shop/cart/${userId}/${productId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }) => {
    const response = await api.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/shop/cart/update-cart`,
      {
        userId,
        productId,
        quantity,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async ({ userId, guestCartItems }) => {
    const response = await api.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/shop/cart/merge-guest-cart`,
      {
        userId,
        guestCartItems,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(mergeGuestCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(mergeGuestCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      });
  },
});

export default shoppingCartSlice.reducer;