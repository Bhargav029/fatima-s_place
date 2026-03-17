import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Initialize user from localStorage so they stay logged in on refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fatimas_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Login function: accepts a userData object { name, email, phone }
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('fatimas_user', JSON.stringify(userData));
  };

  // 3. Logout function: clears state and storage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('fatimas_user');
  };

  // 4. Helper boolean for quick checks
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};