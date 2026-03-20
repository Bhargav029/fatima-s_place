import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/login" element={<Login />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} /> {/* Add this route */}
      <Route path="/settings" element={<Settings />} /> {/* Add this route */}
    </Routes>
  );
}

export default App;