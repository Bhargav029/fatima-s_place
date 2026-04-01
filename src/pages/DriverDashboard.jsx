import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  MapPin, Navigation, Phone, CheckCircle, LogOut, Package, User, Clock, ChevronRight, Sun, Moon, Map as MapIcon
} from 'lucide-react';

// --- MAP & FIREBASE IMPORTS ---
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// --- CUSTOM ICON CREATOR (MATCHES YOUR IMAGE) ---
const createMapIcon = (emoji, bgColor) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${bgColor}; 
        width: 42px; 
        height: 42px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 22px; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.3); 
        border: 3px solid white;
      ">
        ${emoji}
      </div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
};

const restaurantIcon = createMapIcon('🌴', '#6b75f2'); // Purple
const customerIcon = createMapIcon('🏠', '#3b82f6');   // Blue
const scooterIcon = createMapIcon('🛵', '#10b981');    // Emerald

// Helper to keep map centered on driver
const MapController = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.panTo([coords.lat, coords.lng], { animate: true });
  }, [coords, map]);
  return null;
};

const DriverDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [tripsToday, setTripsToday] = useState(0);
  
  // GPS State
  const restaurantLocation = { lat: 15.5975, lng: 73.7432 }; 
  const [currentCoords, setCurrentCoords] = useState(restaurantLocation);
  const [watchId, setWatchId] = useState(null);

  // --- FAKE ORDER FOR TESTING (Includes Customer Coordinates) ---
  const [assignedOrders, setAssignedOrders] = useState([
    { 
      id: 'F-92841', 
      customerName: 'John Doe', 
      deliveryAddress: 'Villa 4, Sunset Blvd, Vagator', 
      customerCoords: { lat: 15.5891, lng: 73.7554 }, // The Blue House Location
      customerPhone: '+91 98765 43210', 
      amount: 1250 
    }
  ]);

  // --- GEOLOCATION PERMISSION & TRACKING ---
  const startTracking = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser.");
    }

    // This triggers the browser "Ask for location" popup
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentCoords(newCoords);
        setIsOnline(true);

        // 🔴 UPDATE FIREBASE: This is how the customer sees the scooter move!
        if (activeOrder) {
          try {
            await setDoc(doc(db, "deliveries", activeOrder.id), {
              coords: [newCoords.lat, newCoords.lng],
              driverName: user?.name || 'Driver',
              lastUpdated: new Date().toISOString()
            }, { merge: true });
          } catch (err) { console.error("Firebase Update Error", err); }
        }
      },
      (error) => {
        setIsOnline(false);
        if (error.code === 1) alert("Please enable Location Permissions in your browser settings to go online.");
        else alert("GPS Signal Lost.");
      },
      { enableHighAccuracy: true, distanceFilter: 5 }
    );
    setWatchId(id);
  };

  const toggleOnlineStatus = () => {
    if (isOnline) {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsOnline(false);
    } else {
      startTracking();
    }
  };

  const handlePickUp = (order) => {
    setActiveOrder(order);
    if (!isOnline) startTracking();
    setAssignedOrders([]);
  };

  const handleComplete = () => {
    if (window.confirm("Confirm Delivery?")) {
      setTotalEarnings(prev => prev + activeOrder.amount);
      setTripsToday(prev => prev + 1);
      setActiveOrder(null);
      alert("Order delivered! Well done.");
    }
  };

  if (!isAuthenticated || user?.role !== 'driver') return <Navigate to="/login" replace />;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0b10] text-white' : 'bg-[#f8f9fb] text-gray-900'}`}>
      
      {/* HEADER */}
      <header className={`p-4 border-b flex justify-between items-center sticky top-0 z-[1001] ${isDarkMode ? 'bg-[#16171d] border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#5b6aff] flex items-center justify-center text-white border-2 border-indigo-100 shrink-0">
             <User size={20} />
          </div>
          <div>
            <h2 className="font-bold text-sm leading-none">{user.name || 'Fatima Driver'}</h2>
            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isOnline ? 'text-emerald-500' : 'text-gray-400'}`}>
              ● {isOnline ? 'On Duty' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className={`p-2 rounded-xl border ${isDarkMode ? 'border-gray-700 bg-gray-800 text-yellow-400' : 'border-gray-100 bg-gray-50 text-[#5b6aff]'}`}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={logout} className="p-2 text-gray-400 hover:text-rose-500"><LogOut size={20}/></button>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto w-full flex-grow overflow-y-auto">
        
        {/* --- DYNAMIC MAP BOX --- */}
        <div className={`relative w-full h-64 rounded-[32px] overflow-hidden shadow-xl border-4 transition-colors ${isDarkMode ? 'border-[#16171d]' : 'border-white'}`}>
          <MapContainer 
            center={[currentCoords.lat, currentCoords.lng]} 
            zoom={14} 
            zoomControl={false}
            style={{ height: '100%', width: '100%', zIndex: 1 }}
          >
            <TileLayer 
              url={isDarkMode 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
                : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              } 
            />

            {/* Marker 1: Fatima's Place (Purple Coconut) */}
            <Marker position={[restaurantLocation.lat, restaurantLocation.lng]} icon={restaurantIcon} />

            {/* Marker 2: Customer House (Blue House) - Only shows when order is active */}
            {activeOrder && (
              <Marker position={[activeOrder.customerCoords.lat, activeOrder.customerCoords.lng]} icon={customerIcon}>
                <Popup>Deliver Here</Popup>
              </Marker>
            )}

            {/* Marker 3: Driver (Emerald Scooter) */}
            <Marker position={[currentCoords.lat, currentCoords.lng]} icon={scooterIcon} />
            
            <MapController coords={currentCoords} />
          </MapContainer>

          {/* Map Overlay Button */}
          <button 
            onClick={toggleOnlineStatus}
            className={`absolute bottom-4 right-4 z-[1000] px-6 py-2.5 rounded-full font-black text-[11px] uppercase shadow-2xl transition-all border-2 ${
              isOnline ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white text-gray-900 border-gray-100'
            }`}
          >
            {isOnline ? 'Stop Tracking' : 'Go Online'}
          </button>
        </div>

        {/* --- ACTIVE ORDER CARD --- */}
        {activeOrder ? (
          <div className={`rounded-[32px] p-6 shadow-xl border-2 border-[#5b6aff] animate-in slide-in-from-bottom-4 transition-colors ${isDarkMode ? 'bg-[#16171d]' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-[#5b6aff] rounded-full text-[10px] font-black uppercase">Active Delivery</span>
              <span className="text-[10px] font-mono font-bold text-gray-400">{activeOrder.id}</span>
            </div>

            <h3 className="text-2xl font-black mb-1">{activeOrder.customerName}</h3>
            <p className="text-sm text-gray-500 mb-6 flex items-start gap-2">
              <MapPin size={16} className="text-rose-500 shrink-0" /> {activeOrder.deliveryAddress}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => window.open(`http://googleusercontent.com/maps.google.com/3{encodeURIComponent(activeOrder.deliveryAddress)}`, '_blank')}
                className="flex items-center justify-center gap-2 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-xs"
              >
                <Navigation size={16} /> Open Maps
              </button>
              <a href={`tel:${activeOrder.customerPhone}`} className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-xs border ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-[#5b6aff]'}`}>
                <Phone size={16} /> Call
              </a>
            </div>

            <button onClick={handleComplete} className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-base shadow-lg active:scale-95 transition-all">
              Order Delivered
            </button>
          </div>
        ) : (
          /* --- ASSIGNED LIST --- */
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 px-2 flex justify-between">
              Assigned Tasks <span>{assignedOrders.length}</span>
            </h3>

            {assignedOrders.map(order => (
              <div key={order.id} className={`rounded-3xl p-5 border transition-colors ${isDarkMode ? 'bg-[#16171d] border-gray-800' : 'bg-white border-gray-100'}`}>
                <div className="flex justify-between mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                    <Clock size={12}/> {order.id}
                  </span>
                  <span className="text-xs font-black text-[#5b6aff]">₹{order.amount}</span>
                </div>
                <h4 className="font-black text-lg mb-1">{order.customerName}</h4>
                <p className="text-xs text-gray-500 mb-4 line-clamp-1">{order.deliveryAddress}</p>
                <button 
                  onClick={() => handlePickUp(order)}
                  className="w-full py-3.5 bg-[#5b6aff] hover:bg-[#4a58e8] text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform"
                >
                  Pickup Order
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- BOTTOM STATS BAR --- */}
      <div className={`fixed bottom-0 left-0 right-0 border-t p-4 flex justify-around transition-colors z-[1001] ${isDarkMode ? 'bg-[#16171d] border-gray-800' : 'bg-white border-gray-100'}`}>
         <div className="text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Today</p>
            <p className="font-black text-lg">{tripsToday} Trips</p>
         </div>
         <div className={`w-[1px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
         <div className="text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Earning</p>
            <p className="font-black text-lg text-emerald-500">₹{totalEarnings}</p>
         </div>
      </div>
    </div>
  );
};

export default DriverDashboard;