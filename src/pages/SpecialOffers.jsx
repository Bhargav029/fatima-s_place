import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Clock, Gift, Copy, CheckCircle, Ticket, ArrowRight } from 'lucide-react';
import Navbar from '../components/NavBarmain'; // Adjust path if needed
import Footer from '../components/Footer'; // Adjust path if needed

const SpecialOffers = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  // The interactive copy function
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000); // Reset after 2 seconds
  };

  const offers = [
    {
      id: 1,
      title: "Welcome to the Family",
      description: "Get 15% off your very first online order at Fatima's Place. Valid on all Goan curries and seafood!",
      code: "GOA15",
      icon: <Gift className="w-6 h-6 text-pink-500" />,
      bg: "bg-pink-50 dark:bg-pink-500/10",
      border: "border-pink-200 dark:border-pink-500/20",
      validUntil: "Valid for New Users"
    },
    {
      id: 2,
      title: "Weekend Seafood Fiesta",
      description: "Free portion of Prawn Balchão on all orders above ₹1200. Make your weekend special!",
      code: "WEEKENDCATCH",
      icon: <Ticket className="w-6 h-6 text-indigo-500" />,
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      border: "border-indigo-200 dark:border-indigo-500/20",
      validUntil: "Valid Saturday & Sunday"
    },
    {
      id: 3,
      title: "Sunset Happy Hour",
      description: "Flat 20% off on all starters and appetizers when you order between 4 PM and 7 PM.",
      code: "SUNSET20",
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      bg: "bg-orange-50 dark:bg-orange-500/10",
      border: "border-orange-200 dark:border-orange-500/20",
      validUntil: "Daily: 4 PM - 7 PM"
    }
  ];

  return (
    <div className="min-h-screen font-sans bg-[#f8f9fb] dark:bg-[#0a0b10] transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-[#5b6aff] text-white pt-16 pb-24 px-6 md:px-20 text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <Tag className="absolute w-64 h-64 -top-10 -left-10 rotate-12" />
          <Ticket className="absolute w-80 h-80 -bottom-20 -right-20 -rotate-12" />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-200 uppercase bg-indigo-900/30 rounded-full">Exclusive Deals</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Special Offers & Combos</h1>
          <p className="text-lg text-indigo-100">Apply these promo codes at checkout to enjoy authentic Goan flavors at a special price.</p>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-20 -mt-10 pb-20 relative z-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {offers.map((offer) => (
            <div key={offer.id} className={`flex flex-col bg-white dark:bg-[#16171d] rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border ${offer.border} transition-transform hover:-translate-y-1`}>
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${offer.bg}`}>
                  {offer.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{offer.title}</h3>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={12} /> {offer.validUntil}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                {offer.description}
              </p>

              {/* Promo Code Box */}
              <div className="mt-auto">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Promo Code</div>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-2 pl-4">
                  <span className="font-mono font-bold tracking-wider text-[#e23744] dark:text-pink-400 text-lg">
                    {offer.code}
                  </span>
                  
                  <button 
                    onClick={() => handleCopy(offer.code)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      copiedCode === offer.code 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {copiedCode === offer.code ? (
                      <><CheckCircle size={16} /> Copied!</>
                    ) : (
                      <><Copy size={16} /> Copy</>
                    )}
                  </button>
                </div>
              </div>

            </div>
          ))}

        </div>

        {/* Call to Action to use the codes */}
        <div className="mt-16 bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-10 text-center shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Hungry yet?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">Copy your favorite promo code above and head over to our menu to start building your Goan feast.</p>
          <Link to="/menu" className="inline-flex items-center gap-2 px-8 py-4 font-bold text-white transition-all bg-[#e23744] rounded-xl hover:bg-[#c9303c] shadow-lg shadow-red-500/20 dark:shadow-none">
            Explore Menu <ArrowRight size={20} />
          </Link>
        </div>

      </div>
       <Footer />
    </div>

  );
};

export default SpecialOffers;