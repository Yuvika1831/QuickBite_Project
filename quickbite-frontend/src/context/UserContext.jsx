// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Helper to set user and token in sessionStorage
  const setUserAndStorage = (userData, token) => {
    sessionStorage.setItem("token", token); // sessionStorage used instead of localStorage

    const normalizedUser = {
      ...userData,
      role: userData.role.toLowerCase(),
      name: userData.name || userData.username || "Owner",
    };

    setUser(normalizedUser);
  };

  // Fetch user on app start and validate token
  const fetchUser = async () => {
    try {
      const token = sessionStorage.getItem("token"); // sessionStorage

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.user) {
        const normalizedUser = {
          ...res.data.user,
          role: res.data.user.role.toLowerCase(),
          name: res.data.user.name || res.data.user.username || "Owner",
        };
        setUser(normalizedUser);
      }
    } catch (err) {
      console.log("Invalid/Expired token → Logging out:", err);
      sessionStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    setNotifications([]);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setUserAndStorage,
        loading,
        logout,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
