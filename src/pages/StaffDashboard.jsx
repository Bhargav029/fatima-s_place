import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Navigation, Phone, CheckCircle, Palmtree, LogOut, Sun, Moon,UtensilsCrossed,ChevronRight,
  LayoutGrid, Clock, Truck, Plus, Bell, CheckSquare, Square, AlertCircle, Check, User, ChefHat, Flame
} from 'lucide-react';
import { io } from 'socket.io-client';

const StaffDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Live Floor');

  // --- DELIVERY STATE ---
  const [isDelivering, setIsDelivering] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [socket, setSocket] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const activeOrder = {
    id: "F-92841", customer: "John Doe", address: "Villa 4, Sunset Blvd, Vagator", phone: "+91 98765 43210",
  };

  useEffect(() => {
    const newSocket = io('http://localhost:4000'); 
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

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
        (position) => {
          const newLocation = [position.coords.latitude, position.coords.longitude];
          setCurrentLocation(newLocation);
          if (socket) socket.emit('driverLocationUpdate', newLocation);
        },
        (error) => {
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

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'staff' && user?.role !== 'admin') return <Navigate to="/" replace />;

  // --- LIVE FLOOR STATE ---
  const [floorTables, setFloorTables] = useState([
    { id: 'T-01', seats: 2, status: 'Available' },
    { id: 'T-02', seats: 4, status: 'Seated', server: 'Rohan', activeTime: '12m' },
    { id: 'T-03', seats: 4, status: 'Cooking', server: 'Sneha', activeTime: '34m' },
    { id: 'T-04', seats: 6, status: 'Seated', server: 'Rohan', activeTime: '05m' },
    { id: 'T-05', seats: 2, status: 'Ready', server: 'Sneha', activeTime: '45m' },
    { id: 'T-06', seats: 8, status: 'Available' },
    { id: 'T-07', seats: 4, status: 'Cooking', server: 'John', activeTime: '22m' },
    { id: 'T-08', seats: 4, status: 'Available' },
    { id: 'T-09', seats: 2, status: 'Seated', server: 'Sneha', activeTime: '18m' },
  ]);

  const handleTableAction = (tableId, currentStatus) => {
    setFloorTables(prev => prev.map(t => {
      if (t.id === tableId) {
        if (currentStatus === 'Available') return { ...t, status: 'Seated', server: user?.name?.split(' ')[0] || 'Staff', activeTime: '0m' };
        if (currentStatus === 'Seated') return { ...t, status: 'Cooking' };
        if (currentStatus === 'Cooking') return { ...t, status: 'Ready' };
        if (currentStatus === 'Ready') return { ...t, status: 'Available', server: undefined, activeTime: undefined };
      }
      return t;
    }));
  };

  // --- DAILY TASKS STATE ---
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Check sanitization logs', done: true },
    { id: 2, text: 'Refill napkins at T1-T10', done: false },
    { id: 3, text: 'Birthday cake at 8:30 PM (T4)', done: false },
    { id: 4, text: 'Restock Goan Feni at Bar', done: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTask = () => {
    const newTask = window.prompt("Enter a new task for your shift:");
    if (newTask) setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
  };

  // --- KITCHEN QUEUE STATE ---
  const [kitchenTickets, setKitchenTickets] = useState([
    { 
      id: 'K-892', type: 'Dine-In (T-03)', time: '14m ago', status: 'Cooking', 
      items: [{ qty: 2, name: 'Prawn Balchão', note: 'Extra Spicy' }, { qty: 1, name: 'Fish Thali', note: '' }] 
    },
    { 
      id: 'K-893', type: 'Delivery', time: '4m ago', status: 'Pending', 
      items: [{ qty: 1, name: 'Chicken Xacuti', note: '' }, { qty: 3, name: 'Poee (Goan Bread)', note: 'Warm' }] 
    },
    { 
      id: 'K-894', type: 'Dine-In (T-07)', time: '1m ago', status: 'Pending', 
      items: [{ qty: 2, name: 'Bebinca', note: '' }, { qty: 2, name: 'Goan Feni Cocktail', note: 'Prepare at Bar' }] 
    }
  ]);

  const handleKitchenAction = (ticketId, currentStatus) => {
    if (currentStatus === 'Pending') {
      setKitchenTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'Cooking' } : t));
    } else if (currentStatus === 'Cooking') {
      // If marked ready, remove it from the board (or move to a "Done" list)
      setKitchenTickets(prev => prev.filter(t => t.id !== ticketId));
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
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 text-white bg-[#5b6aff] rounded-full"><Palmtree size={18} /></div>
            <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Fatima's</span>
          </Link>
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
            <div className="flex items-center gap-2 px-4 py-2 border border-rose-200 dark:border-rose-900/50 rounded-xl bg-rose-50 dark:bg-rose-500/10">
              <Bell size={16} className="text-rose-500" />
              <div className="text-right leading-tight">
                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Alerts</p>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">2 Urgent</p>
              </div>
            </div>
            
            <button onClick={toggleTheme} className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors ml-2">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
               {user?.image ? <img src={user.image} className="w-full h-full object-cover" /> : <User size={20} className="text-gray-400" />}
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
                  <button onClick={() => alert("Select tables to merge on the floor map.")} className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"><Plus size={16} /> Merge Tables</button>
                </div>

                {/* Table Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {floorTables.map((table) => {
                    const colorClasses = getStatusColor(table.status);
                    return (
                      <div key={table.id} className={`border-l-[6px] border border-y-gray-100 border-r-gray-100 dark:border-y-gray-800 dark:border-r-gray-800 rounded-xl p-5 bg-white dark:bg-[#0a0b10] shadow-sm flex flex-col justify-between h-48 ${colorClasses.split(' ')[0]}`}>
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">{table.id}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><User size={12}/> {table.seats} Seats</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${colorClasses.replace('border-', '').split(' ')[0]} ${colorClasses.replace('border-', '').split(' ')[1]}`}>{table.status}</span>
                        </div>

                        {table.status !== 'Available' ? (
                          <div className="text-sm">
                            <div className="flex justify-between mb-1"><span className="text-gray-500">Server:</span><span className="font-bold text-gray-900 dark:text-white">{table.server}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Active:</span><span className={`font-bold ${table.status === 'Ready' ? 'text-amber-500' : 'text-rose-500'}`}>{table.activeTime}</span></div>
                          </div>
                        ) : (
                          <div className="flex-grow"></div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <button onClick={() => alert(`Opening details for Table ${table.id}`)} className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white">Details</button>
                          
                          <button 
                            onClick={() => handleTableAction(table.id, table.status)}
                            className={`px-6 py-2 rounded-lg text-xs font-bold transition-colors ${table.status === 'Available' ? 'bg-[#5b6aff] text-white hover:bg-[#4a58e8]' : 'bg-indigo-50 dark:bg-indigo-500/10 text-[#5b6aff] hover:bg-indigo-100 dark:hover:bg-indigo-500/20'}`}
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
                
                {/* Daily Tasks */}
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

                {/* Broadcasts */}
                <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4"><Bell size={16} className="text-rose-500" /> Broadcasts</h3>
                  <div className="space-y-3">
                    <div className="p-3 border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-500/5 rounded-xl">
                      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs mb-1"><AlertCircle size={14}/> Out of Stock</div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">Serradura is unavailable for the rest of the shift.</p>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">10m ago</p>
                    </div>
                    <div className="p-3 border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-xl">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-1"><CheckCircle size={14}/> Shift Swap Approved</div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">Your Thursday morning shift is now covered by Alisha.</p>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">1h ago</p>
                    </div>
                  </div>
                  <button onClick={() => alert("Opening notification center...")} className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white mt-4 flex items-center justify-between w-full">View All Notifications <ChevronRight size={14}/></button>
                </div>

                {/* Shift Info */}
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
                    Kitchen Display System
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage active food orders and preparation times.</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-bold shadow-sm">All Tickets</button>
                  <button className="px-4 py-2 bg-white dark:bg-[#16171d] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Dine-In</button>
                  <button className="px-4 py-2 bg-white dark:bg-[#16171d] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Delivery</button>
                </div>
              </div>

              {kitchenTickets.length === 0 ? (
                <div className="bg-white dark:bg-[#16171d] rounded-3xl border border-gray-100 dark:border-gray-800 p-20 text-center shadow-sm">
                  <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">The Kitchen is Clear!</h3>
                  <p className="text-gray-500 dark:text-gray-400">All current orders have been prepared and served.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kitchenTickets.map((ticket) => (
                    <div 
                      key={ticket.id} 
                      className={`bg-white dark:bg-[#16171d] rounded-2xl border-2 shadow-sm overflow-hidden flex flex-col ${
                        ticket.status === 'Cooking' ? 'border-orange-400 dark:border-orange-500/50' : 'border-gray-200 dark:border-gray-800'
                      }`}
                    >
                      {/* Ticket Header */}
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
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-end"><Clock size={12} /> {ticket.time}</p>
                        </div>
                      </div>

                      {/* Ticket Body (Items) */}
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

                      {/* Ticket Actions */}
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

          {/* --- TAB 3: DELIVERIES (The Old Driver Dashboard logic) --- */}
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