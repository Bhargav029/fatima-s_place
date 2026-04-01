import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Instagram, Facebook, Twitter, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // --- 🟢 MOCK BACKEND CODE ---
    // Simulating a 1.5-second network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In the future, this is where you will put your fetch() to PHP to save the email!
    
    setStatus('success');
    setEmail(''); // Clear the input field

    // Reset the button after 4 seconds
    setTimeout(() => {
      setStatus('idle');
    }, 4000);
  };

  return (
    <footer className="bg-gray-50 dark:bg-[#08090d] pt-16 md:pt-20 pb-10 px-6 md:px-20 border-t border-gray-100 dark:border-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
        
        {/* Brand Section */}
        <div className="space-y-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="w-8 h-8 bg-[#6b75f2] rounded-full flex items-center justify-center text-white"><UtensilsCrossed size={16} /></div>
            <span className="text-xl font-bold text-indigo-600 dark:text-[#6b75f2]">Fatima's Place</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Experience the heart of Goa with every bite. Authentic flavors, coastal vibes, and warm hospitality since 1998.</p>
          <div className="flex justify-center sm:justify-start gap-4 text-gray-400 dark:text-gray-500">
            <a href="https://instagram.com/fatimas_place_" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-[#6b75f2] transition-colors"><Instagram size={20} /></a>
            </div>
        </div>

        {/* Explore Links */}
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Explore</h4>
          <ul className="space-y-3 md:space-y-4 text-gray-500 dark:text-gray-400 text-sm">
            <li><Link to="/menu" className="hover:text-indigo-600 dark:hover:text-[#6b75f2] cursor-pointer">Menu</Link></li>
            <li><Link to="/reservations" className="hover:text-indigo-600 dark:hover:text-[#6b75f2] cursor-pointer">Reservations</Link></li>
            <li><Link to="/offers" className="hover:text-indigo-600 dark:hover:text-[#6b75f2] cursor-pointer">Special Offers</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-600 dark:hover:text-[#6b75f2] cursor-pointer">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Contact</h4>
          <ul className="space-y-3 md:space-y-4 text-gray-500 dark:text-gray-400 text-sm">
            <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3"><MapPin size={18} className="text-indigo-400 dark:text-indigo-500 shrink-0 hidden sm:block" /> <span>Resort, Small Rd, Opp Leaney, Dmello Vaddo, Vagator, Goa 403509</span></li>
            <li className="flex justify-center sm:justify-start items-center gap-3"><Phone size={18} className="text-indigo-400 dark:text-indigo-500 shrink-0" /> +91 987 654 3210</li>
            <li className="flex justify-center sm:justify-start items-center gap-3"><Mail size={18} className="text-indigo-400 dark:text-indigo-500 shrink-0" /> hello@fatimasplace.com</li>
          </ul>
        </div>

        {/* Working Newsletter Section */}
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Newsletter</h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-6">Get Goan recipes and special offers delivered to your inbox.</p>
          
          {status === 'success' ? (
            <div className="flex items-center justify-center sm:justify-start gap-2 text-green-600 dark:text-green-400 font-bold text-sm bg-green-50 dark:bg-green-900/20 py-3 px-4 rounded-lg border border-green-100 dark:border-green-800 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle size={18} /> You're on the list!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                placeholder="Email address" 
                className="bg-white dark:bg-gray-900 border border-indigo-100 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm w-full outline-none focus:border-[#ec4899] transition-colors dark:text-white disabled:opacity-50" 
              />
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#ec4899] w-full sm:w-auto text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#db2777] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap min-w-[80px]"
              >
                {status === 'loading' ? 'Wait...' : 'Join'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 dark:text-gray-600 font-medium text-center md:text-left">
        <p>© 2026 Fatima's Place. All Rights Reserved.</p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          <Link to="/privacy" className="hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer">Terms of Service</Link>
          <Link to="/cookies" className="hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;