import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);

        // Get stored token
        const token = localStorage.getItem("accessToken");

        if (!token) {
          // No token, not logged in
          setLoading(false);
          return;
        }

        // Set default authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Check token validity
        const response = await api.get("/api/auth/status");
        setUser(response.data.user);
      } catch (err) {
        // Token might be expired, try to refresh
        try {
          await refreshToken();

          // Check status again
          const response = await api.get("/api/auth/status");
          setUser(response.data.user);
        } catch (refreshErr) {
          // Refresh failed, clear everything
          setUser(null);
          localStorage.removeItem("accessToken");
          delete api.defaults.headers.common["Authorization"];
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Refresh token function
  const refreshToken = async () => {
    const response = await api.post("/api/auth/refresh");
    const { accessToken } = response.data;

    localStorage.setItem("accessToken", accessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    return accessToken;
  };

  // Intercept 401 responses to attempt token refresh
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            await refreshToken();

            // Retry the original request
            return api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, log out
            setUser(null);
            localStorage.removeItem("accessToken");
            delete api.defaults.headers.common["Authorization"];
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      // Remove the interceptor when the component unmounts
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.post("/api/auth/login", credentials);
      const { accessToken, user } = response.data;

      // Save token to localStorage
      localStorage.setItem("accessToken", accessToken);

      // Set default header for API calls
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Update user state
      setUser(user);

      return user;
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      // Clear user state and localStorage regardless of API success
      setUser(null);
      localStorage.removeItem("accessToken");
      delete api.defaults.headers.common["Authorization"];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
