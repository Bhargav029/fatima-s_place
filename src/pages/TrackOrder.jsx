import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HelpCircle, User, UtensilsCrossed, ChevronLeft, Share2, 
  Map, CheckCircle2, Clock, Truck, MapPin, Info, Palmtree
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- NEW: FIREBASE IMPORTS ---
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure your firebase.js config is in the src folder

const TrackOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Get the real order data passed from PaymentSuccess, OR use mock data if testing directly
  const orderData = location.state?.orderData || {
    id: 'F-92841', // Matches the hardcoded ID in StaffDashboard for testing
    time: new Date().toLocaleString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
    type: 'Delivery',
    amount: '₹1450.00'
  };

  const cartItems = location.state?.cartItems || [
    { id: '1', name: 'Butter Chicken Deluxe', qty: 1, price: 450 },
    { id: '2', name: 'Garlic Naan (Butter)', qty: 2, price: 90 },
    { id: '3', name: 'Paneer Tikka Platter', qty: 1, price: 320 },
    { id: '4', name: 'Saffron Rice', qty: 1, price: 240 }
  ];

  // 2. Real-time Order Status State
  const [currentStatus, setCurrentStatus] = useState('Pending'); 

  // 3. Listen to FIREBASE for live status updates!
  useEffect(() => {
    // Listen to the 'deliveries' collection in Firebase for this specific order
    const unsub = onSnapshot(doc(db, "deliveries", orderData.id), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        // If the staff has started the delivery, update the progress bar to "Ready/Out for Delivery"
        if (data.coords) {
          setCurrentStatus('Ready'); 
        }
        // If you add status tracking to Firebase later (e.g., Cooking), you can update it here:
        if (data.status) {
          setCurrentStatus(data.status);
        }
      }
    });

    return () => unsub(); // Cleanup listener on unmount
  }, [orderData.id]);

  // Handle Share Button
  const handleShare = () => {
    navigator.clipboard.writeText(`Track my order ${orderData.id} at Fatima's Place!`);
    alert("Tracking link copied to clipboard!");
  };

  // Define the tracking steps
  const steps = [
    { id: 'Placed', label: 'Order Placed', icon: CheckCircle2 },
    { id: 'Pending', label: 'Confirmed', icon: CheckCircle2 },
    { id: 'Cooking', label: 'Preparing', icon: Clock },
    { id: 'Ready', label: orderData.type === 'Delivery' ? 'Out for Delivery' : 'Ready to Serve', icon: Truck },
    { id: 'Delivered', label: 'Delivered', icon: MapPin }
  ];

  const getStepIndex = (status) => steps.findIndex(s => s.id === status);
  const currentStepIndex = Math.max(1, getStepIndex(currentStatus)); 

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-400 w-1/3 hidden md:flex">
          <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/menu')}>Cart</span> / 
          <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/checkout')}>Checkout</span> / 
          <span className="text-gray-900">Payment</span>
        </div>
        
        <div className="flex items-center gap-2 justify-center w-full md:w-1/3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-[#6b75f2] rounded-full flex items-center justify-center text-white shadow-sm">
            <Palmtree size={16} />
          </div>
          <span className="font-extrabold text-xl text-gray-900 hidden sm:block">Fatima's Place Checkout</span>
        </div>

        <div className="flex items-center gap-4 w-1/3 justify-end">
          <HelpCircle size={20} className="text-gray-400 cursor-pointer hover:text-gray-600 hidden sm:block" />
          <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name || "Customer User"}</p>
              <p className="text-[10px] font-bold text-[#6b75f2] uppercase tracking-widest">PREMIUM MEMBER</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-[#6b75f2] flex items-center justify-center overflow-hidden shrink-0">
              {user?.image ? <img src={user.image} className="w-full h-full object-cover" /> : <User size={16} className="text-gray-400" />}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-grow space-y-6">
        
        {/* TOP TITLE & BUTTONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm shrink-0">
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-gray-900">Order {orderData.id}</h1>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-gray-200">
                  {currentStatus === 'Delivered' ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium">Placed on {orderData.time}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleShare} className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
              <Share2 size={16}/> Share Order
            </button>
            {/* SEPARATE LIVE TRACKING BUTTON */}
            {orderData.type === 'Delivery' && (
              <button 
                onClick={() => navigate('/live-map')} 
                className="bg-[#6b75f2] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#5a64e1] transition-colors shadow-md shadow-indigo-100"
              >
                <Map size={16}/> Live Tracking
              </button>
            )}
          </div>
        </div>

        {/* PROGRESS BAR CARD */}
        <div className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm">
          <div className="flex justify-between items-start mb-10 border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{orderData.type === 'Delivery' ? 'Delivery Progress' : 'Preparation Progress'}</h2>
              <p className="text-sm text-gray-500 mt-1">Estimated {orderData.type.toLowerCase()} by 9:15 PM (Today)</p>
            </div>
            <div className="flex items-center gap-2 text-[#6b75f2] bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
              <Clock size={18} />
              <span className="font-black text-sm">12-18 MINS</span>
            </div>
          </div>

          {/* DYNAMIC PROGRESS STEPPER */}
          <div className="relative px-4 pb-4 overflow-x-auto overflow-y-hidden">
            <div className="min-w-[600px]">
                {/* Background Line */}
                <div className="absolute top-6 left-12 right-12 h-1 bg-gray-100 -z-10 rounded"></div>
                {/* Active Line Fill */}
                <div 
                  className="absolute top-6 left-12 h-1 bg-[#6b75f2] -z-10 rounded transition-all duration-500 ease-out" 
                  style={{ width: `calc(${currentStepIndex * 25}% - 24px)` }}
                ></div>

                <div className="flex justify-between relative z-10">
                  {steps.map((step, idx) => {
                    const isActive = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center gap-3 w-24 relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 bg-white
                          ${isCurrent ? 'border-[#6b75f2] text-[#6b75f2] shadow-lg shadow-indigo-100 scale-110' : 
                            isActive ? 'border-[#6b75f2] bg-[#6b75f2] text-white' : 'border-gray-200 text-gray-300'}`}
                        >
                          <step.icon size={isCurrent ? 22 : 18} strokeWidth={isCurrent ? 2.5 : 2} />
                        </div>
                        
                        <div className="text-center">
                          <p className={`text-xs font-bold transition-colors ${isActive ? 'text-[#6b75f2]' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="bg-indigo-50 text-[#6b75f2] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mt-1.5 inline-block border border-indigo-100">
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

        {/* ORDERED ITEMS LIST */}
        <div className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Ordered Items</h2>
            <span className="bg-gray-50 text-gray-600 text-xs font-bold px-4 py-1.5 rounded-full border border-gray-200">
              {cartItems.length} Items
            </span>
          </div>
          
          <div className="space-y-0">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                    <img 
                      src={`/assets/${item.id}.png`} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=150"; }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{item.name}</h3>
                    <p className="text-xs font-medium text-gray-500">Quantity: {item.qty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900">₹{(item.price * item.qty).toFixed(2)}</p>
                  {item.qty > 1 && <p className="text-[10px] text-gray-400 font-medium mt-0.5">₹{item.price.toFixed(2)} each</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-transparent py-8 border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Info size={16} />
            <p className="text-xs font-medium">Need help with your order? Call support at <span className="font-bold text-[#6b75f2]">+91 987 654 3210</span></p>
          </div>
          <div className="flex gap-6 text-xs font-bold text-gray-500">
            <span className="hover:text-gray-900 cursor-pointer">Support</span>
            <span className="text-gray-400 font-normal ml-4 hidden md:inline">© 2026 Fatima's Place. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrackOrder;