// API Configuration
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// CSRF Token management
let csrfToken = null;

// Function to fetch CSRF token
export const fetchCSRFToken = async (axios) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
      withCredentials: true
    });
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
};

// Function to get current CSRF token
export const getCSRFToken = () => csrfToken;

// Axios configuration for API calls
export const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to create axios instance with proper configuration
export const createApiCall = (axios) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add CSRF token
  instance.interceptors.request.use(
    async (config) => {
      // Skip CSRF for GET requests and auth endpoints
      if (config.method === 'get' || 
          config.url?.includes('/auth/login') ||
          config.url?.includes('/auth/forgot-password') ||
          config.url?.includes('/auth/reset-password') ||
          config.url?.includes('/csrf-token')) {
        return config;
      }

      // Fetch CSRF token if not available
      if (!csrfToken) {
        await fetchCSRFToken(axios);
      }

      // Add CSRF token to headers
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle CSRF token errors
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 403 && 
          error.response?.data?.message?.includes('CSRF')) {
        // Refresh CSRF token and retry request
        await fetchCSRFToken(axios);
        if (csrfToken) {
          error.config.headers['X-CSRF-Token'] = csrfToken;
          return instance.request(error.config);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

