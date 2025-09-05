import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  newArrivals: [],
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    try {
      const result = await axios.get(
        `${backendUrl}/api/shop/products/get?${query}`
      );

      return result?.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    try {
      const result = await axios.get(
        `${backendUrl}/api/shop/products/get/${id}`
      );
      return result?.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  "/products/fetchNewArrivals",
  async (limit = 8) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    try {
      const result = await axios.get(
        `${backendUrl}/api/shop/products/get?sortBy=createdAt-desc&limit=${limit}`
      );
      return result?.data;
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      })
      .addCase(fetchNewArrivals.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newArrivals = action.payload.data;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.isLoading = false;
        state.newArrivals = [];
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;