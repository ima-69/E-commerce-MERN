import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, createApiCall } from "@/config/api";

// Create CSRF-enabled API instance
const api = createApiCall(axios);


const initialState = {
  isLoading: false,
  productList: [],
  error: null,
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await api.post(
      `${API_BASE_URL}/api/admin/products/add`,
      formData
    );

    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await api.get(
      `${API_BASE_URL}/api/admin/products/get`
    );

    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const result = await api.put(
      `${API_BASE_URL}/api/admin/products/edit/${id}`,
      formData
    );

    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await api.delete(
      `${API_BASE_URL}/api/admin/products/delete/${id}`
    );

    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
        state.error = null;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export default AdminProductsSlice.reducer;