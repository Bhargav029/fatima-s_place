import React, { useState, useEffect } from 'react';
import { 
  User, ShoppingBag, Calendar, Settings, Clock, 
  Star, Edit, CreditCard, ChevronRight, CheckCircle, 
  Moon, Sun, Camera, Edit3, MapPin, Heart, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, Navigate } from 'react-router-dom';
import NavbarMain from '../components/NavBarmain';

const CustomerDashboard = () => {
  const { user, login, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('My Overview');
  
  // State for dynamic orders
  const [recentOrders, setRecentOrders] = useState([]);

  // Load orders from LocalStorage when dashboard mounts
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('fatimas_orders')) || [];
    setRecentOrders(savedOrders);
  }, []);

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

  const tableBookings = [];
  const savedAddresses = [];

  const favoriteDishes = [
    { name: 'Authentic Prawn Balchão', price: '₹550', rating: 4.9, image: 'https://images.squarespace-cdn.com/content/v1/578753d7d482e9c3a909de40/1671166439873-B4VPXCUQH3CGHJUJ1WGB/1871-Goan-Prawn-Balchao-Curry-With-Basmati-Rice.jpeg?format=1500w' },
    { name: 'Traditional Chicken Xacuti', price: '₹480', rating: 4.8, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400' }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0a0b10] flex flex-col transition-colors duration-300 font-sans">
      <NavbarMain />

      <main className="flex-grow max-w-[1400px] mx-auto w-full flex flex-col md:flex-row mt-8 px-6 gap-8 pb-20">
        
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          {[{ name: 'My Overview', icon: User }, { name: 'Order History', icon: ShoppingBag }, { name: 'Reservations', icon: Calendar }, { name: 'Settings', icon: Settings }].map((tab) => (
            <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab.name ? 'bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#16171d] hover:text-gray-900 dark:hover:text-white'}`}>
              <tab.icon size={18} /> {tab.name}
            </button>
          ))}
        </aside>

        <div className="flex-grow">
          
          {activeTab === 'My Overview' && (
            <div className="animate-in fade-in duration-300">
              
              {/* DYNAMIC TOP BANNER: Only shows if there is an active order */}
              {recentOrders.length > 0 && (
                <div className="bg-[#6b75f2] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg shadow-indigo-200 dark:shadow-none mb-8 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0"><Clock size={24} className="text-white" /></div>
                    <div><h2 className="text-xl font-black mb-1">Order #{recentOrders[0].id} is being prepared!</h2><p className="text-indigo-100 text-sm">Estimated arrival in 24 minutes</p></div>
                  </div>
                  <Link to="/track-order" className="w-full md:w-auto px-8 py-3 bg-white text-[#6b75f2] rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors text-center shadow-sm">Track Live</Link>
                </div>
              )}

              <div className="grid xl:grid-cols-3 gap-8 items-start">
                
                {/* --- LEFT COLUMN --- */}
                <div className="xl:col-span-2 space-y-8">
                  
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-[#16171d] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] rounded-full flex items-center justify-center shrink-0"><ShoppingBag size={20} /></div>
                      <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Orders</p><p className="text-2xl font-black text-gray-900 dark:text-white">{recentOrders.length}</p></div>
                    </div>
                    <div className="bg-white dark:bg-[#16171d] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-50 dark:bg-pink-500/10 text-[#ec4899] rounded-full flex items-center justify-center shrink-0"><Star size={20} /></div>
                      <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Loyalty Points</p><p className="text-2xl font-black text-gray-900 dark:text-white">{recentOrders.length * 45}</p></div>
                    </div>
                    <div className="bg-white dark:bg-[#16171d] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shrink-0"><Calendar size={20} /></div>
                      <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reservations</p><p className="text-2xl font-black text-gray-900 dark:text-white">0</p></div>
                    </div>
                  </div>

                  {/* Recent Orders - Maps over dynamic storage data */}
                  <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                    <div className="flex justify-between items-center mb-6">
                      <div><h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">View and manage your recent dining experiences</p></div>
                      <button onClick={() => setActiveTab('Order History')} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">View All History</button>
                    </div>
                    <div className="space-y-4">
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-gray-100 dark:border-gray-800 transition-all cursor-pointer group gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] rounded-full flex items-center justify-center shrink-0"><ShoppingBag size={16} /></div>
                              <div><p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#6b75f2] transition-colors">Order #{order.id}</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{order.date} • {order.items}</p></div>
                            </div>
                            <div className="flex items-center gap-6 sm:gap-8 justify-between sm:justify-end w-full sm:w-auto">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.isCancelled ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' : order.status === 'Preparing' ? 'bg-orange-50 text-orange-500 dark:bg-orange-500/10' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>{order.status}</span>
                              <span className="font-bold text-gray-900 dark:text-white">{order.price}</span>
                              <span className="text-xs font-bold text-gray-400 flex items-center gap-1 hidden sm:flex">View Details <ChevronRight size={14} /></span>
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
                  <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Table Bookings</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage your upcoming and past reservations</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {tableBookings.length > 0 ? (
                        tableBookings.map((booking, i) => (
                          <div key={i} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] rounded-full flex items-center justify-center shrink-0"><Calendar size={16} /></div>
                              <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{booking.date}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{booking.time} • {booking.guests} Guests</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${booking.status === 'Confirmed' ? 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300' : 'bg-orange-50 text-orange-500 dark:bg-orange-500/10'}`}>{booking.status}</span>
                              <button className="text-gray-400 hover:text-[#6b75f2]"><Edit3 size={14} /></button>
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
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Saved Addresses</h3>
                      <button className="text-xs font-bold text-[#6b75f2] flex items-center gap-1 hover:underline"><Plus size={14}/> Add New</button>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {savedAddresses.length > 0 ? (
                        savedAddresses.map((addr, i) => (
                          <div key={i} className={`p-5 rounded-xl border transition-colors ${addr.isDefault ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20' : 'bg-white dark:bg-[#16171d] border-gray-100 dark:border-gray-800'}`}>
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin size={14} className="text-gray-500" />
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{addr.type}</h4>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{addr.address}</p>
                            {addr.isDefault && <span className="bg-indigo-100 dark:bg-indigo-500/20 text-[#6b75f2] px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">Default</span>}
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
                <div className="space-y-8">
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
                      <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-8">Member</div>
                      <div className="w-full grid grid-cols-2 gap-3 border-t border-gray-100 dark:border-gray-800 pt-6">
                        <button onClick={() => setActiveTab('Settings')} className="py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><Edit size={14} /> Edit Profile</button>
                        <button className="py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><CreditCard size={14} /> Payment</button>
                      </div>
                    </div>
                  </div>

                  {/* Favorite Dishes */}
                  <div>
                    <div className="flex justify-between items-center mb-4 px-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Favorite Dishes</h3>
                      <Link to="/menu" className="text-xs font-bold text-[#6b75f2] hover:underline">Menu</Link>
                    </div>
                    <div className="space-y-4">
                      {favoriteDishes.map((dish, i) => (
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
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Account Settings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Update your profile details and preferences.</p>

              <form onSubmit={handleSaveProfile} className="space-y-8 max-w-2xl">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-[#16171d] shadow-sm flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {profileData.image ? <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" /> : <User size={40} className="text-gray-300 dark:text-gray-600" />}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={24} className="text-white" /></div>
                  </div>
                  <div>
                    <label className="inline-block bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors shadow-sm">
                      Upload New Photo<input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label><input type="text" placeholder="John Doe" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-[#6b75f2] outline-none dark:text-white transition-colors" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label><input type="email" placeholder="john@example.com" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-[#6b75f2] outline-none dark:text-white transition-colors" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label><input type="tel" placeholder="+91 98765 43210" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-[#6b75f2] outline-none dark:text-white transition-colors" /></div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-[#6b75f2]">{isDarkMode ? <Moon size={20} /> : <Sun size={20} />}</div>
                    <div><p className="text-sm font-bold text-gray-900 dark:text-white">Dark Mode</p><p className="text-xs text-gray-500 dark:text-gray-400">Toggle dark theme</p></div>
                  </div>
                  <button type="button" onClick={toggleTheme} className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${isDarkMode ? 'bg-[#6b75f2]' : 'bg-gray-300'}`}><div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} /></button>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                  <button type="submit" className="bg-[#6b75f2] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#5a64e1] transition-colors flex items-center gap-2 text-sm shadow-lg shadow-indigo-100 dark:shadow-none">Save Changes <CheckCircle size={16} /></button>
                </div>
              </form>
            </div>
          )}

          {(activeTab === 'Order History' || activeTab === 'Reservations') && (
            <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-16 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">{activeTab === 'Order History' ? <ShoppingBag size={24} /> : <Calendar size={24} />}</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{activeTab}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your historical data will appear here.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;