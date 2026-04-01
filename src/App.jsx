import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- IMPORTS ---
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import SpecialOffers from './pages/SpecialOffers';
import Contact from './pages/Contact';
import Menu from './pages/menu'; // Check your casing here (menu vs Menu)
import Order from './pages/order'; // Check casing
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
import Reservation from './pages/Reservations';
import DriverDashboard from './pages/DriverDashboard';

function App() {
  return (
    // We use a React Fragment (<> and </>) to wrap multiple top-level items
    <>
      {/* 👇 1. The Splash Screen sits on top of the whole app! */}
      <SplashScreen />

      {/* 2. Your normal website routes continue underneath */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/offers" element={<SpecialOffers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<Order />} />
        <Route path="/login" element={<Login />} />
        <Route path='/payment' element={<Payment/>} />
        <Route path='/Payment-Success' element={<PaymentSuccess/>} />
        <Route path='/PaymentFailed' element={<PaymentFailed/>} />
        <Route path='/Dashboard' element={<Dashboard/>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/track-order" element={<TrackOrder/>} />
        <Route path="/live-map" element={<LiveMap />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/reservations" element={<Reservation />} />
        <Route path="/driver" element={<DriverDashboard />} />
        
        {/* Protect the Admin route so only Admins can access it */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;