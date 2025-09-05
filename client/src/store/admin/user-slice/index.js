import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userList: [],
  userDetails: null,
  userStats: null,
  isLoading: false,
  error: null,
};

// Get all users
export const getAllUsers = createAsyncThunk(
  "adminUsers/getAllUsers",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Get user by ID
export const getUserById = createAsyncThunk(
  "adminUsers/getUserById",
  async (userId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);


// Update user status
export const updateUserStatus = createAsyncThunk(
  "adminUsers/updateUserStatus",
  async ({ userId, isActive }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}/status`,
      { isActive },
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "adminUsers/deleteUser",
  async (userId) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Get user statistics
export const getUserStats = createAsyncThunk(
  "adminUsers/getUserStats",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/stats/overview`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserDetails: (state) => {
      state.userDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Get user by ID
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload.data;
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Update user status
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update user in the list
        const updatedUser = action.payload.data;
        const index = state.userList.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
          state.userList[index] = updatedUser;
        }
        state.error = null;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove user from the list
        const userId = action.meta.arg;
        state.userList = state.userList.filter(user => user._id !== userId);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Get user statistics
      .addCase(getUserStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userStats = action.payload.data;
        state.error = null;
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearUserDetails } = adminUserSlice.actions;
export default adminUserSlice.reducer;
