import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HelpCircle, User, UtensilsCrossed, ChevronLeft, Share2, 
  Map, CheckCircle2, Clock, Truck, MapPin, Palmtree
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import NavbarMain from "../components/NavBarmain";
import Footer from "../components/Footer";

// --- FIREBASE IMPORTS ---
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; 

const TrackOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const orderData = location.state?.orderData || {
    id: 'F-92841', 
    time: new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    type: 'Delivery',
    amount: '₹0.00'
  };

  const [currentStatus, setCurrentStatus] = useState('Pending'); 
  const [trackedItems, setTrackedItems] = useState(location.state?.cartItems || []); 

  useEffect(() => {
    if (!orderData.id) return;

    const unsub = onSnapshot(doc(db, "orders", orderData.id), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.status) setCurrentStatus(data.status);
        if (data.cartItems) setTrackedItems(data.cartItems);
      }
    });

    return () => unsub(); 
  }, [orderData.id]);

  const steps = [
    { id: 'Pending', label: 'Order Placed', icon: CheckCircle2 },
    { id: 'Cooking', label: 'Preparing', icon: Clock },
    { id: 'Ready', label: orderData.type === 'Delivery' ? 'Out for Delivery' : 'Ready to Serve', icon: Truck },
    { id: 'Delivered', label: 'Delivered', icon: MapPin }
  ];

  const getStepIndex = (status) => steps.findIndex(s => s.id === status);
  const currentStepIndex = Math.max(0, getStepIndex(currentStatus)); 

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0a0b10] flex flex-col font-sans transition-colors duration-300">
      
      <NavbarMain />

      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-grow space-y-6">
        
        {/* TOP TITLE & BUTTONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white dark:bg-[#16171d] border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm shrink-0">
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">Order {orderData.id}</h1>
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-gray-200 dark:border-gray-700">
                  {currentStatus === 'Delivered' ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Placed on {orderData.time}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="bg-white dark:bg-[#16171d] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
              <Share2 size={16}/> Share
            </button>
            {orderData.type === 'Delivery' && currentStatus === 'Ready' && (
              <button 
                onClick={() => navigate('/live-map')} 
                className="bg-[#6b75f2] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#5a64e1] transition-colors shadow-md shadow-indigo-100 dark:shadow-none animate-pulse"
              >
                <Map size={16}/> Live Map
              </button>
            )}
          </div>
        </div>

        {/* PROGRESS BAR CARD */}
        <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-[24px] p-8 shadow-sm overflow-hidden">
          <div className="flex justify-between items-start mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{orderData.type === 'Delivery' ? 'Delivery Progress' : 'Preparation Progress'}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Status: <span className="text-[#6b75f2] font-bold">{currentStatus}</span></p>
            </div>
            <div className="flex items-center gap-2 text-[#6b75f2] bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
              <Clock size={18} className={currentStatus !== 'Delivered' ? "animate-spin-slow" : ""} />
              <span className="font-black text-sm">12-18 MINS</span>
            </div>
          </div>

          {/* DYNAMIC PROGRESS STEPPER WITH CUSTOM ANIMATION */}
          <div className="relative px-2 pt-2 pb-6 overflow-x-auto overflow-y-hidden custom-scrollbar">
            
            {/* INJECTED CSS FOR THE MOVING LOADING STRIPES */}
            <style>{`
              @keyframes move-stripes {
                0% { background-position: 0 0; }
                100% { background-position: 24px 0; }
              }
              .animate-loading-bar {
                background-image: linear-gradient(
                  -45deg, 
                  rgba(255, 255, 255, 0.25) 25%, 
                  transparent 25%, 
                  transparent 50%, 
                  rgba(255, 255, 255, 0.25) 50%, 
                  rgba(255, 255, 255, 0.25) 75%, 
                  transparent 75%, 
                  transparent
                );
                background-size: 24px 24px;
                animation: move-stripes 1s linear infinite;
              }
            `}</style>

            <div className="min-w-[500px] relative">
                {/* Background Line */}
                <div className="absolute top-5 left-10 right-10 h-1.5 bg-gray-100 dark:bg-gray-800 -z-10 rounded-full"></div>
                
                {/* Active Line Fill (WITH MOVING STRIPES ANIMATION) */}
                <div 
                  className="absolute top-5 left-10 h-1.5 bg-[#6b75f2] -z-10 rounded-full transition-all duration-700 ease-out animate-loading-bar" 
                  style={{ width: `calc(${currentStepIndex * 33.33}% - 24px)` }}
                >
                  {/* Glowing Dot at the tip of the line */}
                  {currentStatus !== 'Delivered' && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_8px_#6b75f2] animate-ping"></div>
                  )}
                </div>

                <div className="flex justify-between relative z-10">
                  {steps.map((step, idx) => {
                    const isActive = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center gap-3 w-20 relative">
                        {/* SMALLER CIRCLES: Reduced to w-10 h-10 */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white dark:bg-[#16171d]
                          ${isCurrent ? 'border-[#6b75f2] text-[#6b75f2] shadow-lg shadow-indigo-100 dark:shadow-none scale-110' : 
                            isActive ? 'border-[#6b75f2] bg-[#6b75f2] text-white' : 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600'}`}
                        >
                          <step.icon size={isCurrent ? 18 : 16} strokeWidth={isCurrent ? 2.5 : 2} />
                        </div>
                        
                        <div className="text-center">
                          <p className={`text-[11px] font-bold transition-colors ${isActive ? 'text-[#6b75f2]' : 'text-gray-400 dark:text-gray-500'}`}>
                            {step.label}
                          </p>
                          {/* PULSING BADGE for current step */}
                          {isCurrent && (
                            <span className="bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mt-1.5 inline-block border border-indigo-100 dark:border-indigo-500/20 animate-pulse">
                              CURRENT
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
            </div>
          </div>
        </div>

        {/* REAL ORDERED ITEMS LIST */}
        <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-[24px] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ordered Items</h2>
            <span className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
              {trackedItems.length} Items
            </span>
          </div>
          
          <div className="space-y-0">
            {trackedItems.length === 0 ? (
              <p className="text-center py-6 text-gray-400 dark:text-gray-500 font-medium">Loading items from database...</p>
            ) : (
              trackedItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shrink-0">
                      <img 
                        src={`/assets/${item.id}.png`} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=150"; }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{item.name}</h3>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Quantity: {item.qty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 dark:text-white">₹{(item.price * item.qty).toFixed(2)}</p>
                    {item.qty > 1 && <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">₹{item.price.toFixed(2)} each</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;