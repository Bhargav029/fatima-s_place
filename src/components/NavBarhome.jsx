import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Palmtree, ShoppingBag, Settings, LogOut, LayoutDashboard, User, Menu, X } from 'lucide-react'; // ADDED: Menu and X for mobile
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext';

const NavbarHome = () => {
  const { cartItems } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For user profile dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // ADDED: For mobile hamburger menu
  
  const totalItems = cartItems?.reduce((acc, item) => acc + item.qty, 0) || 0;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = (path) => `
    font-bold transition-colors duration-200 block py-2 lg:py-0
    ${location.pathname === path 
      ? 'text-[#5b6aff] drop-shadow-sm' 
      : 'text-gray-600 dark:text-gray-300 hover:text-[#5b6aff]'}
  `;

  const getDashboardLink = () => {
    if (user?.role === 'admin') return { path: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard };
    
    // Changed 'driver' to 'staff' logic as requested
    if (user?.role === 'staff' || user?.role === 'driver') return { path: '/staff', label: 'Staff Operations', icon: LayoutDashboard };
    
    return { path: '/dashboard', label: 'My Dashboard', icon: User };
  };
  
  const dashboardInfo = getDashboardLink();

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 bg-white/80 dark:bg-[#0a0b10]/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 sm:gap-3 z-50" onClick={() => setIsMobileMenuOpen(false)}>
        <div className="flex items-center justify-center w-8 h-8 sm:w-[38px] sm:h-[38px] text-white bg-[#5b6aff] rounded-full shadow-sm shrink-0">
          <Palmtree size={18} strokeWidth={2.5} className="sm:w-5 sm:h-5" />
        </div>
        <span className="text-xl sm:text-[22px] font-bold text-gray-900 dark:text-white tracking-tight truncate">Fatima's Place</span>
      </Link>

      {/* Desktop Navigation Links */}
      <ul className="hidden lg:flex gap-8 text-[15px] absolute left-1/2 -translate-x-1/2">
        <li><Link to="/" className={navLinkClass('/')}>Home</Link></li>
        <li><Link to="/menu" className={navLinkClass('/menu')}>Menu</Link></li>
        <li><Link to="/reservations" className={navLinkClass('/reservations')}>Reservations</Link></li>
        <li><Link to="/track-order" className={navLinkClass('/track-order')}>Track Order</Link></li>
      </ul>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 md:gap-5 z-50">
        
        {/* Customer Cart Icon */}
        {(!user || user.role === 'customer') && (
          <Link to="/checkout" className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all group">
            <ShoppingBag size={22} className="group-hover:text-[#5b6aff] transition-colors" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#ec4899] border-2 border-white dark:border-[#0a0b10] rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        )}

        {/* Desktop Order Now Button */}
        {(!user || user.role === 'customer') && (
          <Link to="/menu" className="hidden sm:block px-5 py-[9px] text-[14px] font-bold text-white bg-[#e23744] rounded-md hover:bg-[#c9303c] transition-colors shadow-md whitespace-nowrap">
            Order Now
          </Link>
        )}

        <div className="hidden md:block w-[1px] h-7 bg-gray-200 dark:bg-gray-700 mx-1"></div>

        {/* Auth Section / User Profile */}
        {!isAuthenticated ? (
          <Link 
            to="/login"
            className="hidden sm:block px-5 py-[9px] text-[14px] font-bold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-all shadow-sm whitespace-nowrap"
          >
            Log In
          </Link>
        ) : (
          <div className="relative">
            <button 
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setIsMobileMenuOpen(false);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-0.5 border-2 border-indigo-100 dark:border-gray-700 shrink-0 overflow-hidden hover:opacity-80 transition-all shadow-sm focus:outline-none"
            >
              {user?.image ? (
                <img src={user.image} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User size={18} className="text-gray-400 sm:w-5 sm:h-5" />
              )}
            </button>

            {/* User Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white dark:bg-gray-800 mb-2 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    {user?.image ? <img src={user.image} alt="User" className="w-full h-full object-cover" /> : <User size={24} className="text-gray-400" />}
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate w-full">{user?.name || "Guest"}</p>
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

        {/* ADDED: Mobile Hamburger Button */}
        <button 
          className="lg:hidden p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            setIsMenuOpen(false);
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* ADDED: Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-[#0a0b10] border-b border-gray-100 dark:border-gray-800 shadow-lg lg:hidden flex flex-col px-6 py-6 gap-2 animate-in slide-in-from-top-2 z-40">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass('/')}>Home</Link>
          <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass('/menu')}>Menu</Link>
          <Link to="/reservations" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass('/reservations')}>Reservations</Link>
          <Link to="/track-order" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass('/track-order')}>Track Order</Link>
          
          <div className="h-[1px] w-full bg-gray-100 dark:bg-gray-800 my-2"></div>

          {/* Show Login button on mobile if not authenticated */}
          {!isAuthenticated && (
            <Link 
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center px-5 py-3 mt-2 text-[14px] font-bold text-gray-700 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-100 transition-all shadow-sm"
            >
              Log In
            </Link>
          )}

          {/* Show Order Now button on mobile to customers */}
          {(!user || user.role === 'customer') && (
            <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} className="w-full sm:hidden text-center px-5 py-3 mt-2 text-[14px] font-bold text-white bg-[#e23744] rounded-md hover:bg-[#c9303c] transition-colors shadow-md">
              Order Now
            </Link>
          )}
        </div>
      )}

    </nav>
  );
};

export default NavbarHome;