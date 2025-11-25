import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userAPI } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("userToken");
      const storedUser = await AsyncStorage.getItem("userData");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Optionally validate token with backend here
      }
    } catch (error) {
      console.error("Failed to load auth data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await userAPI.login(email, password);
      
      if (response.success) {
        const { token, user } = response.data; // apiRequest returns { success: true, data: ... }
        // But wait, my backend returns { success: true, token, user } directly inside res.json()?
        // Let's check api.js wrapper. It returns { success: true, data: response.json() }.
        // So response.data will contain { success: true, token, user }? 
        // No, api.js: const data = await response.json(); return { success: true, data };
        // Backend: res.json({ success: true, token, user });
        // So result in frontend: { success: true, data: { success: true, token, user } }
        // Wait, api.js wrapper might be redundant with success flag if backend also sends it.
        // Let's assume api.js returns { success: true, data: { success: true, token, user } }
        // So I need response.data.token and response.data.user.
        
        // Actually, let's look at api.js again.
        // It returns { success: true, data } where data is the JSON body.
        // So response.data is { success: true, token, user }.
        
        const { token: authToken, user: userData } = response.data;
        
        setToken(authToken);
        setUser(userData);
        await AsyncStorage.setItem("userToken", authToken);
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await userAPI.register(email, password, name);
      
      if (response.success) {
        const { token: authToken, user: userData } = response.data;
        
        setToken(authToken);
        setUser(userData);
        await AsyncStorage.setItem("userToken", authToken);
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
