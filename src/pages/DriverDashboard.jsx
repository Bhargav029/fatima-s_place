import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Phone, CheckCircle, Palmtree, LogOut, Sun, Moon } from 'lucide-react';
import { io } from 'socket.io-client';

const DriverDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isDelivering, setIsDelivering] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [socket, setSocket] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Example Order Data (In a real app, this comes from the backend)
  const activeOrder = {
    id: "F-92841",
    customer: "John Doe",
    address: "Villa 4, Sunset Blvd, Vagator",
    phone: "+91 98765 43210",
  };

  // 1. Setup WebSocket Connection
  useEffect(() => {
    // Connect to the Node.js server we built
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // 2. Start/Stop Real GPS Tracking
  const toggleDeliveryStatus = () => {
    if (isDelivering) {
      // STOP TRACKING
      if (watchId) navigator.geolocation.clearWatch(watchId);
      setIsDelivering(false);
      setWatchId(null);
      alert("Delivery paused. Tracking stopped.");
    } else {
      // START TRACKING (Requests GPS permission from the phone)
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      setIsDelivering(true);

      // Watch the phone's actual GPS location
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = [latitude, longitude];
          
          setCurrentLocation(newLocation);
          
          // Send REAL coordinates to the server!
          if (socket) {
            socket.emit('driverLocationUpdate', newLocation);
            console.log("Sent live location:", newLocation);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Please enable GPS permissions to start delivery.");
          setIsDelivering(false);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      
      setWatchId(id);
    }
  };

  const handleLogout = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    logout();
    navigate('/login');
  };

  // Protection: Only allow "staff" or "driver" to view this page
  if (!isAuthenticated) return <Navigate to="/login" />;
  // Assuming your Login page set role as 'staff' for drivers
  if (user?.role !== 'staff' && user?.role !== 'admin') return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b10] flex flex-col font-sans transition-colors duration-300">
      
      {/* Mobile Header */}
      <header className="bg-white dark:bg-[#16171d] shadow-sm border-b border-gray-100 dark:border-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#5b6aff] rounded-full flex items-center justify-center text-white">
            <Palmtree size={16} />
          </div>
          <div>
            <h1 className="text-sm font-black text-gray-900 dark:text-white leading-none">Driver App</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user?.name || 'Driver'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={handleLogout} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content (Mobile Optimized) */}
      <main className="flex-grow p-4 flex flex-col gap-4 max-w-md mx-auto w-full">
        
        {/* Status Card */}
        <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors ${isDelivering ? 'bg-green-100 dark:bg-green-500/20 text-green-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
            <Navigation size={32} className={isDelivering ? 'animate-pulse' : ''} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
            {isDelivering ? 'On Duty' : 'Off Duty'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {isDelivering ? 'Broadcasting live GPS location...' : 'Start delivery to begin tracking.'}
          </p>

          <button 
            onClick={toggleDeliveryStatus}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-colors ${
              isDelivering 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20' 
                : 'bg-[#5b6aff] hover:bg-[#4a58e8] text-white shadow-indigo-500/20'
            }`}
          >
            {isDelivering ? 'Stop Delivery' : 'Start Delivery'}
          </button>

          {currentLocation && isDelivering && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-[#0a0b10] rounded-lg border border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Coordinates</p>
              <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                Lat: {currentLocation[0].toFixed(5)}, Lng: {currentLocation[1].toFixed(5)}
              </p>
            </div>
          )}
        </div>

        {/* Active Order Details */}
        <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Order</p>
              <p className="text-sm font-black text-gray-900 dark:text-white">#{activeOrder.id}</p>
            </div>
            <span className="bg-indigo-50 dark:bg-indigo-500/10 text-[#5b6aff] px-3 py-1 rounded-full text-xs font-bold">Pick Up</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{activeOrder.customer}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{activeOrder.address}</p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <a href={`tel:${activeOrder.phone}`} className="flex-1 bg-green-500 text-white py-2.5 rounded-lg text-sm font-bold flex justify-center items-center gap-2 hover:bg-green-600 transition-colors">
                <Phone size={16} /> Call
              </a>
              <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg text-sm font-bold flex justify-center items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <CheckCircle size={16} /> Mark Done
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default DriverDashboard;