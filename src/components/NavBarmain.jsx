import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Palmtree, Search, ShoppingBag, Settings, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext';

const NavbarMain = () => {
  const { cartItems, searchQuery, setSearchQuery } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = cartItems?.reduce((acc, item) => acc + item.qty, 0) || 0;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/menu' && e.target.value.trim() !== '') {
      navigate('/menu');
    }
  };

  const navLinkClass = (path) => `
    font-bold transition-colors duration-200 
    ${location.pathname === path 
      ? 'text-[#5b6aff] drop-shadow-sm' 
      : 'text-gray-500 dark:text-gray-400 hover:text-[#5b6aff] dark:hover:text-[#5b6aff]'}
  `;

  // Determine which dashboard link to show based on Role
const getDashboardLink = () => {
    if (user?.role === 'admin') return { path: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard };
    
    // --- CHANGE 'driver' TO 'staff' HERE ---
    if (user?.role === 'staff' || user?.role === 'driver') return { path: '/staff', label: 'Staff Operations', icon: LayoutDashboard };
    
    return { path: '/dashboard', label: 'My Dashboard', icon: User }; 
  };

  const dashboardInfo = getDashboardLink();

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 dark:bg-[#0a0b10]/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      
      <Link to="/" className="flex items-center gap-3">
        <div className="flex items-center justify-center w-[38px] h-[38px] text-white bg-[#5b6aff] rounded-full shadow-sm">
          <Palmtree size={20} strokeWidth={2.5} />
        </div>
        <span className="text-[22px] font-bold text-gray-900 dark:text-white tracking-tight">Fatima's Place</span>
      </Link>

      <ul className="hidden lg:flex gap-8 text-[15px]">
        <li><Link to="/" className={navLinkClass('/')}>Home</Link></li>
        <li><Link to="/menu" className={navLinkClass('/menu')}>Menu</Link></li>
        <li><Link to="/reservations" className={navLinkClass('/reservations')}>Reservations</Link></li>
        <li><Link to="/track-order" className={navLinkClass('/track-order')}>Track Order</Link></li>
      </ul>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute w-[15px] h-[15px] text-gray-400 -translate-y-1/2 left-3.5 top-1/2" />
          <input 
            type="text" 
            placeholder="Search dishes..." 
            value={searchQuery}
            onChange={handleSearch}
            className="py-[9px] pl-10 pr-4 text-[14px] bg-gray-50 dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-full w-[200px] focus:w-[260px] dark:text-white outline-none transition-all placeholder:text-gray-400" 
          />
        </div>

        {/* --- CUSTOMER ONLY CART ICON --- */}
        {(!user || user.role === 'customer') && (
          <Link to="/checkout" className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all group">
            <ShoppingBag size={22} className="group-hover:text-[#5b6aff] transition-colors" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#ec4899] border-2 border-white dark:border-[#0a0b10] rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        )}

        {!isAuthenticated && (
          <div className="hidden md:block w-[1px] h-7 bg-gray-200 dark:bg-gray-700 mx-1"></div>
        )}

        {!isAuthenticated ? (
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-[#16171d] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm whitespace-nowrap"
          >
            Log In
          </button>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-0.5 border-2 border-indigo-100 dark:border-gray-800 shrink-0 overflow-hidden hover:opacity-80 transition-all shadow-sm focus:outline-none"
            >
              {user?.image ? (
                <img src={user.image} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User size={20} className="text-gray-400 dark:text-gray-500" />
              )}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0a0b10]/50 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white dark:bg-[#16171d] mb-2 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    {user?.image ? (
                      <img src={user.image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate w-full">{user?.name || "Guest"}</p>
                  <p className="text-[11px] text-gray-500 truncate w-full mt-0.5">{user?.email || "No email"}</p>
                </div>
                
                <Link to={dashboardInfo.path} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#5b6aff] transition-colors">
                  <dashboardInfo.icon size={16} /> {dashboardInfo.label}
                </Link>
                
                {user?.role !== 'customer' && (
                  <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#5b6aff] transition-colors">
                    <Settings size={16} /> Settings
                  </Link>
                )}
                
                <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border-t border-gray-100 dark:border-gray-800">
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarMain;