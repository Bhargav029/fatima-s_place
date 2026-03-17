import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Palmtree, Search, ShoppingBag, Menu as MenuIcon, X, Settings, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext';

const NavbarMain = () => {
  const { cartItems, searchQuery, setSearchQuery } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-20 py-4 bg-white/70 dark:bg-[#0a0b10]/70 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      
      {/* --- LOGO --- */}
      <Link to="/" className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 text-white bg-[#6b75f2] rounded-full shadow-sm">
          <Palmtree size={22} />
        </div>
        <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">Fatima's Place</span>
      </Link>

      {/* --- NAV LINKS --- */}
      <ul className="hidden md:flex gap-8 font-bold text-gray-500 dark:text-gray-400">
        <li><Link to="/" className="hover:text-[#e23744] transition-colors">Home</Link></li>
        <li><Link to="/menu" className="hover:text-[#e23744] transition-colors">Menu</Link></li>
        <li><Link to="/reservations" className="hover:text-[#e23744] transition-colors">Reservations</Link></li>
        <li><Link to="/track-order" className="hover:text-[#e23744] transition-colors">Track Order</Link></li>
      </ul>

      <div className="flex items-center gap-3 md:gap-5">
        
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

        {/* Cart Icon */}
        <Link to="/menu" className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all group">
          <ShoppingBag size={22} className="group-hover:text-[#6b75f2]" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#ec4899] border-2 border-white dark:border-gray-900 rounded-full">
              {totalItems}
            </span>
          )}
        </Link>

        {/* --- AUTH / HAMBURGER SECTION --- */}
        {!isAuthenticated ? (
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            Log In
          </button>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              {isMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account</p>
                </div>
                
                <Link 
                  to="/settings" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#6b75f2] transition-colors"
                >
                  <Settings size={16} /> Settings
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
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

export default NavbarMain;
