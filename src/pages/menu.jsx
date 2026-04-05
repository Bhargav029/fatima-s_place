import { useState } from 'react';
// Rename the 'Menu' icon to 'MenuIcon' to avoid the conflict
import { ChevronLeft, ChevronRight, Menu as MenuIcon } from 'lucide-react';

export const Menu = () => {
  const [currentMenuImage, setCurrentMenuImage] = useState(0);

  const menuImages = [
    { src: "/assets/breakfast.jpeg", title: "Breakfast" },
    { src: "/assets/eggs.jpeg", title: "Eggs" },
    { src: "/assets/starters.jpeg", title: "Starters" },
    { src: "/assets/burger.jpeg", title: "Burgers & Sandwiches" },
    { src: "/assets/indianVeg.jpeg", title: "Indian Cuisine" },
    { src: "/assets/pasta.jpeg", title: "Pastas" },
  ];

  // CRITICAL: You must add a 'return' statement here
  return (
    <div className="mb-12">
      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <img 
          src={menuImages[currentMenuImage].src}
          alt={menuImages[currentMenuImage].title}
          className="w-full h-auto"
        />
        
        {/* Navigation Arrows */}
        <button 
          onClick={() => setCurrentMenuImage(prev => prev === 0 ? menuImages.length - 1 : prev - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 p-2 rounded-full hover:bg-white transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => setCurrentMenuImage(prev => prev === menuImages.length - 1 ? 0 : prev + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 p-2 rounded-full hover:bg-white transition-all"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Image Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-bold">{menuImages[currentMenuImage].title}</h3>
        </div>
      </div>
      
      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {menuImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentMenuImage(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentMenuImage === idx 
                ? 'bg-[#6b75f2] w-4' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`} 
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;