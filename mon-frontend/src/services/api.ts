// API service for authentication
const API_BASE_URL = "http://localhost:5000/api";

// Types for API responses
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiError {
  success: false;
  error: string;
  errors?: Record<string, string>;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Helper function to set auth token
const setAuthToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

// Helper function to remove auth token
const removeAuthToken = (): void => {
  localStorage.removeItem("authToken");
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle validation errors (422)
      if (response.status === 422 && data.errors) {
        const errorMessages = Object.values(data.errors).join(", ");
        throw new Error(errorMessages);
      }
      // Handle other errors
      throw new Error(data.error || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

// Authentication API functions
export const authAPI = {
  // Register a new user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    // Store token on successful registration
    if (response.success && response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Store token on successful login
    if (response.success && response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  // Get current user profile
  getCurrentUser: async (): Promise<{ success: boolean; data: User }> => {
    return apiRequest<{ success: boolean; data: User }>("/auth/me");
  },

  // Logout user
  logout: async (): Promise<{ success: boolean; data: {} }> => {
    const response = await apiRequest<{ success: boolean; data: {} }>(
      "/auth/logout",
      {
        method: "GET",
      }
    );

    // Remove token on logout
    removeAuthToken();

    return response;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return getAuthToken() !== null;
  },

  // Get stored token
  getToken: (): string | null => {
    return getAuthToken();
  },
};
