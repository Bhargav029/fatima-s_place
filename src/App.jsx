import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- IMPORTS ---
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment'; 
import PaymentSuccess from './pages/PaymentSuccess'; 
import PaymentFailed from './pages/PaymentFailed';   
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard'; 
import Reservations from './pages/Reservations';
import TrackOrder from './pages/TrackOrder';
import LiveMap from './pages/LiveMap'; // <-- NEW MAP IMPORT
import CustomerDashboard from './pages/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />
      
      <Route path="/track-order" element={<TrackOrder />} />
      <Route path="/live-map" element={<LiveMap />} /> {/* <-- NEW MAP ROUTE */}
      
      <Route path="/reservations" element={<Reservations />} />
      <Route path="/dashboard" element={<CustomerDashboard />} />
      <Route path="/settings" element={<Settings />} />
      
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