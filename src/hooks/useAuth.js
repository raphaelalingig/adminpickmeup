// src/hooks/useAuth.js

import { useContext, useCallback, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { isAuthenticated, setIsAuthenticated, token, setToken, userRole, setUserRole, userId, setUserId, userStatus, setUserStatus, loading, setLoading } = context;

  // Check for existing auth state on mount
  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const user_id = localStorage.getItem("user_id");
      const status = localStorage.getItem("user_id");
      if (token && role) {
        setIsAuthenticated(true);
        setToken(token);
        setUserRole(parseInt(role));
      }
      if (user_id && status){
        setUserId(parseInt(user_id))
        setUserStatus(status)
      }
      setLoading(false);
    };

    checkAuthState();
  }, [setIsAuthenticated, setUserRole, setUserId, setLoading, setUserStatus, setToken]);

  const login = useCallback((token, role, user_id, status) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("status", status);
    setToken(token)
    setIsAuthenticated(true);
    setUserRole(parseInt(role));
    setUserId(parseInt(user_id));
    setUserStatus(status)
  }, [setIsAuthenticated, setUserRole, setUserId, setUserStatus, setToken]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("status");
    setToken(null)
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setUserStatus(null);
  }, [setIsAuthenticated, setUserRole, setUserId, setUserStatus, setToken]);

  return {
    isAuthenticated,
    userRole,
    userId,
    userStatus,
    token,
    login,
    logout,
    loading
  };
};