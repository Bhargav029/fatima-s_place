import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage to persist login across refreshes
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fatimas_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login function: accepts a full userData object { name, email, phone, role }
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('fatimas_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fatimas_user');
  };

  // Helper booleans for easy checking in your components
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin'; 

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};