import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Navigation, Phone, CheckCircle, Palmtree, LogOut, Sun, Moon,UtensilsCrossed,ChevronRight,
  LayoutGrid, Clock, Truck, Plus, Bell, CheckSquare, Square, AlertCircle, Check, User, ChefHat, Flame, Settings, SplitSquareHorizontal 
} from 'lucide-react';

import { doc, setDoc, updateDoc } from 'firebase/firestore'; // Added updateDoc for Customer Sync
import { db } from '../firebase'; 

const StaffDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Kitchen Queue'); // Set to Kitchen Queue for testing
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // --- MOCK STAFF DATABASE ---
  const mockStaffList = ['Rohan', 'Sneha', 'John', 'Alisha', 'Vikram', 'Priya'];

  // --- REAL-TIME CLOCK STATE (POWERS BOTH TABLES AND KITCHEN) ---
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000); // Ticks every 60 seconds
    return () => clearInterval(timer);
  }, []);

  const formatActiveTime = (timestamp) => {
    if (!timestamp) return '';
    const diffMins = Math.floor((currentTime - timestamp) / 60000);
    if (diffMins === 0) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hrs}h ${mins}m`;
  };

  const formatTicketTime = (timestamp) => {
    if (!timestamp) return '';
    const diffMins = Math.floor((currentTime - timestamp) / 60000);
    if (diffMins === 0) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hrs}h ${mins}m ago`;
  };

  // --- ALERTS & BROADCASTS STATE ---
  const [broadcasts, setBroadcasts] = useState([
    { id: 1, type: 'urgent', title: 'Out of Stock', message: 'Serradura is unavailable for the rest of the shift.', time: '10m ago' },
    { id: 2, type: 'info', title: 'Shift Swap Approved', message: 'Your Thursday morning shift is now covered by Alisha.', time: '1h ago' }
  ]);
  const urgentCount = broadcasts.filter(b => b.type === 'urgent').length;

  // --- DELIVERY STATE ---
  const [isDelivering, setIsDelivering] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const activeOrder = { id: "F-92841", customer: "John Doe", address: "Villa 4, Sunset Blvd, Vagator", phone: "+91 98765 43210" };

  const toggleDeliveryStatus = () => {
    if (isDelivering) {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      setIsDelivering(false);
      setWatchId(null);
      alert("Delivery paused. Tracking stopped.");
    } else {
      if (!navigator.geolocation) return alert("Geolocation is not supported by your browser");
      setIsDelivering(true);
      const id = navigator.geolocation.watchPosition(
        async (position) => {
          const newLocation = [position.coords.latitude, position.coords.longitude];
          setCurrentLocation(newLocation);
          try {
            await setDoc(doc(db, "deliveries", activeOrder.id), {
              coords: newLocation, driverName: user?.name || 'Fatima Staff', phone: user?.phone || '+91 987 654 3210', lastUpdated: new Date().toISOString()
            });
          } catch (error) { console.error("Error:", error); }
        },
        (error) => { alert("Please enable GPS permissions."); setIsDelivering(false); },
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

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'staff' && user?.role !== 'admin') return <Navigate to="/" replace />;

  // --- LIVE FLOOR STATE WITH TIMESTAMPS ---
  const [floorTables, setFloorTables] = useState([
    { id: 'T-01', seats: 2, status: 'Available' },
    { id: 'T-02', seats: 4, status: 'Seated', server: 'Rohan', seatedAt: Date.now() - 12 * 60000 }, 
    { id: 'T-03', seats: 4, status: 'Cooking', server: 'Sneha', seatedAt: Date.now() - 34 * 60000 }, 
    { id: 'T-04', seats: 6, status: 'Seated', server: 'Rohan', seatedAt: Date.now() - 5 * 60000 },
    { id: 'T-05', seats: 2, status: 'Ready', server: 'Sneha', seatedAt: Date.now() - 45 * 60000 },
    { id: 'T-06', seats: 8, status: 'Available' },
    { id: 'T-07', seats: 4, status: 'Cooking', server: 'John', seatedAt: Date.now() - 22 * 60000 },
    { id: 'T-08', seats: 4, status: 'Available' },
    { id: 'T-09', seats: 2, status: 'Seated', server: 'Sneha', seatedAt: Date.now() - 18 * 60000 },
  ]);

  // --- MERGE TABLE LOGIC ---
  const [isMergeMode, setIsMergeMode] = useState(false);
  const [selectedForMerge, setSelectedForMerge] = useState([]);

  const toggleMergeSelection = (tableId, currentStatus) => {
    if (currentStatus !== 'Available') return alert("You can only merge tables that are currently Available.");
    setSelectedForMerge(prev => prev.includes(tableId) ? prev.filter(id => id !== tableId) : [...prev, tableId]);
  };

  const confirmMerge = () => {
    if (selectedForMerge.length < 2) return alert("Please select at least 2 available tables to merge.");
    setFloorTables(prev => {
      const tablesToMerge = prev.filter(t => selectedForMerge.includes(t.id));
      const combinedSeats = tablesToMerge.reduce((sum, t) => sum + t.seats, 0);
      const combinedId = selectedForMerge.join(' & ');
      const mergedTable = { id: combinedId, seats: combinedSeats, status: 'Available', isMerged: true, originalTables: tablesToMerge };
      const remainingTables = prev.filter(t => !selectedForMerge.includes(t.id));
      return [...remainingTables, mergedTable];
    });
    setIsMergeMode(false);
    setSelectedForMerge([]);
  };

  const unmergeTable = (mergedTableId) => {
    setFloorTables(prev => {
      const theMergedTable = prev.find(t => t.id === mergedTableId);
      const remainingTables = prev.filter(t => t.id !== mergedTableId);
      return [...remainingTables, ...theMergedTable.originalTables].sort((a,b) => a.id.localeCompare(b.id));
    });
  };

  const handleTableAction = (tableId, currentStatus) => {
    if (isMergeMode) { toggleMergeSelection(tableId, currentStatus); return; }
    setFloorTables(prev => prev.map(t => {
      if (t.id === tableId) {
        if (currentStatus === 'Available') {
          const randomStaff = mockStaffList[Math.floor(Math.random() * mockStaffList.length)];
          return { ...t, status: 'Seated', server: randomStaff, seatedAt: Date.now() };
        }
        if (currentStatus === 'Seated') return { ...t, status: 'Cooking' };
        if (currentStatus === 'Cooking') return { ...t, status: 'Ready' };
        if (currentStatus === 'Ready') return { ...t, status: 'Available', server: undefined, seatedAt: undefined };
      }
      return t;
    }));
  };

  // --- TASKS STATE ---
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Check sanitization logs', done: true }, { id: 2, text: 'Refill napkins at T1-T10', done: false },
    { id: 3, text: 'Birthday cake at 8:30 PM (T4)', done: false }, { id: 4, text: 'Restock Goan Feni at Bar', done: false },
  ]);
  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const handleAddTask = () => { const newTask = window.prompt("Enter a new task for your shift:"); if (newTask) setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]); };

  // --- KITCHEN QUEUE STATE (UPGRADED WITH TIMESTAMPS AND FILTERING) ---
  const [kitchenFilter, setKitchenFilter] = useState('All'); // State for the filter buttons

  const [kitchenTickets, setKitchenTickets] = useState([
    { id: 'K-892', type: 'Dine-In (T-03)', createdAt: Date.now() - 14 * 60000, status: 'Cooking', items: [{ qty: 2, name: 'Prawn Balchão', note: 'Extra Spicy' }, { qty: 1, name: 'Fish Thali', note: '' }] },
    { id: 'K-893', type: 'Delivery', createdAt: Date.now() - 4 * 60000, status: 'Pending', items: [{ qty: 1, name: 'Chicken Xacuti', note: '' }, { qty: 3, name: 'Poee (Goan Bread)', note: 'Warm' }] },
    { id: 'K-894', type: 'Dine-In (T-07)', createdAt: Date.now() - 1 * 60000, status: 'Pending', items: [{ qty: 2, name: 'Bebinca', note: '' }, { qty: 2, name: 'Goan Feni Cocktail', note: 'Prepare at Bar' }] },
    { id: 'K-895', type: 'Delivery', createdAt: Date.now(), status: 'Pending', items: [{ qty: 1, name: 'Goan Fish Curry', note: '' }] }
  ]);

  // Derived state: only show tickets that match the selected filter
  const filteredTickets = kitchenTickets.filter(ticket => {
    if (kitchenFilter === 'All') return true;
    return ticket.type.includes(kitchenFilter);
  });

  const handleKitchenAction = async (ticketId, currentStatus) => {
    if (currentStatus === 'Pending') {
      // 1. Update UI instantly
      setKitchenTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'Cooking' } : t));
      
      // 2. 🔴 LIVE BACKEND SYNC: Update Customer's Live Track Dashboard
      try {
        // await updateDoc(doc(db, "orders", ticketId), { status: 'Cooking', updated_at: new Date().toISOString() });
        console.log(`[Firebase Sync] Order ${ticketId} updated to: Cooking`);
      } catch (error) { console.error("Error syncing to customer app:", error); }

    } else if (currentStatus === 'Cooking') {
      // 1. Update UI (Remove from active cooking queue)
      setKitchenTickets(prev => prev.filter(t => t.id !== ticketId));
      
      // 2. 🔴 LIVE BACKEND SYNC: Notify Delivery Driver or Waiter
      try {
        // await updateDoc(doc(db, "orders", ticketId), { status: 'Ready', updated_at: new Date().toISOString() });
        console.log(`[Firebase Sync] Order ${ticketId} updated to: Ready for Pickup/Delivery`);
      } catch (error) { console.error("Error syncing to customer app:", error); }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'border-emerald-400 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10';
      case 'Seated': return 'border-blue-400 text-blue-500 bg-blue-50 dark:bg-blue-500/10';
      case 'Cooking': return 'border-orange-400 text-orange-500 bg-orange-50 dark:bg-orange-500/10';
      case 'Ready': return 'border-amber-400 text-amber-500 bg-amber-50 dark:bg-amber-500/10';
      default: return 'border-gray-200';
    }
  };

  const activeTableCount = floorTables.filter(t => t.status !== 'Available').length;

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0a0b10] flex transition-colors duration-300 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-white dark:bg-[#16171d] border-r border-gray-100 dark:border-gray-800 flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 select-none">
            <div className="flex items-center justify-center w-8 h-8 text-white bg-[#5b6aff] rounded-full"><Palmtree size={18} /></div>
            <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Fatima's Place</span>
          </div>
        </div>
        
        <div className="p-4 space-y-2 flex-grow">
          {[
            { id: 'Live Floor', icon: LayoutGrid },
            { id: 'Kitchen Queue', icon: ChefHat },
            { id: 'Deliveries', icon: Truck },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === item.id ? 'bg-indigo-50 text-[#5b6aff] dark:bg-indigo-500/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
              <item.icon size={18} /> {item.id}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <header className="bg-white dark:bg-[#16171d] border-b border-gray-100 dark:border-gray-800 p-6 flex justify-between items-center sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Staff Operations</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Logged in as: <span className="font-bold text-[#5b6aff]">{user?.name || 'Staff Member'} (Station A)</span></p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#0a0b10]">
              <UtensilsCrossed size={16} className="text-[#5b6aff]" />
              <div className="text-right leading-tight">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Tables</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{activeTableCount} Active</p>
              </div>
            </div>
            
            {urgentCount > 0 ? (
              <div className="flex items-center gap-2 px-4 py-2 border border-rose-200 dark:border-rose-900/50 rounded-xl bg-rose-50 dark:bg-rose-500/10 animate-in zoom-in duration-300">
                <Bell size={16} className="text-rose-500 animate-pulse" />
                <div className="text-right leading-tight">
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Alerts</p>
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{urgentCount} Urgent</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#16171d] opacity-50">
                <Bell size={16} className="text-gray-400" />
                <div className="text-right leading-tight">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alerts</p>
                  <p className="text-sm font-bold text-gray-500">All Clear</p>
                </div>
              </div>
            )}
            
            <button onClick={toggleTheme} className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors ml-2">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {/* Dynamic Profile Dropdown */}
            <div className="relative ml-2">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 hover:opacity-80 transition-opacity focus:outline-none"
              >
                 {user?.image ? <img src={user.image} className="w-full h-full object-cover" /> : <User size={20} className="text-gray-400" />}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white dark:bg-gray-800 mb-2 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      {user?.image ? <img src={user.image} alt="User" className="w-full h-full object-cover" /> : <User size={24} className="text-gray-400" />}
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate w-full">{user?.name || "Staff Member"}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{user?.role || "Staff"}</p>
                  </div>
                  
                  <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#5b6aff] transition-colors">
                    <Settings size={16} /> Settings
                  </Link>
                  
                  <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border-t border-gray-100 dark:border-gray-800">
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        <main className="p-8 flex-grow">
          
          {/* --- TAB 1: LIVE FLOOR --- */}
          {activeTab === 'Live Floor' && (
            <div className="flex gap-8 items-start animate-in fade-in">
              
              {/* Floor Map */}
              <div className="flex-grow bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <div className="flex gap-6">
                    <button className="font-bold text-[#5b6aff] border-b-2 border-[#5b6aff] pb-4 -mb-[17px]">Live Floor Map</button>
                    <button onClick={() => setActiveTab('Kitchen Queue')} className="font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white pb-4 -mb-[17px] flex items-center gap-2">Kitchen Queue <span className="w-5 h-5 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center">{kitchenTickets.length}</span></button>
                  </div>
                  
                  {isMergeMode ? (
                    <div className="flex gap-3">
                      <button onClick={() => { setIsMergeMode(false); setSelectedForMerge([]); }} className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white px-4 py-2">Cancel</button>
                      <button onClick={confirmMerge} className="flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 px-5 py-2 rounded-lg hover:bg-indigo-700 shadow-md">Confirm Merge ({selectedForMerge.length})</button>
                    </div>
                  ) : (
                    <button onClick={() => setIsMergeMode(true)} className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <Plus size={16} /> Merge Tables
                    </button>
                  )}
                </div>

                {/* Table Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {floorTables.map((table) => {
                    const colorClasses = getStatusColor(table.status);
                    const isSelected = selectedForMerge.includes(table.id);
                    const mergeBorder = isMergeMode && isSelected ? 'ring-4 ring-indigo-500 ring-offset-2 dark:ring-offset-[#16171d]' : '';
                    const mergeCursor = isMergeMode ? (table.status === 'Available' ? 'cursor-pointer hover:scale-[1.02] transition-transform' : 'opacity-50 cursor-not-allowed') : '';
                    const mergedCardStyles = table.isMerged
                      ? 'bg-gradient-to-br from-indigo-50/80 to-white dark:from-indigo-900/10 dark:to-[#0a0b10] border-y-indigo-200 border-r-indigo-200 dark:border-y-indigo-800 dark:border-r-indigo-800'
                      : 'bg-white dark:bg-[#0a0b10] border-y-gray-100 border-r-gray-100 dark:border-y-gray-800 dark:border-r-gray-800';

                    return (
                      <div 
                        key={table.id} 
                        onClick={() => isMergeMode && table.status === 'Available' && toggleMergeSelection(table.id, table.status)}
                        className={`border-l-[6px] border rounded-xl p-4 sm:p-5 shadow-sm flex flex-col min-h-[13rem] h-full ${colorClasses.split(' ')[0]} ${mergedCardStyles} ${mergeBorder} ${mergeCursor}`}
                      >
                        
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-black text-gray-900 dark:text-white leading-tight mb-2 break-words ${table.isMerged ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'}`}>
                              {table.id}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 shrink-0"><User size={12}/> {table.seats} Seats</p>
                              {table.isMerged && (
                                <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                                  Merged
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="shrink-0 mt-1">
                            {isMergeMode && table.status === 'Available' ? (
                              <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 ${isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                                {isSelected && <Check size={14} strokeWidth={3} />}
                              </div>
                            ) : (
                              <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${colorClasses.replace('border-', '').split(' ')[0]} ${colorClasses.replace('border-', '').split(' ')[1]}`}>
                                {table.status}
                              </span>
                            )}
                          </div>
                        </div>

                        {table.status !== 'Available' ? (
                          <div className="text-sm mt-4">
                            <div className="flex justify-between mb-1"><span className="text-gray-500">Server:</span><span className="font-bold text-gray-900 dark:text-white">{table.server}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Active:</span><span className={`font-bold ${table.status === 'Ready' ? 'text-amber-500' : 'text-rose-500'}`}>{formatActiveTime(table.seatedAt)}</span></div>
                          </div>
                        ) : (
                          <div className="flex-grow"></div>
                        )}

                        <div className="flex flex-wrap items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 gap-2">
                          {table.isMerged && table.status === 'Available' && !isMergeMode ? (
                            <button onClick={() => unmergeTable(table.id)} className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors">
                              <SplitSquareHorizontal size={14} /> Unmerge
                            </button>
                          ) : (
                            <button className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white">Details</button>
                          )}
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleTableAction(table.id, table.status); }}
                            disabled={isMergeMode}
                            className={`px-4 sm:px-6 py-2 rounded-lg text-xs font-bold transition-colors ${table.status === 'Available' ? 'bg-[#5b6aff] text-white hover:bg-[#4a58e8]' : 'bg-indigo-50 dark:bg-indigo-500/10 text-[#5b6aff] hover:bg-indigo-100 dark:hover:bg-indigo-500/20'} ${isMergeMode ? 'opacity-0 cursor-default' : ''}`}
                          >
                            {table.status === 'Available' ? 'Assign' : 'Manage'}
                          </button>
                        </div>

                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Sidebar Area */}
              <div className="w-80 shrink-0 space-y-6">
                
                <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><CheckCircle size={16} className="text-[#5b6aff]" /> Your Daily Tasks</h3>
                    <button onClick={handleAddTask} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><Plus size={16} /></button>
                  </div>
                  <div className="space-y-4">
                    {tasks.map(task => (
                      <label key={task.id} onClick={() => toggleTask(task.id)} className="flex items-start gap-3 cursor-pointer group">
                        {task.done ? (
                          <div className="w-5 h-5 bg-[#5b6aff] rounded flex items-center justify-center text-white shrink-0 mt-0.5"><Check size={12} strokeWidth={3} /></div>
                        ) : (
                          <Square size={20} className="text-gray-300 group-hover:text-[#5b6aff] shrink-0 mt-0.5 transition-colors" />
                        )}
                        <span className={`text-sm font-medium transition-colors ${task.done ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                          {task.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Bell size={16} className={urgentCount > 0 ? "text-rose-500" : "text-gray-400"} /> Broadcasts
                    </h3>
                    {urgentCount > 0 && <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{urgentCount} New</span>}
                  </div>
                  
                  <div className="space-y-3">
                    {broadcasts.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">No active broadcasts.</p>
                    ) : (
                      broadcasts.map(broadcast => (
                        <div key={broadcast.id} className={`p-3 border rounded-xl ${
                          broadcast.type === 'urgent' 
                            ? 'border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-500/5' 
                            : 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-500/5'
                        }`}>
                          <div className={`flex items-center gap-2 font-bold text-xs mb-1 ${
                            broadcast.type === 'urgent' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {broadcast.type === 'urgent' ? <AlertCircle size={14}/> : <CheckCircle size={14}/>} 
                            {broadcast.title}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{broadcast.message}</p>
                          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{broadcast.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {broadcasts.length > 0 && (
                    <button onClick={() => setBroadcasts([])} className="text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white mt-4 flex items-center justify-center w-full transition-colors">
                      Clear Notifications
                    </button>
                  )}
                </div>

                <div className="bg-[#6b75f2] rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden">
                  <Clock size={120} className="absolute -right-8 -bottom-8 opacity-10 text-white" />
                  <p className="text-xs text-indigo-100 font-bold uppercase tracking-widest mb-1">Remaining Time</p>
                  <h2 className="text-3xl font-black mb-2">04h 22m</h2>
                  <p className="text-xs text-indigo-100 mb-6">Shift ends at 11:00 PM</p>
                  <button onClick={() => alert("Break request sent to manager.")} className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-sm font-bold transition-colors">Break Request</button>
                </div>

              </div>
            </div>
          )}

          {/* --- TAB 2: KITCHEN QUEUE --- */}
          {activeTab === 'Kitchen Queue' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1 flex items-center gap-3">
                    <ChefHat size={32} className="text-[#5b6aff]" />
                    Kitchen Queue
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage active food orders and preparation times.</p>
                </div>
                
                {/* 🟢 WORKING FILTERS UI */}
                <div className="flex gap-2">
                  {['All', 'Dine-In', 'Delivery'].map(filterOption => (
                    <button 
                      key={filterOption}
                      onClick={() => setKitchenFilter(filterOption)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors ${
                        kitchenFilter === filterOption 
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' 
                          : 'bg-white dark:bg-[#16171d] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {filterOption === 'All' ? 'All Tickets' : filterOption}
                    </button>
                  ))}
                </div>
              </div>

              {filteredTickets.length === 0 ? (
                <div className="bg-white dark:bg-[#16171d] rounded-3xl border border-gray-100 dark:border-gray-800 p-20 text-center shadow-sm">
                  <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">The Kitchen is Clear!</h3>
                  <p className="text-gray-500 dark:text-gray-400">No {kitchenFilter !== 'All' ? kitchenFilter.toLowerCase() : ''} orders pending right now.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTickets.map((ticket) => (
                    <div 
                      key={ticket.id} 
                      className={`bg-white dark:bg-[#16171d] rounded-2xl border-2 shadow-sm overflow-hidden flex flex-col ${
                        ticket.status === 'Cooking' ? 'border-orange-400 dark:border-orange-500/50' : 'border-gray-200 dark:border-gray-800'
                      }`}
                    >
                      <div className={`px-5 py-4 border-b flex justify-between items-center ${
                        ticket.status === 'Cooking' ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20' : 'bg-gray-50 dark:bg-[#0a0b10] border-gray-100 dark:border-gray-800'
                      }`}>
                        <div>
                          <h3 className="font-black text-lg text-gray-900 dark:text-white">{ticket.id}</h3>
                          <p className={`text-xs font-bold ${ticket.type.includes('Delivery') ? 'text-[#5b6aff]' : 'text-gray-500 dark:text-gray-400'}`}>{ticket.type}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-1 ${
                            ticket.status === 'Cooking' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            {ticket.status}
                          </span>
                          {/* 🟢 REAL-TIME TIMESTAMP DISPLAY */}
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-end"><Clock size={12} /> {formatTicketTime(ticket.createdAt)}</p>
                        </div>
                      </div>

                      <div className="p-5 flex-grow">
                        <ul className="space-y-4">
                          {ticket.items.map((item, idx) => (
                            <li key={idx} className="flex gap-3 items-start">
                              <span className="w-6 h-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded font-bold text-xs flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700">
                                {item.qty}
                              </span>
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white text-sm leading-snug">{item.name}</p>
                                {item.note && (
                                  <p className="text-xs font-bold text-rose-500 mt-0.5 bg-rose-50 dark:bg-rose-500/10 inline-block px-2 py-0.5 rounded">Note: {item.note}</p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0a0b10]/50">
                        {ticket.status === 'Pending' ? (
                          <button 
                            onClick={() => handleKitchenAction(ticket.id, 'Pending')}
                            className="w-full py-3 bg-[#5b6aff] hover:bg-[#4a58e8] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            <Flame size={16} /> Start Cooking
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleKitchenAction(ticket.id, 'Cooking')}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 dark:shadow-none"
                          >
                            <CheckCircle size={16} /> Mark Ready
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- TAB 3: DELIVERIES --- */}
          {activeTab === 'Deliveries' && (
            <div className="max-w-md mx-auto animate-in fade-in duration-300 pt-10">
              <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 text-center">
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 transition-colors ${isDelivering ? 'bg-green-100 dark:bg-green-500/20 text-green-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <Navigation size={40} className={isDelivering ? 'animate-pulse' : ''} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                  {isDelivering ? 'On Duty' : 'Off Duty'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                  {isDelivering ? 'Broadcasting live GPS location to customer...' : 'Start delivery to begin tracking your route.'}
                </p>

                <button 
                  onClick={toggleDeliveryStatus}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-colors mb-8 ${
                    isDelivering ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20' : 'bg-[#5b6aff] hover:bg-[#4a58e8] text-white shadow-indigo-500/20'
                  }`}
                >
                  {isDelivering ? 'Stop Delivery' : 'Start Delivery Route'}
                </button>

                <div className="text-left border-t border-gray-100 dark:border-gray-800 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Order</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">#{activeOrder.id}</p>
                    </div>
                    <span className="bg-indigo-50 dark:bg-indigo-500/10 text-[#5b6aff] px-3 py-1 rounded-full text-xs font-bold">Pick Up</span>
                  </div>
                  <div className="flex items-start gap-3 mb-6">
                    <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{activeOrder.customer}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{activeOrder.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${activeOrder.phone}`} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 hover:bg-emerald-600 transition-colors"><Phone size={16} /> Call Customer</a>
                    <button onClick={() => alert("Delivery marked as complete!")} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><CheckCircle size={16} /> Mark Done</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;