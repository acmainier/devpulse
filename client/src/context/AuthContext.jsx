import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

// The Context itself — a "channel" components can read shared auth state from
const AuthContext = createContext();

// Wrap the app with this once, so any component inside can access auth state
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = logged out
  const [loading, setLoading] = useState(true); // true while we check for a saved token

  // Runs once when the app first loads
  useEffect(() => {
    const token = localStorage.getItem("token");

    // No saved token — nothing to check, we're done
    if (!token) {
      setLoading(false);
      return;
    }

    // Have a token — verify it's still valid and get the user's info
    api
      .get("auth/me")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        // Token was rejected (expired/invalid) — clear it
        localStorage.removeItem("token");
      })
      .finally(() => {
        setLoading(false); // done checking either way
      });
  }, []);

  // Clears the token and resets state — called from a "Log out" button anywhere
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Everything shared with components that use this Context
  const value = { user, setUser, loading, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Shortcut so components don't have to import AuthContext + useContext separately
export function useAuth() {
  return useContext(AuthContext);
}