import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};


export const loginUser = createAsyncThunk("/auth/login", async (loginData) => {
  // If loginData has token, id, etc., it's from Auth0 - return it directly
  if (loginData.token && loginData.id) {
    return {
      success: true,
      user: {
        id: loginData.id,
        role: loginData.role,
        email: loginData.email,
        userName: loginData.username,
        firstName: loginData.firstName,
        lastName: loginData.lastName,
      }
    };
  }
  
  // Otherwise, it's a regular login attempt
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
    loginData,
    {
      withCredentials: true,
    }
  );

  return response.data;
});

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { getState }) => {
    const state = getState();
    const user = state.auth.user;
    
    // Check if user was logged in via Auth0 (has userName that looks like Auth0 ID)
    const isAuth0User = user?.userName && user.userName.startsWith('auth0|');
    
    if (isAuth0User) {
      // For Auth0 users, redirect to Auth0 logout endpoint
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth0/logout`;
      return { success: true, message: "Redirecting to Auth0 logout..." };
    } else {
      // For regular users, use standard logout
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      // Clear localStorage
      localStorage.removeItem('authToken');
      
      return response.data;
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async (_, { rejectWithValue }) => {
    try {
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
    } catch (error) {
      // If 401, user is not authenticated - this is normal
      if (error.response?.status === 401) {
        return { success: false, user: null };
      }
      // For other errors, reject with the error
      return rejectWithValue(error.response?.data || error.message);
    }
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
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
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
