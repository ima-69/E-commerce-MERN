import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../../config/api";

const initialState = {
  cartItems: {
    items: [],
    total: 0
  },
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/shop/cart/add`,
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
    const response = await axios.get(
      `${API_BASE_URL}/api/shop/cart/get/${userId}`,
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
    const response = await axios.delete(
      `${API_BASE_URL}/api/shop/cart/${userId}/${productId}`,
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
    const response = await axios.put(
      `${API_BASE_URL}/api/shop/cart/update-cart`,
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
    const response = await axios.post(
      `${API_BASE_URL}/api/shop/cart/merge-guest-cart`,
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
        state.cartItems = {
          items: action.payload.data || [],
          total: action.payload.data?.length || 0
        };
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.cartItems = { items: [], total: 0 };
        
        // Show user-friendly error messages
        const errorMsg = action.payload?.message || action.error?.message || "";
        
        if (errorMsg?.includes("Account is deactivated") || errorMsg?.includes("deactivated")) {
          import("sonner").then(({ toast }) => {
            toast.error("🚫 Your account has been deactivated. Please contact support for assistance.");
          });
        } else if (errorMsg?.includes("Unauthorized") || errorMsg?.includes("401")) {
          import("sonner").then(({ toast }) => {
            toast.error("🔒 Please log in to add items to your cart.");
          });
        } else if (errorMsg?.includes("Network Error") || errorMsg?.includes("timeout")) {
          import("sonner").then(({ toast }) => {
            toast.error("🌐 Network error. Please check your internet connection and try again.");
          });
        } else if (errorMsg) {
          import("sonner").then(({ toast }) => {
            toast.error(`❌ ${errorMsg}`);
          });
        }
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = {
          items: action.payload.data || [],
          total: action.payload.data?.length || 0
        };
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = { items: [], total: 0 };
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = {
          items: action.payload.data || [],
          total: action.payload.data?.length || 0
        };
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = { items: [], total: 0 };
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = {
          items: action.payload.data || [],
          total: action.payload.data?.length || 0
        };
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = { items: [], total: 0 };
      })
      .addCase(mergeGuestCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = {
          items: action.payload.data || [],
          total: action.payload.data?.length || 0
        };
      })
      .addCase(mergeGuestCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = { items: [], total: 0 };
      });
  },
});

export default shoppingCartSlice.reducer;