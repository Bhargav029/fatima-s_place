import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavbarMain from '../components/NavBarmain';
import { 
  Calendar, Clock, Users, Info, ArrowRight, User, Mail, Phone, MessageSquare, 
  CheckCircle, Music, Cake, Sparkles, MapPin, Instagram, Facebook, Twitter, 
  Palmtree, UtensilsCrossed 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- FIREBASE IMPORTS ---
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

const Reservations = () => {
  const { user } = useAuth();
  
  // --- STATE MANAGEMENT ---
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to prevent double clicks
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 2,
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    occasion: 'Casual Dining',
    requests: '',
    addons: []
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name, email: user.email, phone: user.phone || '' }));
    }
  }, [user]);

  const timeSlots = [
    '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const premiumAddons = [
    { id: 'band', title: 'Goan Live Band', desc: 'Tradition', price: 5000, icon: Music },
    { id: 'cake', title: 'Celebration Cake', desc: 'Chef Pali', price: 1500, icon: Cake },
    { id: 'decor', title: 'Table Decoration', desc: 'Floral art', price: 1200, icon: Sparkles }
  ];

  // --- HELPERS ---
  const handleGuestsChange = (action) => {
    if (action === 'increment' && formData.guests < 20) {
      setFormData({ ...formData, guests: formData.guests + 1 });
    } else if (action === 'decrement' && formData.guests > 1) {
      setFormData({ ...formData, guests: formData.guests - 1 });
    }
  };

  const toggleAddon = (addon) => {
    const exists = formData.addons.find(a => a.id === addon.id);
    if (exists) {
      setFormData({ ...formData, addons: formData.addons.filter(a => a.id !== addon.id) });
    } else {
      setFormData({ ...formData, addons: [...formData.addons, addon] });
    }
  };

  const formatDateForSummary = (dateString) => {
    if (!dateString) return 'Select Date';
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString + 'T12:00:00Z'); 
    return date.toLocaleDateString('en-US', options);
  };

  const isStep1Valid = formData.date !== '' && formData.time !== '';
  const addonsTotal = formData.addons.reduce((sum, item) => sum + item.price, 0);

  // --- FIREBASE SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Prepare the exact data we want to save
      const bookingData = {
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        customer: formData.name,
        userEmail: user?.email || formData.email || 'guest@example.com', // 🟢 CRITICAL: This ties it strictly to the user!
        phone: formData.phone,
        occasion: formData.occasion,
        specialRequest: formData.requests,
        addons: formData.addons,
        status: 'Confirmed', // Automatically confirm it for this demo
        createdAt: new Date().toISOString()
      };

      // 2. Save it to the "reservations" collection in Firebase
      await addDoc(collection(db, "reservations"), bookingData);

      // 3. Show the success screen
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error("Error saving reservation to Firebase: ", error);
      alert("Something went wrong while booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0b10] transition-colors duration-300 flex flex-col font-sans">
      <NavbarMain />

      {/* --- HEADER SECTION --- */}
      {!isSubmitted && (
        <section className="pt-12 pb-8 px-6 md:px-12 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          <h1 className="text-4xl md:text-[44px] font-extrabold text-gray-900 dark:text-white leading-tight mb-4 tracking-tight">
            Reserve Your Table at Fatima's Place
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-3xl leading-relaxed mb-6">
            Whether it's a quiet sunset dinner for two or a grand coastal celebration, we ensure your experience is as authentic as our flavors. Experience North Goa's finest hospitality.
          </p>
        </section>
      )}

      {/* --- MAIN CONTENT GRID --- */}
      <main className="flex-grow px-6 md:px-12 max-w-7xl mx-auto w-full pb-20">
        
        {!isSubmitted ? (
          <form id="reservation-form" onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12 lg:gap-16 items-start relative">
            
            {/* LEFT COLUMN: THE FORM */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* STEP 1: RESERVATION DETAILS */}
              <div className="animate-in slide-in-from-bottom-4 duration-500 border-t border-gray-100 dark:border-gray-800 pt-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-[#6b75f2] flex items-center justify-center font-bold text-sm">1</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reservation Details</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Date Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Select Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b75f2]" />
                      <input 
                        type="date" required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-white dark:bg-[#16171d] border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-[#6b75f2] focus:ring-2 focus:ring-indigo-50 dark:focus:ring-indigo-500/20 transition-all cursor-pointer" 
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-1"><Info size={12} /> Reservations open 30 days in advance.</p>
                  </div>

                  {/* Guests Counter */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Number of Guests</label>
                    <div className="flex items-center justify-between bg-white dark:bg-[#16171d] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
                      <button type="button" onClick={() => handleGuestsChange('decrement')} disabled={formData.guests <= 1} className="text-[#6b75f2] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 w-8 h-8 rounded-md flex items-center justify-center text-xl transition-colors disabled:opacity-50">−</button>
                      <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-sm"><Users size={16} className="text-gray-400" /> {formData.guests} Guests</div>
                      <button type="button" onClick={() => handleGuestsChange('increment')} className="text-[#6b75f2] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 w-8 h-8 rounded-md flex items-center justify-center text-xl transition-colors">+</button>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">For parties over 20, please contact us directly.</p>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Available Time Slots</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4">
                    {timeSlots.map(time => (
                      <button
                        key={time} type="button"
                        onClick={() => setFormData({...formData, time})}
                        className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all ${
                          formData.time === time 
                            ? 'bg-indigo-50 dark:bg-indigo-500/20 border-[#6b75f2] text-[#6b75f2] shadow-sm' 
                            : 'bg-white dark:bg-[#16171d] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#6b75f2] hover:text-[#6b75f2]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* STEP 2: ENHANCE YOUR BOOKING */}
              <div className={`transition-opacity duration-500 pt-8 border-t border-gray-100 dark:border-gray-800 ${!isStep1Valid ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-[#6b75f2] flex items-center justify-center font-bold text-sm">2</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enhance Your Booking</h2>
                </div>

                {/* Occasion & Requests */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Type of Occasion</label>
                    <select 
                      value={formData.occasion} onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                      className="w-full bg-white dark:bg-[#16171d] border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 px-4 text-sm outline-none focus:border-[#6b75f2] dark:text-white transition-colors"
                    >
                      <option>Casual Dining</option><option>Birthday</option><option>Anniversary</option><option>Business Meeting</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Special Requests</label>
                    <textarea 
                      rows="2" placeholder="Any allergies, dietary preferences, or specific table requests?"
                      value={formData.requests} onChange={(e) => setFormData({...formData, requests: e.target.value})}
                      className="w-full bg-white dark:bg-[#16171d] border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 px-4 text-sm outline-none focus:border-[#6b75f2] dark:text-white transition-colors resize-none" 
                    />
                  </div>
                </div>

                {/* Premium Add-ons */}
                <div className="space-y-4 mb-8">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Premium Event Add-Ons (Optional)</label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {premiumAddons.map(addon => {
                      const isSelected = formData.addons.some(a => a.id === addon.id);
                      return (
                        <div 
                          key={addon.id} onClick={() => toggleAddon(addon)}
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-[#6b75f2] bg-indigo-50/50 dark:bg-indigo-500/10' 
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16171d] hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0">
                              <addon.icon size={18} className="text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{addon.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">{addon.desc}</span>
                                <span className="text-[10px] font-bold text-[#6b75f2]">₹{addon.price.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#6b75f2] border-[#6b75f2]' : 'border-gray-300 dark:border-gray-600'}`}>
                            {isSelected && <CheckCircle size={12} className="text-white" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Contact Details inline */}
                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input type="text" required placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white dark:bg-[#16171d] border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#6b75f2] dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Phone Number</label>
                    <input type="tel" required placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white dark:bg-[#16171d] border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#6b75f2] dark:text-white" />
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: BOOKING SUMMARY CARD & SUBMIT */}
            <div className="lg:col-span-1 space-y-6">
              {/* Main Summary Card */}
              <div className="bg-white dark:bg-[#16171d] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-gray-100 dark:border-gray-800 border-t-[6px] border-t-[#6b75f2] p-8 sticky top-28">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Booking Summary</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">Review your coastal dining experience</p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <Calendar size={18} className="text-[#6b75f2]" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{formatDateForSummary(formData.date)}</p>
                      <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">Date of Reservation</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <Clock size={18} className="text-[#6b75f2]" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{formData.time || 'Select Time'}</p>
                      <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">Preferred Arrival Time</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <Users size={18} className="text-[#6b75f2]" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{formData.guests} {formData.guests === 1 ? 'Person' : 'People'}</p>
                      <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">Table Capacity</p>
                    </div>
                  </div>
                </div>

                {formData.addons.length > 0 && (
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mb-6 space-y-3">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Selected Add-ons</p>
                    {formData.addons.map(addon => (
                      <div key={addon.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{addon.title}</span>
                        <span className="font-bold text-gray-900 dark:text-white">₹{addon.price.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
                      <span className="text-gray-900 dark:text-white">Est. Add-on Total</span>
                      <span className="text-[#6b75f2]">₹{addonsTotal.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={!isStep1Valid || !formData.name || !formData.phone || isSubmitting}
                  className="w-full bg-[#ec4899] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#db2777] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Confirm Reservation"} {!isSubmitting && <ArrowRight size={18} />}
                </button>
                <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                  No immediate charge. Payment for add-ons will be included in your final bill at the restaurant.
                </p>
              </div>

              {/* Need Help Card */}
              <div className="bg-white dark:bg-[#16171d] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex items-start gap-4 sticky top-[520px]">
                <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                  <Info size={14} className="text-gray-500" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Need Help?</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Changing plans or special events?</p>
                  <a href="tel:+919876543210" className="text-xs font-bold text-[#6b75f2] hover:underline">Call us at +91 987 654 3210</a>
                </div>
              </div>

            </div>
          </form>
        ) : (
          /* --- SUCCESS SCREEN --- */
          <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-[#16171d] rounded-[40px] shadow-xl p-12 text-center animate-in zoom-in-95 duration-500 border border-gray-100 dark:border-gray-800">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={48} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Table Reserved!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8">
              Thank you, <span className="font-bold text-gray-700 dark:text-gray-200">{formData.name.split(' ')[0]}</span>. We have secured a table for {formData.guests} on {formatDateForSummary(formData.date)} at {formData.time}. A confirmation text has been sent to your phone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-3.5 bg-[#6b75f2] text-white font-bold rounded-xl hover:bg-[#5a64e1] transition-colors shadow-lg shadow-indigo-100 dark:shadow-none">
                View in Dashboard
              </Link>
              <button onClick={() => { setIsSubmitted(false); setFormData({...formData, date: '', time: '', requests: '', addons: []}); }} className="w-full sm:w-auto px-8 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                Book Another
              </button>
            </div>
          </div>
        )}

      </main>

      {/* --- INFO BANNER --- */}
      <section className="bg-gray-50 dark:bg-[#0a0b10] border-t border-gray-100 dark:border-gray-800 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-sm">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-base">Arrival Policy</h4>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">We hold tables for 15 minutes after the reservation time. Please call if you're running late. After 15 minutes, your table may be released to our waitlist.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-base">Dress Code</h4>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">Smart casual. We embrace the Goan beach vibe, but kindly request guests to refrain from swimwear in the main dining area during dinner service.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-base">Special Events</h4>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">For groups larger than 20 or private event buyouts, please email events@fatimasplace.com for customized menus and coordination.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-50 dark:bg-[#08090d] pt-20 pb-10 px-6 md:px-20 border-t border-gray-100 dark:border-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#6b75f2] rounded-full flex items-center justify-center text-white"><UtensilsCrossed size={16} /></div>
              <span className="text-xl font-bold text-indigo-600 dark:text-[#6b75f2]">Fatima's Place</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Experience the heart of Goa with every bite. Authentic flavors, coastal vibes, and warm hospitality since 1998.</p>
            <div className="flex gap-4 text-gray-400 dark:text-gray-500">
              <Instagram size={20} className="hover:text-indigo-600 dark:hover:text-[#6b75f2] cursor-pointer" />
              <Facebook size={20} className="hover:text-indigo-600 dark:hover:text-[#6b75f2] cursor-pointer" />
              <Twitter size={20} className="hover:text-indigo-600 dark:hover:text-[#6b75f2] cursor-pointer" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Explore</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 text-sm">
              <li><Link to="/menu" className="hover:text-indigo-600 dark:hover:text-[#6b75f2] cursor-pointer">Menu</Link></li>
              <li><Link to="/reservations" className="hover:text-indigo-600 dark:hover:text-[#6b75f2] cursor-pointer">Reservations</Link></li>
              <li><Link to="/offers" className="hover:text-indigo-600 dark:hover:text-[#6b75f2] cursor-pointer">Special Offers</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600 dark:hover:text-[#6b75f2] cursor-pointer">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 text-sm">
              <li className="flex items-start gap-3"><MapPin size={18} className="text-indigo-400 dark:text-indigo-500 shrink-0" /> Resort, Small,Rd,Opp Leaney , Dmello Vaddo ,Vagator,Goa 403509</li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-indigo-400 dark:text-indigo-500 shrink-0" /> +91 987 654 3210</li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-indigo-400 dark:text-indigo-500 shrink-0" /> hello@fatimasplace.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Newsletter</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Get Goan recipes and special offers delivered to your inbox.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="bg-white dark:bg-gray-900 border border-indigo-100 dark:border-gray-800 rounded-lg px-4 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-indigo-100 dark:text-white" />
              <button className="bg-[#ec4899] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#db2777] transition-colors">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 dark:text-gray-600 font-medium">
          <p>© 2026 Fatima's Place. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Reservations;