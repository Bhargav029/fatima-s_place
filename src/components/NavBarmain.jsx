import React from 'react';
import { Link } from 'react-router-dom';
import { Palmtree, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext'; 

const NavbarMain = () => {
  const { cartItems, searchQuery, setSearchQuery } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="flex items-center justify-between px-20 py-4 bg-white/50 border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 text-white bg-[#6b75f2] rounded-full">
          <Palmtree size={22} />
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">Fatima's Place</span>
      </Link>
{/* --- NAV LINKS --- */}
      <ul className="hidden md:flex gap-8 font-semibold text-gray-500">
        <li><Link to="/" className="hover:text-red-600 transition-colors">Home</Link></li>
        <li><Link to="/menu" className="hover:text-red-600  transition-colors">Menu</Link></li>
        <li><Link to="/reservations" className="hover:text-red-600  cursor-pointer transition-colors">Reservations</Link></li>
        <li><Link to="/track-order" className="hover:text-red-600  cursor-pointer transition-colors">Track Order</Link></li>
      </ul>
      <div className="flex items-center gap-5">
        {/* Search Bar only in the Main Navbar */}
        <div className="relative hidden lg:block">
          <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <input 
            type="text" 
            placeholder="Search menu..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-2 pl-10 pr-4 text-sm bg-gray-50 border rounded-full w-[200px] focus:w-[300px] outline-none transition-all" 
          />
        </div>

        <Link to="/menu" className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-all group">
          <ShoppingBag size={22} className="group-hover:text-[#6b75f2]" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#ec4899] border-2 border-white rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default NavbarMain;