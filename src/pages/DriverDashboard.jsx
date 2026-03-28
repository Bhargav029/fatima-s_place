import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Ensure this context exists
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  MapPin, Navigation, Phone, CheckCircle, LogOut, Map, Package, User, Clock, ChevronRight, Sun, Moon
} from 'lucide-react';

const DriverDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme(); // Theme support
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [tripsToday, setTripsToday] = useState(0);

  // --- FAKE ORDER FOR TESTING ---
  const [assignedOrders, setAssignedOrders] = useState([
    { 
      id: 'ORD-TEST-001', 
      customerName: 'Test Customer', 
      deliveryAddress: '123 Beach Road, Vagator, Goa', 
      customerPhone: '+91 99999 88888', 
      status: 'Ready for Pickup', 
      amount: 450 
    }
  ]);

  const [watchId, setWatchId] = useState(null);

  const toggleOnlineStatus = () => {
    if (isOnline) {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      setIsOnline(false);
      setWatchId(null);
    } else {
      setIsOnline(true);
      // Mock GPS Tracking Start
      console.log("GPS Tracking Started for Test...");
    }
  };

  const handlePickUp = (order) => {
    setActiveOrder(order);
    setIsOnline(true);
    setAssignedOrders(prev => prev.filter(o => o.id !== order.id));
  };

  const handleComplete = () => {
    if (window.confirm("Mark as Delivered?")) {
      // Add the order amount to earnings and increment trips
      setTotalEarnings(prev => prev + activeOrder.amount);
      setTripsToday(prev => prev + 1);
      setActiveOrder(null);
      alert("Order Delivered! Earnings updated.");
    }
  };

  const openMaps = (address) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  if (!isAuthenticated || user?.role !== 'driver') return <Navigate to="/login" replace />;

  return (
    <div className={`min-h-screen flex flex-col pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0b10] text-white' : 'bg-[#f8f9fb] text-gray-900'}`}>
      
      {/* HEADER */}
      <header className={`p-4 border-b flex justify-between items-center sticky top-0 z-50 transition-colors ${isDarkMode ? 'bg-[#16171d] border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white border-2 border-indigo-100 overflow-hidden">
            {user?.image ? <img src={user.image} className="w-full h-full object-cover" /> : <User size={20} />}
          </div>
          <div>
            <h2 className="font-bold leading-none">{user.name || 'Test Driver'}</h2>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isOnline ? 'text-emerald-500' : 'text-gray-400'}`}>
              ● {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className={`p-2 rounded-lg border transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-800 text-yellow-400' : 'border-gray-200 hover:bg-gray-50 text-indigo-600'}`}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={logout} className="p-2 text-gray-400 hover:text-rose-500"><LogOut size={20}/></button>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto w-full">
        
        {/* ONLINE TOGGLE CARD */}
        {!activeOrder && (
           <div className={`rounded-2xl p-4 border flex items-center justify-between transition-colors ${isDarkMode ? 'bg-[#16171d] border-gray-800' : 'bg-white border-gray-200'}`}>
             <span className="font-bold text-sm">Shift Status</span>
             <button 
              onClick={toggleOnlineStatus}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${isOnline ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
             >
               {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
             </button>
           </div>
        )}

        {/* ACTIVE DELIVERY */}
        {activeOrder ? (
          <div className={`rounded-[32px] p-6 shadow-xl border-2 border-indigo-500 animate-in slide-in-from-bottom-4 transition-colors ${isDarkMode ? 'bg-[#16171d]' : 'bg-white'}`}>
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase">Active Trip</span>
              <span className="font-mono font-bold text-gray-400 text-xs">{activeOrder.id}</span>
            </div>

            <h3 className="text-2xl font-black mb-1">{activeOrder.customerName}</h3>
            <div className="flex items-start gap-2 mb-6">
              <MapPin size={18} className="text-rose-500 shrink-0 mt-1" />
              <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {activeOrder.deliveryAddress}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => openMaps(activeOrder.deliveryAddress)} className="flex items-center justify-center gap-2 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-sm shadow-md">
                <Map size={18} /> Navigate
              </button>
              <a href={`tel:${activeOrder.customerPhone}`} className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm border ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                <Phone size={18} /> Call
              </a>
            </div>

            <button onClick={handleComplete} className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 transition-all">
              Mark as Delivered
            </button>
          </div>
        ) : (
          
          /* ASSIGNED QUEUE */
          <div className="space-y-4">
            <h3 className="font-bold px-2 flex justify-between">
              Assigned to You <span>{assignedOrders.length}</span>
            </h3>

            {assignedOrders.length === 0 ? (
              <div className={`rounded-[32px] p-12 text-center border-2 border-dashed transition-colors ${isDarkMode ? 'bg-[#16171d] border-gray-800' : 'bg-white border-gray-200'}`}>
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-bold">No orders assigned.</p>
              </div>
            ) : (
              assignedOrders.map(order => (
                <div key={order.id} className={`rounded-3xl p-5 shadow-sm border transition-colors ${isDarkMode ? 'bg-[#16171d] border-gray-800' : 'bg-white border-gray-100'}`}>
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={14} />
                      <span className="text-xs font-bold uppercase tracking-tighter">Ready for Pickup</span>
                    </div>
                    <span className="text-xs font-black text-indigo-500">₹{order.amount}</span>
                  </div>
                  <h4 className="font-bold text-lg">{order.customerName}</h4>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-1">{order.deliveryAddress}</p>
                  <button 
                    onClick={() => handlePickUp(order)}
                    className="w-full py-3 bg-[#5b6aff] hover:bg-[#4a58e8] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    Accept Pickup <ChevronRight size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* BOTTOM EARNINGS BAR */}
      <div className={`fixed bottom-0 left-0 right-0 border-t p-4 flex justify-around transition-colors z-50 ${isDarkMode ? 'bg-[#16171d] border-gray-800' : 'bg-white border-gray-100'}`}>
         <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Today's Trips</p>
            <p className="font-black text-lg">{tripsToday}</p>
         </div>
         <div className={`w-[1px] transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
         <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Earnings</p>
            <p className="font-black text-lg text-emerald-500">₹{totalEarnings}</p>
         </div>
      </div>
    </div>
  );
};

export default DriverDashboard;