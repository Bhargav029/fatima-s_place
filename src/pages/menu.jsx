import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import NavbarMain from '../components/NavBarmain';
import Footer from '../components/Footer';

const Menu = () => {
  const menuImages = [
    { src: "/assets/breakfast.jpeg", title: "Breakfast Menu" },
    { src: "/assets/eggs.jpeg", title: "Eggs & Morning Specials" },
    { src: "/assets/starters.jpeg", title: "Appetizers & Starters" },
    { src: "/assets/burger.jpeg", title: "Burgers & Sandwiches" },
    { src: "/assets/indianVeg.jpeg", title: "Indian Cuisine" },
    { src: "/assets/pasta.jpeg", title: "Pastas & Italian" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0a0b10] flex flex-col font-sans transition-colors duration-300">
      
      {/* 1. Navbar */}
      <NavbarMain />

      {/* 2. Main Content (Expanded width like CustomerDashboard) */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-8 py-8 md:py-12">
        
        {/* Page Header & Order Button */}
        <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] rounded-full flex items-center justify-center mb-4 shadow-sm">
            <BookOpen size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Our Menu</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Explore our authentic Goan delicacies and coastal favorites. Tap the button below to place an order for delivery or pickup.
          </p>
          
          {/* Order Now Button */}
          <Link 
            to="/order" 
            className="bg-[#6b75f2] text-white px-8 md:px-10 py-3.5 md:py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#5a64e1] transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95"
          >
            Order Food Online <ArrowRight size={18} />
          </Link>
        </div>

        {/* Menu Images Layout
          Mobile: 1 Column (Huge)
          Tablet/Small Desktop: 1 Column (Huge)
          Large Desktop: 2 Columns side-by-side 
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 w-full pb-10">
          {menuImages.map((menu, idx) => (
            <div 
              key={idx} 
              className="w-full bg-white dark:bg-[#16171d] rounded-[24px] md:rounded-[32px] p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col"
            >
              {/* Moved Title to the top so it doesn't block the image */}
              <div className="mb-4 px-2">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {menu.title}
                </h3>
              </div>

              {/* The Image Container */}
              <div className="relative w-full bg-gray-50 dark:bg-[#0a0b10] rounded-2xl md:rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800 flex items-center justify-center">
                <img 
                  src={menu.src}
                  alt={menu.title}
                  // w-full and h-auto guarantees the image is never cropped or distorted
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* 3. Footer */}
      <Footer />
      
    </div>
  );
};

export default Menu;