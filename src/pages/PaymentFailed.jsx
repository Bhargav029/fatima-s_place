import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, RefreshCcw, CreditCard, ChevronLeft, MessageCircle, 
  ShieldCheck, HelpCircle, User, Palmtree
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Pull directly from cart so we don't lose data!

const PaymentFailed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subtotal, cartItems } = useCart();

  // Standard checkout math (Matches your other pages)
  const gst = Math.round(subtotal * 0.18);
  const packagingCharges = subtotal > 0 ? 20 : 0;
  const taxesAndFees = gst + packagingCharges;
  const deliveryFee = subtotal > 1500 ? 0 : (subtotal > 0 ? 45 : 0);
  const finalTotal = subtotal + taxesAndFees + deliveryFee;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="w-1/3 hidden md:block"></div>
        <div className="flex items-center gap-2 justify-center w-full md:w-1/3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-[#6b75f2] rounded-full flex items-center justify-center text-white shadow-sm">
            <Palmtree size={16} />
          </div>
          <span className="font-extrabold text-xl text-gray-900 hidden sm:block">Fatima's Place Checkout</span>
        </div>
        <div className="flex items-center gap-4 w-1/3 justify-end">
          <HelpCircle size={20} className="text-gray-400 cursor-pointer hover:text-gray-600 hidden sm:block" />
          <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name || "Customer User"}</p>
              <p className="text-[10px] font-bold text-[#6b75f2] uppercase tracking-widest">PREMIUM MEMBER</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-[#6b75f2] flex items-center justify-center overflow-hidden shrink-0">
              {user?.image ? <img src={user.image} className="w-full h-full object-cover" /> : <User size={20} className="text-gray-400" />}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-6 py-12 flex-grow">
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Transaction Unsuccessful</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          
          {/* LEFT COLUMN: ERROR DETAILS & ACTIONS */}
          <div className="space-y-10">
            
            {/* Main Error Card */}
            <div className="bg-white border-y border-r border-gray-200 border-l-[6px] border-l-rose-500 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shrink-0 border border-rose-100">
                    <AlertCircle size={32} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Failed</h1>
                    <p className="text-gray-600 leading-relaxed">
                      The bank declined the transaction due to <span className="font-bold text-gray-900">insufficient funds</span> in your selected account, or a temporary connectivity issue.
                    </p>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button 
                    onClick={() => navigate('/payment')} // Goes back to payment selection
                    className="flex-1 bg-[#6b75f2] hover:bg-[#5a64e1] text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-indigo-100 transition-all flex justify-center items-center gap-2"
                  >
                    <RefreshCcw size={18} /> Retry Payment
                  </button>
                  <button 
                    onClick={() => navigate('/payment')} 
                    className="flex-1 bg-white border border-gray-200 text-[#6b75f2] py-4 rounded-xl font-bold text-base hover:bg-gray-50 transition-colors flex justify-center items-center gap-2"
                  >
                    <CreditCard size={18} /> Change Payment Method
                  </button>
                </div>

                {/* Card Footer Links */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100 text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Info size={14} className="text-gray-400"/> Error Reference: #TXN-9928-FAIL
                  </span>
                  <button 
                    onClick={() => navigate('/checkout')} // Allows them to change cart items
                    className="font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft size={16} /> Back to Checkout & Edit Order
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ / Help Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Why did this happen?</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><div className="w-1 h-1 bg-[#6b75f2] rounded-full mt-2 shrink-0"></div> Exceeded account balance or daily spending limit.</li>
                  <li className="flex items-start gap-2"><div className="w-1 h-1 bg-[#6b75f2] rounded-full mt-2 shrink-0"></div> Temporary connectivity issue with your bank.</li>
                  <li className="flex items-start gap-2"><div className="w-1 h-1 bg-[#6b75f2] rounded-full mt-2 shrink-0"></div> Incorrect CVV or expiry date entered.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Common Solutions</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><div className="w-1 h-1 bg-rose-400 rounded-full mt-2 shrink-0"></div> Try a different credit card or UPI method.</li>
                  <li className="flex items-start gap-2"><div className="w-1 h-1 bg-rose-400 rounded-full mt-2 shrink-0"></div> Check your internet connection and try again.</li>
                  <li className="flex items-start gap-2"><div className="w-1 h-1 bg-rose-400 rounded-full mt-2 shrink-0"></div> Wait 5 minutes before retrying the same method.</li>
                </ul>
              </div>
            </div>

            {/* Support Banner */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 shrink-0">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Still having trouble?</h4>
                  <p className="text-sm text-gray-500">Our support team is available 24/7 to assist with payment issues.</p>
                </div>
              </div>
              <button onClick={() => alert("Opening live chat...")} className="text-rose-500 border border-rose-200 hover:bg-rose-50 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shrink-0 flex items-center gap-2">
                Chat with Us <ChevronRight size={16}/>
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="w-full shrink-0">
            <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Taxes & Fees</span>
                  <span className="font-bold text-gray-900">₹{taxesAndFees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery Fee</span>
                  <span className={`font-bold ${deliveryFee === 0 ? 'text-green-500' : 'text-gray-900'}`}>
                    {deliveryFee === 0 && subtotal > 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="h-px bg-gray-100 my-4" />
                
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-base">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-900">₹{finalTotal.toFixed(2)}</span>
                    <p className="text-[9px] text-gray-400 font-bold tracking-wider mt-0.5">INC. ALL TAXES</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')} 
                className="w-full py-3.5 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Edit Order Items
              </button>
            </div>

            {/* Mock Payment Method Logos */}
            <div className="flex justify-center gap-4 mt-6 opacity-40 grayscale">
               {/* Using text/CSS shapes as safe fallbacks for logos to keep it clean */}
               <div className="w-8 h-5 border border-gray-400 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">VISA</div>
               <div className="w-8 h-5 border border-gray-400 rounded flex items-center justify-center gap-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400 -ml-1.5"></div>
               </div>
               <div className="w-8 h-5 border border-gray-400 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">UPI</div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#f8f9fa] py-8 mt-auto border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <ShieldCheck size={18} className="text-gray-700" />
            <p className="text-xs font-medium">Secure 256-bit SSL Encrypted Payments. Your data is safe with us.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-gray-500">
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Contact Support</span>
            <span className="text-gray-400 font-normal ml-0 md:ml-4">© 2026 Fatima's Place. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentFailed;