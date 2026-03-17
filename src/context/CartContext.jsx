import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.reduce((acc, item) => {
      if (item.id === id) {
        if (item.qty === 1) return acc;
        return [...acc, { ...item, qty: item.qty - 1 }];
      }
      return [...acc, item];
    }, []));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, subtotal, 
      searchQuery, setSearchQuery 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);