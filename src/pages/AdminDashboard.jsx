import React, { useState, useEffect } from 'react';
import { 
  Palmtree, LayoutDashboard, ShoppingBag, UtensilsCrossed, Calendar, 
  Settings, LogOut, Download, PlusCircle, Target, TrendingUp, Users, Truck, AlertCircle, 
  Sun, Moon, Bell, Shield, ChevronRight, Search, Filter, MoreVertical, Trash2, Edit3, X, User, ImagePlus 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';

const initialMenuData = [
  { id: 1, name: "Porridge (Milk/Honey)", price: 130, category: "Breakfast", desc: "Healthy warm oats served with milk and honey." },
  { id: 2, name: "Muesli (Milk/Curd)", price: 200, category: "Breakfast", desc: "Mixed grains, nuts, and fruits with milk or curd." },
  { id: 11, name: "Goan Sausages and Chips", price: 250, category: "Goan", desc: "Famous spicy Goan pork sausages with fries." },
  { id: 12, name: "Prawn/Fish Curry", price: 320, category: "Goan", desc: "Traditional coconut-based Goan seafood gravy." },
  { id: 21, name: "Dal Makhani", price: 250, category: "Indian", desc: "Black lentils slow-cooked with cream and butter." },
  { id: 41, name: "Sea Food Mix Plate", price: 900, category: "Continental", desc: "Premium mix of fried and grilled coastal seafood." },
];

const AdminDashboard = () => {
  const { user, login, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeContent, setActiveContent] = useState('Overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [adminProfile, setAdminProfile] = useState({
    name: user?.name || 'Fatima Admin',
    email: user?.email || 'admin@fatimasplace.com',
    phone: user?.phone || '+91 98765 43210',
    image: user?.image || null
  });

  useEffect(() => {
    if (user) {
      setAdminProfile(prev => ({ ...prev, name: user.name, email: user.email, image: user.image || null }));
    }
  }, [user]);

  const handleAdminImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        alert("File is too large. Please upload an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminProfile(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    login({ ...user, name: adminProfile.name, email: adminProfile.email, phone: adminProfile.phone, image: adminProfile.image, role: 'admin' });
    alert("Admin profile updated successfully!");
  };

  const dashboardStats = [
    { icon: <TrendingUp size={20} className="text-[#6b75f2]" />, label: "Total Revenue", value: "₹2,45,800", change: "+12.5%", changeColor: "text-green-500 bg-green-50 dark:bg-green-500/10" },
    { icon: <ShoppingBag size={20} className="text-orange-500" />, label: "Daily Orders", value: "84", change: "+8%", changeColor: "text-green-500 bg-green-50 dark:bg-green-500/10" },
    { icon: <UtensilsCrossed size={20} className="text-emerald-500" />, label: "Table Occupancy", value: "78%", change: "+3.2%", changeColor: "text-green-500 bg-green-50 dark:bg-green-500/10" },
    { icon: <Truck size={20} className="text-rose-500" />, label: "Active Deliveries", value: "12", change: "-2", changeColor: "text-rose-500 bg-rose-50 dark:bg-rose-500/10" }
  ];

  const popularDishes = [
    { name: "Prawn Balchão", volume: 120, height: "80%" },
    { name: "Fish Thali", volume: 95, height: "65%" },
    { name: "Bebinca", volume: 80, height: "55%" },
    { name: "Goan Curry", volume: 68, height: "45%" },
    { name: "Chicken Cafreal", volume: 60, height: "40%" }
  ];

  // --- NEW: Empty Realistic Fleet States ---
  const [deliveryFleet, setDeliveryFleet] = useState([]);
  const [availableAgents, setAvailableAgents] = useState([]);

  const [orders, setOrders] = useState([
    { id: 'ORD-9821', customer: 'Rahul Sharma', items: '3 items', status: 'Preparing', amount: '₹1250', agent: 'Assign Courier' },
    { id: 'ORD-9822', customer: 'Anjali Gupta', items: '1 items', status: 'Ready', amount: '₹450', agent: 'Assign Courier' },
    { id: 'ORD-9823', customer: 'Vikram Singh', items: '5 items', status: 'Ready', amount: '₹2100', agent: 'Assign Courier' },
    { id: 'ORD-9824', customer: 'Sneha Patil', items: '2 items', status: 'Delivered', amount: '₹890', agent: 'Assign Courier' },
    { id: 'ORD-9825', customer: 'David Miller', items: '4 items', status: 'Pending', amount: '₹1560', agent: 'Assign Courier' },
  ]);

  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [activeActionDropdown, setActiveActionDropdown] = useState(null);
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [selectedOrderIdForAgent, setSelectedOrderIdForAgent] = useState(null);
  
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentImage, setNewAgentImage] = useState(null);

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(orderSearchQuery.toLowerCase())
  );

  const handleAgentImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewAgentImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewAgent = (e) => {
    e.preventDefault();
    if(newAgentName.trim() !== '') {
      const newAgent = {
        id: Date.now(),
        name: newAgentName.trim(),
        image: newAgentImage || null
      };
      setAvailableAgents([...availableAgents, newAgent]);
      
      // NEW: Add agent to the live fleet dashboard view
      setDeliveryFleet([...deliveryFleet, { 
        name: newAgent.name, id: `D-${Math.floor(Math.random()*1000)}`, status: "Idle", statusColor: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300", time: "-", image: newAgent.image
      }]);

      setNewAgentName(''); 
      setNewAgentImage(null); 
    }
  };

  const handleAssignAgent = (agentName) => {
    setOrders(orders.map(o => o.id === selectedOrderIdForAgent ? { ...o, agent: agentName } : o));
    
    // NEW: Update agent status to In Transit in the fleet view
    setDeliveryFleet(deliveryFleet.map(agent => agent.name === agentName ? { ...agent, status: 'In Transit', statusColor: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300', time: 'Active' } : agent));
    
    setAgentModalOpen(false);
  };

  const handleRemoveAgent = () => {
    setOrders(orders.map(o => o.id === selectedOrderIdForAgent ? { ...o, agent: 'Assign Courier' } : o));
    setAgentModalOpen(false);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setActiveActionDropdown(null);
  };

  const handleDeleteOrder = (orderId) => {
    if(window.confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter(o => o.id !== orderId));
    }
    setActiveActionDropdown(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Preparing': return 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400';
      case 'Out for Delivery': return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Ready': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
      case 'Delivered': return 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const [menuItems, setMenuItems] = useState(initialMenuData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Goan', price: '', desc: '' });

  const handleEditClick = (item) => {
    setFormData({ name: item.name, category: item.category, price: item.price, desc: item.desc });
    setEditingId(item.id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleSaveDish = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    if (isEditing) {
      setMenuItems(menuItems.map(item => item.id === editingId ? { ...item, ...formData, price: parseInt(formData.price) } : item));
    } else {
      setMenuItems([{ id: Date.now(), ...formData, price: parseInt(formData.price) }, ...menuItems]);
    }
    setFormData({ name: '', category: 'Goan', price: '', desc: '' });
    setShowAddForm(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDeleteDish = (id) => {
    if(window.confirm("Delete this dish?")) setMenuItems(menuItems.filter(item => item.id !== id));
  };


  // ==========================================
  // --- NEW: INTERACTIVE RESERVATION STATE ---
  // ==========================================
  const [reservations, setReservations] = useState([
    { id: 'RES-01', name: 'Alia Bhatt', date: 'Today', time: '19:30', guests: 4, status: 'Confirmed', table: 'T-04' },
    { id: 'RES-02', name: 'Virat Kohli', date: 'Today', time: '20:00', guests: 2, status: 'Arrived', table: 'T-12' },
    { id: 'RES-03', name: 'Ratan Tata', date: 'Tomorrow', time: '13:00', guests: 6, status: 'Pending', table: 'Unassigned' },
  ]);

  const handleUpdateReservationStatus = (id, newStatus) => {
    setReservations(prev => prev.map(res => res.id === id ? { ...res, status: newStatus } : res));
  };

  const handleUpdateReservationTable = (id, newTable) => {
    setReservations(prev => prev.map(res => res.id === id ? { ...res, table: newTable } : res));
  };

  const handleDeleteReservation = (id) => {
    if(window.confirm("Are you sure you want to delete this reservation?")) {
      setReservations(prev => prev.filter(res => res.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0a0b10] flex transition-colors duration-300">
      
      {agentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white">Assign Delivery Agent</h3>
                <button onClick={() => setAgentModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"><X size={20}/></button>
              </div>
              
              <div className="space-y-2 mb-6 max-h-48 overflow-y-auto custom-scrollbar">
                 {/* NEW: Empty State Handled here */}
                 {availableAgents.length === 0 ? (
                   <p className="text-center text-sm text-gray-400 py-4">No staff online. Add a new agent below.</p>
                 ) : (
                   availableAgents.map(agent => (
                     <button 
                       key={agent.id} 
                       onClick={() => handleAssignAgent(agent.name)} 
                       className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-700 dark:text-gray-300 hover:text-[#6b75f2] font-bold transition-colors flex items-center gap-3"
                     >
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                          {agent.image ? (
                            <img src={agent.image} alt={agent.name} className="w-full h-full object-cover"/>
                          ) : (
                            <User size={14} className="text-gray-400" />
                          )}
                        </div>
                        {agent.name}
                     </button>
                   ))
                 )}
              </div>

              <form onSubmit={handleAddNewAgent} className="mb-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <label className="w-10 h-10 rounded-full border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 overflow-hidden shrink-0 transition-colors">
                     {newAgentImage ? <img src={newAgentImage} className="w-full h-full object-cover" /> : <ImagePlus size={16} className="text-gray-400" />}
                     <input type="file" accept="image/*" className="hidden" onChange={handleAgentImageUpload} />
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    placeholder="New agent name..."
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6b75f2] dark:text-white"
                  />
                  <button type="submit" className="bg-[#5b6aff] hover:bg-[#4a58e8] transition-colors text-white px-3 py-2 rounded-lg text-sm font-bold">Add</button>
                </div>
              </form>

              <button onClick={handleRemoveAgent} className="w-full py-3.5 text-sm text-rose-500 font-bold bg-rose-50 dark:bg-rose-500/10 rounded-xl hover:opacity-80 transition-colors">
                Remove Current Agent
              </button>
           </div>
        </div>
      )}

      <aside className="w-64 shrink-0 bg-white dark:bg-[#16171d] border-r border-gray-100 dark:border-gray-800 p-6 flex flex-col transition-colors duration-300 fixed inset-y-0 z-50">
        <Link to="/" className="flex items-center gap-3 mb-12">
          <div className="flex items-center justify-center w-[38px] h-[38px] text-white bg-[#5b6aff] rounded-full">
            <Palmtree size={20} strokeWidth={2.5} />
          </div>
          <span className="text-[22px] font-extrabold text-[#2d333f] dark:text-white tracking-tight">Fatima's</span>
        </Link>
        
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-4 ml-2">NAVIGATION</p>
        <div className="space-y-2 flex-grow">
          {[
            { id: 'Overview', icon: LayoutDashboard },
            { id: 'Orders', icon: ShoppingBag },
            { id: 'Menu Management', icon: UtensilsCrossed },
            { id: 'Reservations', icon: Calendar },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveContent(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeContent === item.id ? 'bg-[#5b6aff] text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-800'}`}>
              <item.icon size={18} /> {item.id}
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-4 ml-2">SETTINGS</p>
          {[
            { id: 'Profile', icon: User },
            { id: 'Appearance', icon: isDarkMode ? Moon : Sun },
            { id: 'Security', icon: Shield }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveContent(tab.id)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeContent === tab.id ? 'bg-[#5b6aff] text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900'}`}>
              <div className="flex items-center gap-3"> <tab.icon size={18} /> {tab.id} </div>
              <ChevronRight size={16} className={activeContent === tab.id ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-[#f8f9fb]/90 dark:bg-[#0a0b10]/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-6 flex items-center justify-between transition-colors duration-300">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{activeContent}</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center p-0.5 border-2 border-indigo-100 dark:border-gray-800 shrink-0 overflow-hidden shadow-sm">
              {user?.image || adminProfile.image ? (
                <img src={user?.image || adminProfile.image} alt="Admin" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User size={20} className="text-gray-400" />
              )}
            </div>
            <div className='flex flex-col'>
              <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user?.name || "Fatima Admin"}</span>
              <span className="text-xs text-[#6b75f2] font-semibold uppercase tracking-widest">Administrator</span>
            </div>
          </div>
        </header>

        <main className="p-8 lg:p-10 flex-grow animate-in fade-in duration-300">
          
          {activeContent === 'Overview' && (
            <div className="space-y-10 animate-in fade-in">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Monitor Performance</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">System-wide data for all Fatima's Place platforms.</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#16171d] font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
                    <Download size={16} /> Export Data
                  </button>
                  <button onClick={() => setActiveContent('Reservations')} className="px-6 py-2.5 rounded-lg bg-[#5b6aff] font-bold text-sm text-white shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-[#4a58e8] transition-colors flex items-center gap-2">
                    <PlusCircle size={16} /> New Reservation
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {dashboardStats.map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-[32px] p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-5">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-gray-900 flex items-center justify-center border border-indigo-100 dark:border-gray-800"> {stat.icon} </div>
                      <span className={`${stat.changeColor} text-[10px] font-bold px-3 py-1 rounded-full uppercase`}>{stat.change}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1.5">{stat.label}</p>
                    <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Popular Dishes this Week</h2>
                    <p className="text-sm font-bold text-gray-500 flex items-center gap-1.5"><TrendingUp size={16} /> Based on order volume</p>
                  </div>
                  <div className="flex items-end gap-5 h-56 border-b border-dashed border-gray-200 dark:border-gray-800 pb-3">
                    {popularDishes.map(dish => (
                      <div key={dish.name} className="flex-1 flex flex-col items-center">
                        <div style={{ height: dish.height }} className="w-16 bg-[#5b6aff] rounded-xl hover:bg-[#4a58e8] transition-all cursor-pointer shadow-md mb-2" title={`${dish.name}: ${dish.volume} orders`}></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-5 pt-3">
                    {popularDishes.map(dish => (
                      <p key={dish.name} className="flex-1 text-[10px] font-medium text-gray-500 dark:text-gray-600 text-center uppercase tracking-wider">{dish.name}</p>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 shadow-sm flex flex-col">
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1.5">Live Staff Fleet</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">Assigned riders and staff on duty</p>
                  
                  <div className="space-y-5 flex-grow mb-6">
                    {/* NEW: Empty state for overview fleet handled here */}
                    {deliveryFleet.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm py-10 flex flex-col items-center">
                        <Users size={32} className="mb-2 opacity-50" />
                        <p>No staff online.<br/>Assign staff from the Orders tab.</p>
                      </div>
                    ) : (
                      deliveryFleet.map(agent => (
                        <div key={agent.id} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-indigo-100 dark:border-gray-800 shrink-0 overflow-hidden">
                              {agent.image ? <img src={agent.image} className="w-full h-full object-cover" /> : <User size={16} className="text-gray-400" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight">{agent.name}</p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono tracking-widest">{agent.id}</p>
                            </div>
                          </div>
                          <div className='flex flex-col items-end'>
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-lg uppercase ${agent.statusColor}`}>{agent.status}</span>
                            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-600 mt-1">{agent.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Link to="/track-order" className="w-full flex justify-center text-xs font-bold text-[#5b6aff] hover:underline pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">Open Live Map</Link>
                </div>
              </div>
            </div>
          )}

          {activeContent === 'Orders' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm overflow-visible">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="text" 
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        placeholder="Search orders or names..." 
                        className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-[#6b75f2] dark:text-white w-64 transition-all" 
                      />
                    </div>
                    <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors">
                      <Filter size={18} />
                    </button>
                  </div>
                </div>

                <div className="overflow-visible min-h-[300px]">
                  <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 dark:text-gray-400 bg-white dark:bg-[#16171d] border-b border-gray-100 dark:border-gray-800">
                      <tr>
                        <th className="py-4 px-6 font-semibold">Order ID</th>
                        <th className="py-4 px-6 font-semibold">Customer</th>
                        <th className="py-4 px-6 font-semibold">Total Items</th>
                        <th className="py-4 px-6 font-semibold">Status</th>
                        <th className="py-4 px-6 font-semibold">Total Amt</th>
                        <th className="py-4 px-6 font-semibold">Delivery Agent</th>
                        <th className="py-4 px-6 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                      {filteredOrders.length === 0 && (
                        <tr><td colSpan="7" className="text-center py-10 text-gray-400">No orders match your search.</td></tr>
                      )}
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">{order.id}</td>
                          <td className="py-4 px-6 font-bold text-gray-700 dark:text-gray-300">{order.customer}</td>
                          <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{order.items}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${getStatusStyle(order.status)}`}>{order.status}</span>
                          </td>
                          <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">{order.amount}</td>
                          
                          <td className="py-4 px-6">
                            <button 
                              onClick={() => { setSelectedOrderIdForAgent(order.id); setAgentModalOpen(true); }}
                              className={order.agent === 'Assign Courier' 
                                ? "text-[11px] font-bold text-[#6b75f2] border border-[#6b75f2] border-dashed rounded px-3 py-1 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer" 
                                : "text-gray-700 dark:text-gray-300 font-bold hover:text-[#6b75f2] dark:hover:text-[#6b75f2] underline decoration-dashed underline-offset-4 cursor-pointer transition-colors"
                              }
                            >
                              {order.agent}
                            </button>
                          </td>
                          
                          <td className="py-4 px-6 text-center relative">
                            <button 
                              onClick={() => setActiveActionDropdown(activeActionDropdown === order.id ? null : order.id)}
                              className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {activeActionDropdown === order.id && (
                              <div className="absolute right-12 top-8 bg-white dark:bg-[#1e1f26] border border-gray-100 dark:border-gray-800 shadow-xl rounded-xl w-40 z-50 flex flex-col py-2 text-sm overflow-hidden animate-in zoom-in-95">
                                <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 mb-1">Update Status</div>
                                <button onClick={() => handleUpdateOrderStatus(order.id, 'Preparing')} className="text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">Preparing</button>
                                <button onClick={() => handleUpdateOrderStatus(order.id, 'Out for Delivery')} className="text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">Out for Delivery</button>
                                <button onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')} className="text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">Delivered</button>
                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                                <button onClick={() => handleDeleteOrder(order.id)} className="text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 font-bold">Delete Order</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#16171d]">
                  <span>Showing {filteredOrders.length} of {orders.length} records</span>
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">Previous</button>
                    <button className="px-4 py-1.5 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold text-gray-900 dark:text-white">Next</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeContent === 'Menu Management' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Menu Items</h2>
                <button 
                  onClick={() => { setFormData({ name: '', category: 'Goan', price: '', desc: '' }); setIsEditing(false); setShowAddForm(!showAddForm); }}
                  className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2 ${showAddForm ? 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : 'bg-[#5b6aff] text-white hover:bg-[#4a58e8]'}`}
                >
                  {showAddForm ? <><X size={16}/> Cancel</> : <><PlusCircle size={16}/> Add New Dish</>}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleSaveDish} className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm mb-6 flex flex-wrap items-end gap-4 animate-in fade-in zoom-in-95">
                  <div className="flex-1 min-w-[200px] space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Dish Name</label>
                    <input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6b75f2] dark:text-white" />
                  </div>
                  <div className="w-32 space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Category</label>
                    <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none dark:text-white">
                      <option>Goan</option><option>Indian</option><option>Snacks</option><option>Breakfast</option><option>Continental</option>
                    </select>
                  </div>
                  <div className="w-24 space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Price (₹)</label>
                    <input type="number" required value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6b75f2] dark:text-white" />
                  </div>
                  <button type="submit" className="bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-600 transition-colors h-[38px] w-full md:w-auto">
                    {isEditing ? 'Update Dish' : 'Save Dish'}
                  </button>
                </form>
              )}

              <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                    <tr><th className="py-4 px-6 font-semibold">Dish Details</th><th className="py-4 px-6 font-semibold">Category</th><th className="py-4 px-6 font-semibold">Price</th><th className="py-4 px-6 font-semibold text-center">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {menuItems.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900 dark:text-white flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                            <img src={`/assets/${item.id}.png`} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100"; }} />
                          </div>
                          <p className="font-bold text-sm text-gray-900 dark:text-white">{item.name}</p>
                        </td>
                        <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{item.category}</td>
                        <td className="py-4 px-6 font-bold text-emerald-600">₹{item.price}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => handleEditClick(item)} className="p-2 text-gray-400 hover:text-[#6b75f2] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded transition-colors"><Edit3 size={16} /></button>
                            <button onClick={() => handleDeleteDish(item.id)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

           {/* ======================================= */}
           {/* --- UPDATED: INTERACTIVE RESERVATIONS --- */}
           {/* ======================================= */}
           {activeContent === 'Reservations' && (
             <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
               <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Table Reservations</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Manage upcoming bookings, assign tables, and update statuses.</p>
                </div>
               <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden pb-10">
                 <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                      <tr>
                        <th className="py-4 px-6 font-semibold">Guest Name</th>
                        <th className="py-4 px-6 font-semibold">Date & Time</th>
                        <th className="py-4 px-6 font-semibold">Party Size</th>
                        <th className="py-4 px-6 font-semibold">Table Assignment</th>
                        <th className="py-4 px-6 font-semibold">Live Status</th>
                        <th className="py-4 px-6 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                      {reservations.length === 0 && (
                        <tr><td colSpan="6" className="text-center py-10 text-gray-400">No upcoming reservations.</td></tr>
                      )}
                      {reservations.map((res) => (
                        <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">{res.name}</td>
                          <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                            <span className="font-bold text-gray-700 dark:text-gray-300 mr-2">{res.date}</span> {res.time}
                          </td>
                          <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{res.guests} Guests</td>
                          
                          {/* EDITABLE TABLE FIELD */}
                          <td className="py-4 px-6">
                            <input 
                              type="text" 
                              value={res.table}
                              onChange={(e) => handleUpdateReservationTable(res.id, e.target.value)}
                              placeholder="e.g. T-04"
                              className="bg-transparent border-b border-dashed border-gray-300 dark:border-gray-600 focus:border-[#6b75f2] dark:focus:border-[#6b75f2] outline-none w-24 font-bold text-gray-900 dark:text-white py-1 transition-colors hover:border-gray-400 dark:hover:border-gray-500"
                            />
                          </td>
                          
                          {/* EDITABLE STATUS DROPDOWN */}
                          <td className="py-4 px-6">
                            <div className="relative inline-block">
                              <select 
                                value={res.status}
                                onChange={(e) => handleUpdateReservationStatus(res.id, e.target.value)}
                                className={`appearance-none px-4 py-1.5 pr-8 text-[11px] font-bold rounded-full outline-none cursor-pointer transition-colors ${
                                  res.status === 'Confirmed' ? 'bg-blue-100 text-blue-600 border border-blue-200 dark:border-transparent dark:bg-blue-500/20 dark:text-blue-400' :
                                  res.status === 'Arrived' ? 'bg-green-100 text-green-600 border border-green-200 dark:border-transparent dark:bg-green-500/20 dark:text-green-400' :
                                  res.status === 'Cancelled' ? 'bg-rose-100 text-rose-600 border border-rose-200 dark:border-transparent dark:bg-rose-500/20 dark:text-rose-400' :
                                  'bg-orange-100 text-orange-600 border border-orange-200 dark:border-transparent dark:bg-orange-500/20 dark:text-orange-400'
                                }`}
                              >
                                <option value="Pending" className="text-gray-900 bg-white dark:bg-gray-800 dark:text-white">Pending</option>
                                <option value="Confirmed" className="text-gray-900 bg-white dark:bg-gray-800 dark:text-white">Confirmed</option>
                                <option value="Arrived" className="text-gray-900 bg-white dark:bg-gray-800 dark:text-white">Arrived</option>
                                <option value="Cancelled" className="text-gray-900 bg-white dark:bg-gray-800 dark:text-white">Cancelled</option>
                              </select>
                              {/* Custom dropdown arrow to fit the style */}
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-60">
                                <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                          </td>

                          {/* ACTION: DELETE */}
                          <td className="py-4 px-6 text-center">
                            <button 
                              onClick={() => handleDeleteReservation(res.id)} 
                              title="Delete Reservation"
                              className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
             </div>
           )}

          {(activeContent === 'Profile' || activeContent === 'Appearance' || activeContent === 'Security') && (
            <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-[32px] p-10 shadow-sm transition-colors duration-300">
              
              {activeContent === 'Profile' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div> 
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Admin Profile</h2> 
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your administrative account details and photo.</p> 
                  </div>
                  <form onSubmit={handleProfileSave} className="space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4 border-white dark:border-[#16171d] shadow-md overflow-hidden shrink-0">
                        {adminProfile.image ? (
                          <img src={adminProfile.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User size={48} className="text-gray-300 dark:text-gray-600" />
                        )}
                      </div>
                      <div>
                        <label className="inline-block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                          Change Photo
                          <input type="file" accept="image/*" className="hidden" onChange={handleAdminImageUpload} />
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Full Name</label>
                        <input type="text" required value={adminProfile.name} onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-[#6b75f2] outline-none dark:text-white transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Email Address</label>
                        <input type="email" required value={adminProfile.email} onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-[#6b75f2] outline-none dark:text-white transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Phone Number</label>
                        <input type="tel" required value={adminProfile.phone} onChange={(e) => setAdminProfile({...adminProfile, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-[#6b75f2] outline-none dark:text-white transition-colors" />
                      </div>
                    </div>
                    <div className="pt-4 flex justify-end border-t border-gray-100 dark:border-gray-800">
                      <button type="submit" className="bg-[#6b75f2] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4a58e8] transition-colors flex items-center gap-2 text-sm shadow-lg shadow-indigo-100 dark:shadow-none mt-4">
                        Save Profile Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeContent === 'Appearance' && (
                <div className="space-y-6">
                  <div> <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Theme Preferences</h2> <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Force the dashboard into Light or Dark mode.</p> </div>
                  <div className="flex items-center justify-between p-5 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-[#1e1f26]">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}> {isDarkMode ? <Moon size={24} /> : <Sun size={24} />} </div>
                      <div> <h4 className="font-bold text-gray-900 dark:text-white text-sm">Dark Mode</h4> <p className="text-xs text-gray-500 dark:text-gray-400">Reduce eye strain and save battery.</p> </div>
                    </div>
                    <button onClick={toggleTheme} className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${isDarkMode ? 'bg-[#6b75f2]' : 'bg-gray-300'}`}>
                      <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              )}
              
              {activeContent === 'Security' && (
                <div className="text-center py-20 text-gray-400 animate-in fade-in duration-300">
                  <Shield size={48} className="mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Security Administration</h3>
                  <p className="text-sm">Password and access management coming soon.</p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;