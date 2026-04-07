import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- IMPORTS ---
import Home from './pages/Home';
import SpecialOffers from './pages/SpecialOffers';
import Contact from './pages/Contact';
import Menu from './pages/menu'; // Changed to capital 'M'
import Order from './pages/order'; // Changed to capital 'O'
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment'; 
import PaymentSuccess from './pages/PaymentSuccess'; 
import PaymentFailed from './pages/PaymentFailed';   
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import Dashboard from './pages/CustomerDashboard'; 
import TrackOrder from './pages/TrackOrder';
import LiveMap from './pages/LiveMap';
import StaffDashboard from './pages/StaffDashboard';
import Reservations from './pages/Reservations';
import DriverDashboard from './pages/DriverDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/offers" element={<SpecialOffers />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* FIXED: Changed <menu /> to <Menu /> */}
      <Route path="/menu" element={<Menu />} />
      
      {/* FIXED: Changed <order /> to <Order /> */}
      <Route path="/Order" element={<Order />} />
      
      <Route path="/login" element={<Login />} />
      <Route path='/payment' element={<Payment/>}/>
      <Route path='/Payment-Success' element={<PaymentSuccess/>}/>
      <Route path='/PaymentFailed' element={<PaymentFailed/>}/>
      <Route path='/Dashboard' element={<Dashboard/>}/>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/track-order" element={<TrackOrder/>}/>
      <Route path="/live-map" element={<LiveMap />} />
      <Route path="/staff" element={<StaffDashboard />} />
      <Route path="/reservations" element={<Reservations />} />
      <Route path="/driver" element={<DriverDashboard />} />

      {/* Protect the Admin route */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;