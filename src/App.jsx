import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- IMPORTS ---
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment'; 
import PaymentSuccess from './pages/PaymentSuccess'; // <-- ADDED THIS
   // <-- ADDED THIS
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard'; 
import Reservations from './pages/Reservations';
import TrackOrder from './pages/TrackOrder';
import CustomerDashboard from './pages/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/login" element={<Login />} />
      
      {/* Checkout & Payment Flow */}
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment-success" element={<PaymentSuccess />} /> {/* <-- ADDED THIS */}
   {/* <-- ADDED THIS */}
      
      {/* Tracking & Dashboards */}
      <Route path="/track-order" element={<TrackOrder />} />
      <Route path="/reservations" element={<Reservations />} />
      <Route path="/dashboard" element={<CustomerDashboard />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Staff & Admin Routes */}
      <Route path="/staff" element={<StaffDashboard />} />
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;