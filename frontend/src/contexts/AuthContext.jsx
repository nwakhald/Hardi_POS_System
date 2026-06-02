import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getUser, login as loginRequest, logout as logoutRequest } from "../api/authApi";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let mounted = true;

    getUser()
      .then((data) => {
        if (!mounted) return;
        setUser(data.user ?? data);
      })
      .catch(() => {
        if (!mounted) return;
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);

    if (data.user) {
      setUser(data.user);
    }

    return data;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // Ignore errors on logout, still clear local state.
    }

    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

