import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Palmtree, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NavbarHome = () => {
  const { searchQuery, setSearchQuery } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Handle Search Input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== "") {
      navigate('/menu');
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white/80 border-b border-gray-100 sticky top-0 z-50">
      
      {/* --- LEFT: LOGO & BRAND --- */}
      <Link to="/" className="flex items-center gap-3">
        <div className="flex items-center justify-center w-[38px] h-[38px] text-white bg-[#5b6aff] rounded-full">
          <Palmtree size={20} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">Fatima's Place</span>
      </Link>

      {/* --- CENTER: NAV LINKS --- */}
      <ul className="hidden lg:flex items-center gap-8 text-[15px] font-medium">
        <li>
          <Link to="/" className="text-black hover:text-[#e23744] transition-colorsfont-bold">Home</Link>
        </li>
        <li>
          <Link to="/menu" className="text-black hover:text-[#e23744] transition-colors">Menu</Link>
        </li>
        <li>
          <Link to="/" className="text-black hover:text-[#e23744] transition-colors">Reservations</Link>
        </li>
        <li>
          <Link to="/" className="text-black hover:text-[#e23744] transition-colors">Track Order</Link>
        </li>
      </ul>

      {/* --- RIGHT: ACTIONS --- */}
      <div className="flex items-center gap-3">
        
        {/* Search Bar */}
        <div className="relative hidden md:block mr-1">
          <Search className="absolute w-[15px] h-[15px] text-gray-400 -translate-y-1/2 left-3.5 top-1/2" />
          <input 
            type="text" 
            placeholder="Search dishes..." 
            value={searchQuery}
            onChange={handleSearch}
            className="py-[9px] pl-10 pr-4 text-[14px] bg-[#fafafa] border border-gray-200 rounded-full w-[260px] focus:w-[280px] focus:bg-white focus:border-gray-300 focus:outline-none transition-all placeholder:text-gray-400" 
          />
        </div>

        {/* Divider Line */}
        <div className="hidden md:block w-[1px] h-7 bg-gray-200 mx-2"></div>

        {/* Log In Button */}
        <button 
          onClick={() => isAuthenticated ? logout() : navigate('/login')}
          className="px-5 py-[9px] text-[14px] font-medium text-[#4f5867] bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          {isAuthenticated ? 'Log Out' : 'Log In'}
        </button>

        {/* Order Now Button */}
        <Link 
          to="/menu" 
          className="px-5 py-[9px] text-[14px] font-bold text-white bg-[#e23744] rounded-md hover:bg-[#c9303c] transition-colors shadow-sm whitespace-nowrap"
        >
          Order Now
        </Link>
      </div>
    </nav>
  );
};

export default NavbarHome;