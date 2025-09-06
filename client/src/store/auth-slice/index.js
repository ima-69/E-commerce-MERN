import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (FormData) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/register`,
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
    `${API_BASE_URL}/api/auth/login`,
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
      `${API_BASE_URL}/api/auth/logout`,
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
      `${API_BASE_URL}/api/auth/check-auth`,
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
      `${API_BASE_URL}/api/profile/`,
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
      `${API_BASE_URL}/api/profile/`,
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
      `${API_BASE_URL}/api/profile/picture`,
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
      `${API_BASE_URL}/api/profile/picture`,
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
      `${API_BASE_URL}/api/profile/password`,
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
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        
        // Show user-friendly error messages
        const errorMsg = action.payload?.message || action.error?.message || "";
        
        if (errorMsg?.includes("Incorrect password") || errorMsg?.includes("password")) {
          import("sonner").then(({ toast }) => {
            toast.error("❌ Incorrect password. Please check your password and try again.");
          });
        } else if (errorMsg?.includes("Account is deactivated") || errorMsg?.includes("deactivated")) {
          import("sonner").then(({ toast }) => {
            toast.error("🚫 Your account has been deactivated. Please contact support for assistance.");
          });
        } else if (errorMsg?.includes("User not found") || errorMsg?.includes("User doesn't exist")) {
          import("sonner").then(({ toast }) => {
            toast.error("👤 User not found. Please check your email/username or register a new account.");
          });
        } else if (errorMsg?.includes("Too many requests") || errorMsg?.includes("rate limit")) {
          import("sonner").then(({ toast }) => {
            toast.error("⏰ Too many login attempts. Please wait a few minutes before trying again.");
          });
        } else if (errorMsg?.includes("Network Error") || errorMsg?.includes("timeout")) {
          import("sonner").then(({ toast }) => {
            toast.error("🌐 Network error. Please check your internet connection and try again.");
          });
        }
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
        
        // Show toast for specific error messages
        if (action.payload?.message?.includes("Account is deactivated")) {
          // Import toast dynamically to avoid circular dependency
          import("sonner").then(({ toast }) => {
            toast.error("🚫 Your account has been deactivated. Please contact support for assistance.");
          });
        }
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
      .addCase(getUserProfile.rejected, (state, action) => {
        // Show toast for specific error messages
        if (action.payload?.message?.includes("Account is deactivated")) {
          import("sonner").then(({ toast }) => {
            toast.error("🚫 Your account has been deactivated. Please contact support for assistance.");
          });
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
