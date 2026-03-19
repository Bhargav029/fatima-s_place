import React from 'react';
import { 
  Check, Phone, MessageSquare, MapPin, Navigation, 
  Bike, HelpCircle, ChevronRight, ExternalLink, Clock, Star, User
} from 'lucide-react';
import NavbarMain from '../components/NavbarMain';
import { Link } from 'react-router-dom';

const TrackOrder = () => {
  const orderItems = [
    { qty: 1, name: "Prawn Balchão (Spicy)", status: "Prepared" },
    { qty: 2, name: "Chicken Cafreal", status: "Prepared" },
    { qty: 4, name: "Poee (Goan Bread)", status: "Prepared" },
    { qty: 1, name: "Bebinca (7-layer)", status: "Prepared" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0b10] transition-colors duration-300 font-sans flex flex-col">
      <NavbarMain />

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12 w-full flex-grow grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* --- LEFT COLUMN: ORDER DETAILS --- */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-8 animate-in slide-in-from-left-8 duration-500">
          
          <div>
            <div className="inline-block px-3 py-1 mb-4 text-[10px] font-extrabold tracking-widest text-[#ec4899] bg-pink-50 dark:bg-pink-500/10 rounded-full uppercase">
              Fast Delivery
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Arriving in <span className="text-[#5b6aff]">12 mins</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Estimated arrival at 1:35 PM • Order #F-92841
            </p>
          </div>

          <div className="bg-white dark:bg-[#16171d] rounded-[32px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
              Order Status <InfoIcon />
            </h3>

            <div className="relative mt-2 ml-1">
              <div className="absolute left-[11px] top-2 bottom-4 w-[2px] bg-gray-200 dark:bg-gray-800 z-0"></div>
              <div className="absolute left-[11px] top-2 h-[65%] w-[2px] bg-[#5b6aff] z-0"></div>

              <div className="relative z-10 flex items-start gap-5 mb-8">
                <div className="w-6 h-6 rounded-full bg-[#5b6aff] flex items-center justify-center shrink-0 shadow-sm ring-[6px] ring-white dark:ring-[#16171d] mt-0.5">
                  <Check size={14} className="text-white" strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1.5">Order Placed</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">12:45 PM</p>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-5 mb-8">
                <div className="w-6 h-6 rounded-full bg-[#5b6aff] flex items-center justify-center shrink-0 shadow-sm ring-[6px] ring-white dark:ring-[#16171d] mt-0.5">
                  <Check size={14} className="text-white" strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1.5">Preparing</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1:05 PM</p>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-5 mb-8">
                <div className="w-6 h-6 rounded-full border-2 border-[#5b6aff] bg-white dark:bg-[#16171d] flex items-center justify-center shrink-0 ring-[6px] ring-white dark:ring-[#16171d] mt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5b6aff]"></div>
                </div>
                <div className="w-full flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-[#5b6aff] leading-none mb-1.5">On the Way</h4>
                    <p className="text-xs text-[#5b6aff] font-medium">Active</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#5b6aff] bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-md tracking-widest uppercase">Current</span>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-5">
                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 ring-[6px] ring-white dark:ring-[#16171d] mt-0.5 text-gray-400 dark:text-gray-500 text-xs font-bold">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 leading-none mb-1.5">Delivered</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Expected 1:35 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Valet Card */}
          <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-[32px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* --- REPLACED DRIVER PHOTO WITH ICON --- */}
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700">
                  <User size={24} className="text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Ramesh Kumar</h4>
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                    <Star size={12} className="text-orange-400 fill-orange-400" /> 4.8 • 1,200+ deliveries
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Delivery Valet</p>
                <p className="text-xs font-bold text-[#5b6aff]">On a Scooter</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-[#5b6aff] text-white py-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 hover:bg-[#4a58e8] transition-colors shadow-md shadow-indigo-100 dark:shadow-none">
                <Phone size={16} /> Call Ramesh
              </button>
              <button className="flex-1 bg-white dark:bg-[#16171d] text-[#5b6aff] border border-indigo-100 dark:border-gray-700 py-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <MessageSquare size={16} /> Message
              </button>
            </div>
          </div>

          <div className="px-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Order Items</h3>
              <button className="text-xs font-bold text-[#5b6aff] flex items-center gap-1 hover:underline">
                View Receipt <ExternalLink size={12} />
              </button>
            </div>
            <div className="space-y-3 mb-6">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{item.qty}x</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-xs italic text-gray-400">{item.status}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group">
              <span className="flex items-center gap-2"><HelpCircle size={16} /> Need help with your order?</span>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* --- RIGHT COLUMN: THE MAP --- */}
        <div className="lg:col-span-8 xl:col-span-8 h-[600px] lg:h-full min-h-[600px] relative bg-[#f4f5f8] dark:bg-[#111218] rounded-[40px] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-inner animate-in slide-in-from-right-8 duration-500 flex flex-col">
          
          <div className="absolute top-6 left-6 z-20">
            <div className="bg-white dark:bg-[#16171d] px-5 py-3 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-[#5b6aff] rounded-full flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Status</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Passing Calangute Circle</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 z-20">
            <div className="bg-white dark:bg-[#16171d] px-4 py-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-white mt-px">Live Updates</p>
            </div>
          </div>

          <div className="absolute inset-0 w-full h-full pointer-events-none z-10 flex items-center justify-center">
            <svg viewBox="0 0 800 600" className="w-full h-full object-cover opacity-80 dark:opacity-50">
              <path d="M -100 300 Q 200 400 400 300 T 900 200" fill="none" stroke="#e2e8f0" strokeWidth="40" className="dark:stroke-gray-800" />
              <path d="M 200 -100 L 400 300 L 250 800" fill="none" stroke="#e2e8f0" strokeWidth="6" className="dark:stroke-gray-800" />
              <path d="M 250 450 Q 300 350 450 350 L 550 330 L 650 200" fill="none" stroke="#5b6aff" strokeWidth="4" />
              <path d="M 650 200 L 680 150" fill="none" stroke="#5b6aff" strokeWidth="4" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
            </svg>
            <style>{`@keyframes dash { to { stroke-dashoffset: -1000; } }`}</style>
          </div>

          <div className="absolute inset-0 z-20">
            <div className="absolute left-[30%] bottom-[20%] flex flex-col items-center translate-x-[-50%] translate-y-[50%]">
              <div className="w-12 h-12 bg-[#5b6aff] rounded-xl flex items-center justify-center shadow-lg transform rotate-45 mb-2 border-2 border-white dark:border-[#16171d]">
                <Navigation size={20} className="text-white -rotate-45" fill="currentColor" />
              </div>
              <span className="bg-white dark:bg-[#16171d] px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white">Fatima's Place</span>
            </div>

            <div className="absolute left-[55%] top-[55%] flex flex-col items-center translate-x-[-50%] translate-y-[-50%]">
              <div className="relative">
                <div className="absolute inset-0 bg-[#5b6aff]/20 rounded-full animate-ping"></div>
                <div className="w-12 h-12 bg-white dark:bg-[#16171d] border-2 border-[#5b6aff] rounded-full flex items-center justify-center shadow-xl relative z-10">
                  <Bike size={20} className="text-[#5b6aff]" />
                </div>
              </div>
            </div>

            <div className="absolute right-[20%] top-[25%] flex flex-col items-center translate-x-[50%] translate-y-[-50%]">
              <div className="w-12 h-12 bg-[#ec4899] rounded-[24px_24px_24px_4px] flex items-center justify-center shadow-lg transform rotate-45 mb-2 border-2 border-white dark:border-[#16171d]">
                <MapPin size={20} className="text-white -rotate-45" fill="currentColor" />
              </div>
              <span className="bg-white dark:bg-[#16171d] px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white">Your Home</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 16v-4"></path>
    <path d="M12 8h.01"></path>
  </svg>
);

export default TrackOrder;