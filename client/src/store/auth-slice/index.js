import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (FormData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
      FormData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const loginUser = createAsyncThunk("/auth/login", async (FormData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
    FormData,
    {
      withCredentials: true,
    }
  );
  return response.data;
});

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/check-auth`,
      {
        withCredentials: true,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );

    return response.data;
  }
);

// Get user profile
export const getUserProfile = createAsyncThunk(
  "/profile/get",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/profile/`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "/profile/update",
  async (profileData) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/profile/`,
      profileData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Upload profile picture
export const uploadProfilePicture = createAsyncThunk(
  "/profile/upload-picture",
  async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/profile/picture`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
);

// Delete profile picture
export const deleteProfilePicture = createAsyncThunk(
  "/profile/delete-picture",
  async () => {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/profile/picture`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Change password
export const changePassword = createAsyncThunk(
  "/profile/change-password",
  async (passwordData) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/profile/password`,
      passwordData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.user = action.payload.user;
        }
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.user = action.payload.user;
        }
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.user = action.payload.user;
        }
      })
      .addCase(deleteProfilePicture.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.user = action.payload.user;
        }
      });
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
