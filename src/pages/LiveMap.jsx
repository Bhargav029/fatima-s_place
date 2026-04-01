import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, MessageSquare, ShieldCheck, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- NEW: FIREBASE IMPORTS ---
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Assumes your firebase.js config is in the src folder

// --- CUSTOM MAP ICONS ---
const createCustomIcon = (emoji, bgColor) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${bgColor}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 3px solid white;">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

const restaurantIcon = createCustomIcon('🌴', '#6b75f2'); // Indigo/Purple
const customerIcon = createCustomIcon('🏠', '#3b82f6'); // Blue
const driverIcon = createCustomIcon('🛵', '#10b981'); // Emerald Green

// Auto-center component to keep driver in view
const RecenterAutomatically = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(location, map.getZoom(), { animate: true });
  }, [location, map]);
  return null;
};

const LiveMap = () => {
  const navigate = useNavigate();
  
  // Static coordinates for the Restaurant and Customer House
  const restaurantLocation = [15.5975, 73.7432]; 
  const customerLocation = [15.5891, 73.7554]; 

  // The Order ID we are tracking (Matches the one in StaffDashboard)
  const orderIdToTrack = "F-92841";

  const [driverLocation, setDriverLocation] = useState(restaurantLocation);
  const [isLive, setIsLive] = useState(false);
  const [driverInfo, setDriverInfo] = useState({ name: 'Assigning Driver...', phone: '' });

  // --- REAL-TIME FIREBASE CONNECTION ---
  useEffect(() => {
    // Listen to the specific delivery document in the Firebase "deliveries" collection
    const unsubscribe = onSnapshot(doc(db, "deliveries", orderIdToTrack), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        // Update map pin when new coordinates arrive
        if (data.coords) {
          setDriverLocation(data.coords);
          setIsLive(true);
        }
        // Update bottom sheet when driver claims the order
        if (data.driverName) {
          setDriverInfo({ name: data.driverName, phone: data.phone });
        }
      }
    }, (error) => {
      console.error("Error listening to live tracking:", error);
    });

    // Cleanup the listener when leaving the map page
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-screen w-full flex flex-col relative font-sans">
      
      {/* --- TOP HEADER --- */}
      <div className="absolute top-0 left-0 right-0 p-6 z-[1000] flex justify-between items-start pointer-events-none">
        <button 
          onClick={() => navigate(-1)} 
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-lg pointer-events-auto hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="bg-white px-5 py-3 rounded-2xl shadow-lg pointer-events-auto flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            {isLive ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            )}
          </div>
          <span className="font-bold text-sm text-gray-900">
            {isLive ? 'Live GPS Active' : 'Waiting for Driver...'}
          </span>
        </div>
      </div>

      {/* --- REAL INTERACTIVE MAP --- */}
      <div className="flex-grow z-0 relative">
        <MapContainer 
          center={restaurantLocation} 
          zoom={14} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Map Markers */}
          <Marker position={restaurantLocation} icon={restaurantIcon}>
            <Popup><span className="font-bold">Fatima's Place</span><br/>Kitchen & Pickup</Popup>
          </Marker>

          <Marker position={customerLocation} icon={customerIcon}>
            <Popup><span className="font-bold">Your Delivery Address</span></Popup>
          </Marker>

          <Marker position={driverLocation} icon={driverIcon}>
            <Popup><span className="font-bold">{driverInfo.name}</span><br/>Out for delivery!</Popup>
          </Marker>

          {/* Optional: Auto-pan map to follow the driver */}
          {isLive && <RecenterAutomatically location={driverLocation} />}
        </MapContainer>

        {/* Recenter Button (Visual only, Leaflet handles panning automatically above) */}
        <div className="absolute bottom-6 right-6 z-[1000]">
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-lg hover:bg-gray-50 transition-colors">
            <Crosshair size={24} />
          </button>
        </div>
      </div>

      {/* --- BOTTOM DRIVER INFO SHEET --- */}
      <div className="bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-[1000] p-8 pb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              {driverInfo.name === 'Assigning Driver...' ? 'Finding your driver' : `${driverInfo.name.split(' ')[0]} is on the way`}
            </h2>
            <p className="text-sm text-gray-500 font-medium">Tracking via Real GPS</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-[24px] p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80" 
                alt="Driver" 
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-white">
                4.9 ★
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{driverInfo.name}</h3>
              <p className="text-xs text-gray-500 font-medium">Honda Activa • GA-03-F-1234</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[#6b75f2] shadow-sm hover:bg-gray-50 transition-colors">
              <MessageSquare size={20} />
            </button>
            <a href={`tel:${driverInfo.phone}`} className="w-12 h-12 bg-[#6b75f2] rounded-full flex items-center justify-center text-white shadow-md shadow-indigo-100 hover:bg-[#5a64e1] transition-colors">
              <Phone size={20} fill="currentColor" />
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
          <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 font-medium leading-relaxed">
            {driverInfo.name !== 'Assigning Driver...' ? driverInfo.name.split(' ')[0] : 'Your driver'} is a verified delivery partner. Please share the PIN <span className="font-black text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded">4291</span> when they arrive.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;