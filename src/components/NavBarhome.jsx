import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Palmtree, Search, Menu as MenuIcon, X, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NavbarHome = () => {
  const { searchQuery, setSearchQuery } = useCart();
  const { isAuthenticated, logout, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== "") {
      navigate('/menu');
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); 
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/40 shadow-sm transition-all duration-300">
      
      <Link to="/" className="flex items-center gap-3">
        <div className="flex items-center justify-center w-[38px] h-[38px] text-white bg-[#5b6aff] rounded-full shadow-sm">
          <Palmtree size={20} strokeWidth={2.5} />
        </div>
        <span className="text-[22px] font-extrabold text-[#2d333f] tracking-tight drop-shadow-sm">Fatima's Place</span>
      </Link>

      <ul className="hidden lg:flex items-center gap-8 text-[15px] font-medium">
        <li><Link to="/" className="text-[#e23744] font-bold drop-shadow-sm">Home</Link></li>
        <li><Link to="/menu" className="text-[#4f5867] hover:text-[#e23744] transition-colors font-semibold drop-shadow-sm">Menu</Link></li>
        <li><Link to="/" className="text-[#4f5867] hover:text-[#e23744] transition-colors font-semibold drop-shadow-sm">Reservations</Link></li>
        <li><Link to="/" className="text-[#4f5867] hover:text-[#e23744] transition-colors font-semibold drop-shadow-sm">Track Order</Link></li>
      </ul>

      <div className="flex items-center gap-3">
        
        <div className="relative hidden md:block mr-1">
          <Search className="absolute w-[15px] h-[15px] text-gray-500 -translate-y-1/2 left-3.5 top-1/2" />
          <input 
            type="text" 
            placeholder="Search dishes..." 
            value={searchQuery}
            onChange={handleSearch}
            className="py-[9px] pl-10 pr-4 text-[14px] bg-white/50 backdrop-blur-sm border border-white/60 rounded-full w-[260px] focus:w-[280px] focus:bg-white/90 focus:border-gray-300 focus:outline-none transition-all placeholder:text-gray-500 shadow-inner" 
          />
        </div>

        {!isAuthenticated && (
          <div className="hidden md:block w-[1px] h-7 bg-gray-300/50 mx-2"></div>
        )}

        {!isAuthenticated && (
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-[9px] text-[14px] font-bold text-[#4f5867] bg-white/60 backdrop-blur-sm border border-white/60 rounded-md hover:bg-white/90 transition-all whitespace-nowrap shadow-sm"
          >
            Log In
          </button>
        )}

        <Link to="/menu" className="px-5 py-[9px] text-[14px] font-bold text-white bg-[#e23744] rounded-md hover:bg-[#c9303c] transition-colors shadow-md whitespace-nowrap">
          Order Now
        </Link>

        {isAuthenticated && (
          <div className="relative ml-1">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 bg-white/60 hover:bg-white border border-white/60 rounded-md shadow-sm transition-all flex items-center justify-center"
            >
              {isMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{user?.name || "My Account"}</p>
                </div>
                
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#5b6aff] transition-colors">
                    <LayoutDashboard size={16} /> Admin Dashboard
                  </Link>
                )}
                
                <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#5b6aff] transition-colors">
                  <Settings size={16} /> Settings
                </Link>
                
                <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
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