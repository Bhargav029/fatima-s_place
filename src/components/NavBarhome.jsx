import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Palmtree, Search, Menu as MenuIcon, X, Settings, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NavbarHome = () => {
  const { searchQuery, setSearchQuery } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // State to control the dropdown menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== "") {
      navigate('/menu');
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Close menu on logout
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-20 py-4 bg-white/70 dark:bg-[#0a0b10]/70 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      
      {/* --- LEFT: LOGO & BRAND --- */}
      <Link to="/" className="flex items-center gap-3">
        <div className="flex items-center justify-center w-[38px] h-[38px] text-white bg-[#5b6aff] rounded-full shadow-sm">
          <Palmtree size={20} strokeWidth={2.5} />
        </div>
       <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">Fatima's Place</span>
             </Link>
       

      {/* --- CENTER: NAV LINKS --- */}
      <ul className="hidden md:flex gap-8 font-bold text-gray-500 dark:text-gray-400">
              <li><Link to="/" className="hover:text-[#e23744] transition-colors">Home</Link></li>
              <li><Link to="/menu" className="hover:text-[#e23744] transition-colors">Menu</Link></li>
              <li><Link to="/reservations" className="hover:text-[#e23744] transition-colors">Reservations</Link></li>
              <li><Link to="/track-order" className="hover:text-[#e23744] transition-colors">Track Order</Link></li>
            </ul>

      {/* --- RIGHT: ACTIONS --- */}
      <div className="flex items-center gap-3">
        
       {/* Search Bar */}
               <div className="relative hidden lg:block">
                 <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                 <input 
                   type="text" 
                   placeholder="Search menu..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="py-2 pl-10 pr-4 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full w-[180px] focus:w-[250px] dark:text-white outline-none transition-all placeholder:text-gray-400" 
                 />
               </div>

        {/* Divider Line (Only show if NOT logged in, to separate search and login) */}
        {!isAuthenticated && (
          <div className="hidden md:block w-[1px] h-7 bg-gray-300/50 mx-2"></div>
        )}

        {/* Log In Button - ONLY SHOWS IF NOT LOGGED IN */}
        {!isAuthenticated && (
          <button 
            onClick={() => navigate('/login')}
             className="p-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
            Log In
          </button>
        )}

        {/* Order Now Button - ALWAYS VISIBLE */}
        <Link 
          to="/menu" 
          className="px-5 py-[9px] text-[14px] font-bold text-white bg-[#e23744] rounded-md hover:bg-[#c9303c] transition-colors shadow-md whitespace-nowrap"
        >
          Order Now
        </Link>

        {/* User Menu Dropdown - ONLY SHOWS IF LOGGED IN */}
        {isAuthenticated && (
          <div className="relative ml-1">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              {isMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>

            {/* The Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">My Account</p>
                </div>
                
                <Link 
                  to="/settings" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#5b6aff] transition-colors"
                >
                  <Settings size={16} /> Settings
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                >
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

export default NavbarHome;