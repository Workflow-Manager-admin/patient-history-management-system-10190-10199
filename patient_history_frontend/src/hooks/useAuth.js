import React, { createContext, useContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

/**
 * Auth context to handle authentication state, user info,
 * login and logout. Token is saved in localStorage.
 */

const AuthContext = createContext();

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(() => (token ? parseUser(token) : null));

  // Effect to update user data if token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
      setUser(parseUser(token));
    } else {
      localStorage.removeItem("authToken");
      setUser(null);
    }
  }, [token]);

  // PUBLIC_INTERFACE
  const login = (token) => setToken(token);
  // PUBLIC_INTERFACE
  const logout = () => setToken(null);
  // PUBLIC_INTERFACE
  const isAuthenticated = !!token;

  const value = { token, user, login, logout, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

// Parse user info from JWT token (assumes standard JWT with user fields)
function parseUser(token) {
  try {
    const decoded = jwtDecode(token);
    // You may want to check for token exp or other fields.
    return {
      name: decoded.name || decoded.username || "Unknown User",
      email: decoded.email || "",
      ...decoded,
    };
  } catch (err) {
    return null;
  }
}
