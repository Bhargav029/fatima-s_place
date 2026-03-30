import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NavbarMain from "../components/NavBarmain"; 
import Footer from "../components/Footer"; 

const Menu = () => {
  const navigate = useNavigate();

  // Your images data
  const menuImages = [
    { src: "/assets/breakfast.jpeg", title: "Breakfast Menu" },
    { src: "/assets/eggs.jpeg", title: "Eggs Specialties" },
    { src: "/assets/starters.jpeg", title: "Starters & Appetizers" },
    { src: "/assets/Burger.jpeg", title: "Burgers & Sandwiches" },
    { src: "/assets/indianVeg.jpeg", title: "Indian Cuisine" },
    { src: "/assets/Pasta.jpeg", title: "Pastas" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb] dark:bg-[#0a0b10] transition-colors duration-300 font-sans">
      {/* NAVBAR */}
      <NavbarMain />

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-6xl mx-auto px-6 py-12 w-full">
        
        {/* TOP HEADER & ORDER BUTTON */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 bg-white dark:bg-[#16171d] p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Our Digital Menu</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Scroll down to view our full menu pages</p>
          </div>
          
          <button 
            onClick={() => navigate('/order')} 
            className="bg-[#6b75f2] hover:bg-[#5a64e1] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-indigo-500/30 dark:shadow-none transition-all active:scale-95 whitespace-nowrap"
          >
            Go to Order Page <ArrowRight size={20} />
          </button>
        </div>

        {/* IMAGE LIST (Full Size for Readability) */}
        <div className="flex flex-col gap-16 mb-12 max-w-4xl mx-auto">
          {menuImages.map((image, idx) => (
            <div key={idx} className="flex flex-col items-center">
              
              {/* Menu Section Title */}
              <div className="flex items-center gap-4 w-full mb-6">
                <div className="h-[2px] flex-grow bg-gray-200 dark:bg-gray-800"></div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight text-center px-4">
                  {image.title}
                </h3>
                <div className="h-[2px] flex-grow bg-gray-200 dark:bg-gray-800"></div>
              </div>

              {/* Large Menu Image */}
              <div className="w-full rounded-[24px] overflow-hidden shadow-2xl bg-white dark:bg-[#16171d] border-4 border-white dark:border-gray-800">
                <img 
                  src={image.src}
                  alt={image.title}
                  // w-full and h-auto ensures the whole image is visible without cropping
                  className="w-full h-auto object-contain"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80"; }}
                />
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Menu;