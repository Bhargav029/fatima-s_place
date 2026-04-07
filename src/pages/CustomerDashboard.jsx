import React, { useState, useEffect } from 'react';
import { 
  User, ShoppingBag, Calendar, Settings, Clock, 
  Star, Edit, CreditCard, ChevronRight, CheckCircle, 
  Moon, Sun, Camera, MapPin, Heart, Plus, XCircle, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, Navigate } from 'react-router-dom';
import NavbarMain from '../components/NavBarmain';

// --- FIREBASE IMPORTS ---
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

const CustomerDashboard = () => {
  const { user, login, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('My Overview');
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [reservations, setReservations] = useState([]); 
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const favoriteDishes = []; 
  const savedAddresses = [];

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) {
        setIsLoadingOrders(false);
        setIsLoadingReservations(false);
        return;
      }
      
      try {
        const qOrders = query(collection(db, "orders"), where("userEmail", "==", user.email));
        const orderSnapshot = await getDocs(qOrders);
        const fetchedOrders = [];
        orderSnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });
        fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentOrders(fetchedOrders);

        const qRes = query(collection(db, "reservations"), where("userEmail", "==", user.email));
        const resSnapshot = await getDocs(qRes);
        const fetchedReservations = [];
        resSnapshot.forEach((doc) => {
          fetchedReservations.push({ id: doc.id, ...doc.data() });
        });
        fetchedReservations.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReservations(fetchedReservations);

      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      } finally {
        setIsLoadingOrders(false);
        setIsLoadingReservations(false);
      }
    };

    fetchData();
  }, [user]);

  const handleCancelReservation = async (reservationId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this reservation?");
    if (!confirmCancel) return;

    try {
      const resRef = doc(db, "reservations", reservationId);
      await updateDoc(resRef, { status: "Cancelled" });

      setReservations(prev => 
        prev.map(res => res.id === reservationId ? { ...res, status: "Cancelled" } : res)
      );
      
    } catch (error) {
      console.error("Error cancelling reservation: ", error);
      alert("Failed to cancel reservation. Please try again.");
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const [profileData, setProfileData] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '', image: user?.image || null
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) return alert("Image must be under 2MB.");
      const reader = new FileReader();
      reader.onloadend = () => setProfileData(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    login({ ...user, ...profileData });
    alert("Profile updated successfully!");
    setActiveTab('My Overview');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0a0b10] flex flex-col transition-colors duration-300 font-sans relative">
      <NavbarMain />

      {/* MOBILE OPTIMIZATION: Reduced mt-8 to mt-4 and gap-8 to gap-6 */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full flex flex-col md:flex-row mt-4 md:mt-8 px-4 sm:px-6 gap-4 md:gap-8 pb-20">
        
        {/* MOBILE OPTIMIZATION: Changed to horizontal scroll on mobile, vertical on desktop */}
        <aside className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar snap-x">
          {[{ name: 'My Overview', icon: User }, { name: 'Order History', icon: ShoppingBag }, { name: 'Reservations', icon: Calendar }, { name: 'Settings', icon: Settings }].map((tab) => (
            <button 
              key={tab.name} 
              onClick={() => setActiveTab(tab.name)} 
              className={`flex items-center gap-2 px-4 py-3 md:w-full rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 snap-start
                ${activeTab === tab.name ? 'bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#16171d] hover:text-gray-900 dark:hover:text-white'}`}
            >
              <tab.icon size={18} /> {tab.name}
            </button>
          ))}
        </aside>

        {/* This tiny style block hides the ugly scrollbar on mobile but keeps it scrollable */}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        <div className="flex-grow">
          
          {/* --- TAB 1: MY OVERVIEW --- */}
          {activeTab === 'My Overview' && (
            <div className="animate-in fade-in duration-300">
              
              {recentOrders.length > 0 && recentOrders[0].status === 'Pending' && (
                <div className="bg-[#6b75f2] rounded-2xl p-5 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 shadow-lg shadow-indigo-200 dark:shadow-none mb-6 md:mb-8 text-white text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0"><Clock size={24} className="text-white" /></div>
                    <div><h2 className="text-xl font-black mb-1">Order #{recentOrders[0].id} is confirmed!</h2><p className="text-indigo-100 text-sm">We are preparing your food.</p></div>
                  </div>
                  <Link to="/track-order" className="w-full md:w-auto px-8 py-3 bg-white text-[#6b75f2] rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors text-center shadow-sm">Track Live</Link>
                </div>
              )}

              <div className="grid xl:grid-cols-3 gap-6 md:gap-8 items-start">
                <div className="xl:col-span-2 space-y-6 md:space-y-8">
                  
                  {/* MOBILE OPTIMIZATION: Reduced padding inside stat boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-[#16171d] p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] rounded-full flex items-center justify-center shrink-0"><ShoppingBag size={20} /></div>
                      <div><p className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Orders</p><p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{recentOrders.length}</p></div>
                    </div>
                    <div className="bg-white dark:bg-[#16171d] p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-50 dark:bg-pink-500/10 text-[#ec4899] rounded-full flex items-center justify-center shrink-0"><Star size={20} /></div>
                      <div><p className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Loyalty Points</p><p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{recentOrders.length * 45}</p></div>
                    </div>
                    <div className="bg-white dark:bg-[#16171d] p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shrink-0"><Calendar size={20} /></div>
                      <div><p className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Reservations</p><p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{reservations.filter(res => res.status !== 'Cancelled').length}</p></div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <div><h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3></div>
                      <button onClick={() => setActiveTab('Order History')} className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">View All</button>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      {isLoadingOrders ? (
                        <p className="text-sm text-gray-500 py-4 text-center">Loading your orders...</p>
                      ) : recentOrders.length > 0 ? (
                        recentOrders.slice(0, 3).map((order, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-gray-100 dark:border-gray-800 transition-all cursor-pointer group gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] rounded-full flex items-center justify-center shrink-0"><ShoppingBag size={16} /></div>
                              <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#6b75f2] transition-colors">Order #{order.id}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'} • {order.items}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                              <span className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${order.status === 'Cancelled' ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' : order.status === 'Pending' ? 'bg-orange-50 text-orange-500 dark:bg-orange-500/10' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>{order.status}</span>
                              <span className="font-bold text-gray-900 dark:text-white">{order.amount}</span>
                              <span className="text-xs font-bold text-gray-400 items-center gap-1 hidden sm:flex">Details <ChevronRight size={14} /></span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-5 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-[#16171d] text-center">
                          <ShoppingBag size={24} className="text-gray-300 mb-2"/>
                          <p className="text-sm text-gray-500 font-bold">No recent orders found.</p>
                          <Link to="/menu" className="text-xs text-[#6b75f2] mt-1 hover:underline">Start ordering now</Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Table Bookings */}
                  <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <div><h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Table Bookings</h3></div>
                      <button onClick={() => setActiveTab('Reservations')} className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">View All</button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {isLoadingReservations ? (
                        <p className="text-sm text-gray-500 col-span-2">Loading reservations...</p>
                      ) : reservations.length > 0 ? (
                        reservations.slice(0, 2).map((booking, i) => (
                          <div key={i} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shrink-0"><Calendar size={16} /></div>
                              <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{booking.date}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{booking.time} • {booking.guests} Guests</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                booking.status === 'Cancelled' ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' :
                                booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10' : 
                                'bg-orange-50 text-orange-500 dark:bg-orange-500/10'
                              }`}>
                                {booking.status || 'Confirmed'}
                              </span>
                              {booking.status !== 'Cancelled' && (
                                <button onClick={() => handleCancelReservation(booking.id)} className="text-[10px] text-rose-500 font-bold hover:underline">
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 col-span-2">You have no upcoming table bookings.</p>
                      )}
                    </div>
                    <div className="flex justify-center border-t border-gray-100 dark:border-gray-800 pt-6">
                      <Link to="/reservations" className="text-sm font-bold text-[#6b75f2] flex items-center gap-1 hover:underline">Book a New Table <ChevronRight size={16}/></Link>
                    </div>
                  </div>

                  {/* Saved Addresses */}
                  <div>
                    <div className="flex justify-between items-center mb-4 px-1">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Saved Addresses</h3>
                      <button className="text-xs font-bold text-[#6b75f2] flex items-center gap-1 hover:underline"><Plus size={14}/> Add New</button>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {savedAddresses.length > 0 ? (
                        savedAddresses.map((addr, i) => (
                          <div key={i} className="p-5 rounded-xl border bg-white dark:bg-[#16171d] border-gray-100 dark:border-gray-800">
                             {/* Address UI placeholder */}
                          </div>
                        ))
                      ) : (
                        <div className="sm:col-span-3 p-5 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center bg-gray-50/50 dark:bg-[#16171d]">
                          <p className="text-sm text-gray-500">No saved addresses yet.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* --- RIGHT SIDEBAR --- */}
                <div className="space-y-6 md:space-y-8">
                  {/* Profile Card */}
                  <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 overflow-hidden relative pb-6">
                    <div className="h-24 bg-indigo-50 dark:bg-[#1e1f26] w-full absolute top-0 left-0 z-0 border-b border-gray-100 dark:border-gray-800"></div>
                    <div className="relative z-10 flex flex-col items-center pt-10 px-6">
                      <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-full bg-white dark:bg-[#16171d] border-4 border-white dark:border-[#16171d] shadow-sm flex items-center justify-center overflow-hidden">
                          {user?.image ? <img src={user.image} alt={user?.name} className="w-full h-full object-cover" /> : <User size={40} className="text-gray-300 dark:text-gray-600" />}
                        </div>
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#16171d] rounded-full"></div>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white text-center w-full truncate px-4">{user?.name || "Customer User"}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center w-full truncate px-4">{user?.email || "No email provided"}</p>
                      <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 md:mb-8">Member</div>
                      <div className="w-full grid grid-cols-2 gap-3 border-t border-gray-100 dark:border-gray-800 pt-6">
                        <button onClick={() => setActiveTab('Settings')} className="py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><Edit size={14} /> Edit Profile</button>
                        <button onClick={() => setShowPaymentModal(true)} className="py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><CreditCard size={14} /> Payment</button>
                      </div>
                    </div>
                  </div>

                  {/* Favorite Dishes */}
                  <div>
                    <div className="flex justify-between items-center mb-4 px-1">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Favorite Dishes</h3>
                      <Link to="/menu" className="text-xs font-bold text-[#6b75f2] hover:underline">Menu</Link>
                    </div>
                    <div className="space-y-4">
                      {favoriteDishes.length > 0 ? (
                        favoriteDishes.map((dish, i) => (
                          <div key={i} className="bg-white dark:bg-[#16171d] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                            <div className="h-32 w-full relative">
                              <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                              <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-rose-500 shadow-sm"><Heart size={14} fill="currentColor" /></button>
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{dish.name}</h4>
                                <span className="font-bold text-[#6b75f2] text-sm">{dish.price}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1 text-xs font-bold text-gray-500"><Star size={12} className="text-orange-400 fill-orange-400" /> {dish.rating}</div>
                                <button className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white">Order Again</button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-white dark:bg-[#16171d] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center justify-center text-center">
                          <Heart size={24} className="text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">No favorite dishes yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB 2: ORDER HISTORY --- */}
          {activeTab === 'Order History' && (
            <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 md:p-8 animate-in fade-in duration-300">
              <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Full Order History</h2>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Review all your past orders and receipts.</p>
              </div>

              <div className="space-y-4">
                {isLoadingOrders ? (
                  <p className="text-center py-10 text-gray-500">Loading order history...</p>
                ) : recentOrders.length > 0 ? (
                  recentOrders.map((order, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] rounded-full flex items-center justify-center shrink-0">
                          <ShoppingBag size={18} className="md:w-5 md:h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm md:text-base">Order #{order.id}</p>
                          <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''} at {order.time}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-2 font-medium">
                            {order.items} • {order.type} • {order.paymentMethod === 'cod' ? 'Cash' : 'Online'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:flex-col md:justify-center gap-2 border-t md:border-t-0 border-gray-100 dark:border-gray-800 pt-4 md:pt-0 w-full md:w-auto">
                        <span className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'Cancelled' ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' :
                          order.status === 'Pending' ? 'bg-orange-50 text-orange-500 dark:bg-orange-500/10' 
                          : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-base md:text-lg font-black text-gray-900 dark:text-white">{order.amount}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-10 md:p-16 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                    <ShoppingBag size={32} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-bold text-sm">No order history found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- TAB 3: RESERVATIONS --- */}
          {activeTab === 'Reservations' && (
            <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 md:p-8 animate-in fade-in duration-300">
               <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                 <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Your Reservations</h2>
                 <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Review all your past and upcoming table bookings.</p>
               </div>

               <div className="space-y-4">
                 {isLoadingReservations ? (
                   <p className="text-center py-10 text-gray-500">Loading reservations...</p>
                 ) : reservations.length > 0 ? (
                   reservations.map((booking, i) => (
                     <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors gap-4">
                       <div className="flex items-start gap-4">
                         <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                           <Calendar size={18} className="md:w-5 md:h-5" />
                         </div>
                         <div>
                           <p className="font-bold text-gray-900 dark:text-white text-sm md:text-base">Table for {booking.guests}</p>
                           <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 mt-1">
                             {booking.date} at {booking.time}
                           </p>
                           {booking.specialRequest && (
                              <p className="text-[11px] md:text-xs text-gray-500 mt-2 italic line-clamp-2">"{booking.specialRequest}"</p>
                           )}
                         </div>
                       </div>
                       
                       <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800 w-full md:w-auto">
                         <span className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${
                           booking.status === 'Cancelled' ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' :
                           booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10' 
                           : 'bg-orange-50 text-orange-500 dark:bg-orange-500/10'
                         }`}>
                           {booking.status || 'Confirmed'}
                         </span>
                         {booking.status !== 'Cancelled' && (
                           <button 
                             onClick={() => handleCancelReservation(booking.id)} 
                             className="flex items-center gap-1 text-[11px] md:text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                           >
                             <XCircle size={14} /> Cancel
                           </button>
                         )}
                       </div>
                     </div>
                   ))
                 ) : (
                   <div className="text-center p-10 md:p-16 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                     <Calendar size={32} className="mx-auto text-gray-300 mb-4" />
                     <p className="text-gray-500 font-bold text-sm">No reservations found.</p>
                     <Link to="/reservations" className="text-[#6b75f2] text-xs md:text-sm font-bold mt-2 inline-block hover:underline">Book a table</Link>
                   </div>
                 )}
               </div>
            </div>
          )}

          {/* --- TAB 4: SETTINGS --- */}
          {activeTab === 'Settings' && (
            <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 md:p-8 animate-in fade-in duration-300">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Account Settings</h2>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-6 md:mb-8">Update your profile details and preferences.</p>

              <form onSubmit={handleSaveProfile} className="space-y-6 md:space-y-8 max-w-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-[#16171d] shadow-sm flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {profileData.image ? <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" /> : <User size={40} className="text-gray-300 dark:text-gray-600" />}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={24} className="text-white" /></div>
                  </div>
                  <div>
                    <label className="inline-block bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors shadow-sm">
                      Upload Photo<input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                    <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5"><label className="text-[11px] md:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label><input type="text" placeholder="John Doe" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-[#6b75f2] outline-none dark:text-white transition-colors" /></div>
                  <div className="space-y-1.5"><label className="text-[11px] md:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label><input type="email" placeholder="john@example.com" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-[#6b75f2] outline-none dark:text-white transition-colors" /></div>
                  <div className="space-y-1.5"><label className="text-[11px] md:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label><input type="tel" placeholder="+91 98765 43210" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-[#6b75f2] outline-none dark:text-white transition-colors" /></div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-[#6b75f2]"><Moon size={20} /></div>
                    <div><p className="text-sm font-bold text-gray-900 dark:text-white">Dark Mode</p><p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400">Toggle dark theme</p></div>
                  </div>
                  <button type="button" onClick={toggleTheme} className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${isDarkMode ? 'bg-[#6b75f2]' : 'bg-gray-300'}`}><div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} /></button>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                  <button type="submit" className="w-full sm:w-auto bg-[#6b75f2] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#5a64e1] transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-100 dark:shadow-none">Save Changes <CheckCircle size={16} /></button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* --- PAYMENT METHODS MODAL --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#16171d] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Payment Methods</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            {/* MOBILE OPTIMIZATION: Added overflow-y-auto so the modal scrolls on short screens */}
            <div className="p-5 md:p-6 space-y-4 overflow-y-auto custom-scrollbar">
              
              <div className="flex items-center justify-between p-4 border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center text-[#6b75f2]">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Visa ending in 4242</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Expires 12/28</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#6b75f2] uppercase tracking-wider bg-indigo-100 dark:bg-indigo-500/20 px-2 py-1 rounded">Default</span>
              </div>
              
              <button 
                onClick={() => { 
                  alert("Integration for saving new cards securely is coming soon!"); 
                  setShowPaymentModal(false); 
                }} 
                className="w-full py-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add New Payment Method
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerDashboard;