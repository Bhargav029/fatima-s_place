import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  MapPin,
  ChevronRight,
  UtensilsCrossed,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Phone,
  X,
  Gift
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import Navbar from "../components/NavBarhome";
import Footer from '../components/Footer';

import hero from "/assets/hero.jpg";
import biryani from "/assets/biryani.png";
import chicken from "/assets/chicken_x.png";
import prawns from "/assets/prawns.jpg";

function Home() {
  const { isAuthenticated } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const dishes = [
    {
      image: biryani,
      name: "Biryani",
      desc: "A fragrant and flavorful rice dish layered with marinated meat, caramelized onions, and aromatic spices, slow-cooked to perfection.",
      price: 230,
      rating: 5
    },
    {
      image: prawns,
      name: "Prawn Balchão",
      price: 720,
      desc: "Succulent prawns cooked in a thick, spicy, and vinegary tomato-based red chili sauce.",
      rating: 5
    },
    {
      image: chicken,
      name: "Chicken Xacuti",
      price: 350,
      desc: "A complex curry made with roasted coconut and a blend of 12 traditional Goan spices.",
      rating: 5
    },
  ];

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white dark:bg-[#0a0b10] transition-colors duration-300 relative">
      <Navbar />

      {/* --- 1. HERO SECTION --- */}
      <section className="relative h-[85vh] flex items-center px-4 sm:px-6 md:px-20 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-center bg-cover" style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url(${hero})` }} />
        <div className="relative z-10 max-w-2xl text-white mt-10 md:mt-0">
          <div className="inline-block px-4 py-1 mb-4 md:mb-6 text-xs font-bold tracking-wide bg-[#ec4899] rounded-full">Est. 1998 • Authentic Goa</div>

          {/* Mobile responsive text sizing */}
          <h1 className="mb-4 md:mb-6 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Authentic Goan Flavors <br /> <span className="text-[#fb923c]">at Fatima's Place</span>
          </h1>

          <p className="mb-8 md:mb-10 text-base md:text-lg leading-relaxed text-gray-200">
            Experience the soulful essence of the coast. From spicy Fish Recheado to the creamy Bebinca, our kitchen brings the traditional heritage of Goa straight to your table.
          </p>

          {/* Mobile responsive button stacking */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link to="/menu" className="w-full sm:w-auto text-center px-8 py-3 font-bold text-white transition-all bg-[#6b75f2] rounded-lg hover:bg-[#5a64e1] shadow-md">
              Order Food Now
            </Link>

            <Link to="/reservations" className="w-full sm:w-auto text-center px-8 py-3 font-bold text-[#374151] dark:text-white transition-all bg-white dark:bg-white/10 dark:backdrop-blur-md rounded-lg hover:bg-gray-50 dark:hover:bg-white/20 shadow-md">
              Book a Table
            </Link>

            <Link to="/menu" className="w-full sm:w-auto justify-center flex items-center gap-2 px-4 py-2 font-bold text-white group hover:opacity-80">
              View Menu <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- 2. MOST LOVED DISHES SECTION --- */}
      <section className="px-4 py-16 sm:px-6 md:py-24 bg-white dark:bg-[#0a0b10] md:px-20 max-w-7xl mx-auto transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6 text-center md:text-left">
          <div className="max-w-xl mx-auto md:mx-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Our Most Loved Dishes</h2>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">Handpicked favorites from our traditional Goan kitchen. Each dish tells a story of coastal heritage and spice routes.</p>
          </div>
          <Link to="/menu" className="border border-indigo-200 dark:border-gray-800 text-indigo-600 dark:text-[#6b75f2] px-6 py-3 md:py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 dark:hover:bg-gray-900 transition-colors">
            Explore Full Menu
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish, index) => (
            <div key={index} className="relative p-6 transition-all bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl hover:shadow-xl dark:hover:shadow-indigo-500/10 group">
              <div className="absolute top-4 right-4 z-10 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-700 dark:text-gray-200">₹{dish.price}</div>
              <div className="flex justify-center mb-6 h-48 sm:h-52">
                <img src={dish.image} alt={dish.name} className="object-contain h-full transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{dish.name}</h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">{dish.desc}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex text-orange-400 text-lg">{"★".repeat(dish.rating)}</div>
                <button className="flex items-center justify-center w-10 h-10 text-2xl font-light border border-gray-200 dark:border-gray-700 rounded-full text-gray-400 hover:text-indigo-600 dark:hover:text-[#6b75f2] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">+</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 3. SERVICES SECTION --- */}
      <section className="px-4 sm:px-6 md:px-20 pb-16 md:pb-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-[#f0f3ff] dark:bg-[#111827] p-8 md:p-10 rounded-[32px] md:rounded-[40px] flex flex-col-reverse sm:flex-row items-center text-center sm:text-left gap-8 shadow-sm">
            <div className="flex-1 flex flex-col items-center sm:items-start">
              <div className="bg-[#dfe4ff] dark:bg-indigo-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-[#5c67f2] dark:text-[#6b75f2]"><Calendar size={24} /></div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">Plan an Event</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed text-sm md:text-base">Host your birthday, anniversary, or corporate party with Goan charm.</p>
              <Link to="/reservations" className="flex items-center gap-2 text-[#5c67f2] dark:text-[#6b75f2] font-bold hover:underline">
                Book a Space <ChevronRight size={18} />
              </Link>
            </div>
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center p-4 shrink-0">
              <img src="https://cdn-icons-png.flaticon.com/512/3222/3222683.png" alt="Event" className="w-full h-full object-contain dark:invert dark:opacity-80" />
            </div>
          </div>

          <div className="bg-[#fff0f3] dark:bg-[#1e1b1c] p-8 md:p-10 rounded-[32px] md:rounded-[40px] flex flex-col-reverse sm:flex-row items-center text-center sm:text-left gap-8 shadow-sm">
            <div className="flex-1 flex flex-col items-center sm:items-start">
              <div className="bg-[#ffe0e6] dark:bg-rose-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-[#f25c78]"><MapPin size={24} /></div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">Live Tracking</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed text-sm md:text-base">See exactly where your delicious meal is while it's on its way to you.</p>
              <Link to="/track-order" className="flex items-center gap-2 text-[#f25c78] font-bold hover:underline">
                Track My Order <ChevronRight size={18} />
              </Link>
            </div>
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center p-4 shrink-0">
              <img src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png" alt="Tracking" className="w-full h-full object-contain dark:invert dark:opacity-80" />
            </div>
          </div>

        </div>
      </section>

      {/* --- 4. FINAL CTA SECTION --- */}
      <section className="py-16 md:py-24 text-center px-4 sm:px-6 bg-white dark:bg-[#0a0b10] transition-colors duration-300">
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-[#6b75f2]">
            <UtensilsCrossed size={32} className="md:w-10 md:h-10" strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 tracking-tight">Ready to taste the ocean?</h2>
        <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 md:mb-12">Whether you're looking for a quick lunch or a celebratory dinner, we have a table waiting for you.</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto sm:max-w-none">
          <Link to="/menu" className="w-full sm:w-auto px-10 py-4 font-bold text-white bg-[#6b75f2] rounded-lg shadow-lg hover:shadow-indigo-200 dark:shadow-none transition-all">
            Order Food Online
          </Link>
          <Link to="/reservations" className="w-full sm:w-auto px-10 py-4 font-bold text-[#6b75f2] border-2 border-indigo-100 dark:border-gray-800 bg-white dark:bg-transparent rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            Reserve a Table
          </Link>
        </div>
      </section>

     {/* --- 5. FOOTER --- */}
      <Footer />

      {/* --- ADDED: 5-SECOND LOGIN POPUP MODAL --- */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#16171d] rounded-3xl shadow-2xl w-[95%] sm:w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 relative border border-gray-100 dark:border-gray-800">

            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors z-10"
            >
              <X size={18} />
            </button>

            <div className="bg-indigo-50 dark:bg-indigo-500/10 p-6 sm:p-8 text-center border-b border-indigo-100 dark:border-gray-800">
              <div className="w-16 h-16 bg-[#6b75f2] rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
                <Gift size={32} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-2">Unlock Exclusive Perks!</h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Sign in now to save your favorite Goan dishes, track your live deliveries, and earn loyalty points.
              </p>
            </div>

            <div className="p-5 sm:p-6 space-y-3 bg-white dark:bg-[#16171d]">
              <Link
                to="/login"
                className="w-full flex justify-center py-3 sm:py-3.5 bg-[#e23744] text-white rounded-xl font-bold hover:bg-[#c9303c] transition-colors shadow-md shadow-red-500/20 dark:shadow-none text-sm sm:text-base"
              >
                Log In / Sign Up
              </Link>
              <button
                onClick={() => setShowPopup(false)}
                className="w-full flex justify-center py-3 sm:py-3.5 text-gray-500 dark:text-gray-400 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ------------------------------------------- */}

    </div>
  );
}

export default Home;