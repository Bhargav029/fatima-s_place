import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  CreditCard, Smartphone, Wallet, Truck, Globe, 
  Lock, ShieldCheck, CheckCircle2, Palmtree, User, Info 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// --- NEW: FIREBASE IMPORTS ---
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure your firebase.js config is correct

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { orderType, tableNumber, selectedAddressId } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!location.state) {
    return <Navigate to="/checkout" replace />;
  }

  const gst = Math.round(subtotal * 0.18);
  const packagingCharges = subtotal > 0 ? 20 : 0;
  const deliveryFee = orderType === 'dine-in' ? 0 : (subtotal > 1500 ? 0 : (subtotal > 0 ? 45 : 0));
  const finalTotal = subtotal + gst + deliveryFee + packagingCharges;

  // --- NEW: SAVE ORDER TO FIREBASE FUNCTION ---
  const saveOrderToFirebase = async (orderData) => {
    try {
      // Saves the new order to a collection called "orders"
      await setDoc(doc(db, "orders", orderData.id), {
        ...orderData,
        createdAt: new Date().toISOString(),
        cartItems: cartItems // Save the actual items so the kitchen sees them!
      });
    } catch (error) {
      console.error("Error saving order to Firebase: ", error);
    }
  };

  const handleCompletePayment = async (e) => {
    if (e) e.preventDefault();
    setIsProcessing(true);

    const orderData = {
      id: `F-${Math.floor(10000 + Math.random() * 90000)}`, // Generates an ID like F-92841
      customer: user?.name || 'Guest Customer',
      items: `${cartItems.length} items`,
      status: 'Pending',
      amount: `₹${finalTotal}`,
      type: orderType === 'delivery' ? 'Delivery' : `Dine-In (T-${tableNumber})`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    // --- IF CASH ON DELIVERY / PAY AT COUNTER ---
    if (paymentMethod === 'cod') {
      await saveOrderToFirebase(orderData); // Save to cloud!
      
      navigate('/payment-success', { 
        state: { orderData, orderType, cartItems, subtotal, deliveryFee, finalTotal, paymentMethod: 'cod' } 
      });
      
      if (clearCart) clearCart();
      return;
    }

    // --- IF ONLINE PAYMENT (RAZORPAY) ---
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you connected to the internet?');
      setIsProcessing(false);
      return;
    }

    try {
      // NOTE: You STILL need your Node.js backend running for this part! 
      // Razorpay requires a secure backend to generate the order ID.
      const fetchOrder = await fetch('http://localhost:4000/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal })
      });
      const order = await fetchOrder.json();

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', 
        amount: order.amount,
        currency: "INR",
        name: "Fatima's Place",
        description: "Authentic Goan Cuisine Order",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch('http://localhost:4000/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });
          
          if (verifyRes.ok) {
            await saveOrderToFirebase(orderData); // Save to cloud!
            
            navigate('/payment-success', { 
              state: { orderData, orderType, cartItems, subtotal, deliveryFee, finalTotal, paymentMethod: 'online' } 
            });
            
            if (clearCart) clearCart();
          } else {
            navigate('/payment-failed');
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@example.com",
          contact: user?.phone || "9999999999"
        },
        theme: { color: "#6b75f2" }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function () {
        navigate('/payment-failed');
      });
      
      paymentObject.open();
      setIsProcessing(false); 

    } catch (error) {
      console.error("Payment setup failed:", error);
      navigate('/payment-failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      
      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="w-24 hidden md:block"></div> 
        
        <div className="flex items-center gap-2 justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
          <div className="w-8 h-8 bg-[#6b75f2] rounded-full flex items-center justify-center text-white shadow-sm">
            <Palmtree size={16} />
          </div>
          <span className="font-extrabold text-xl text-[#6b75f2] hidden sm:block">Fatima's Place Checkout</span>
        </div>

        <div className="flex items-center gap-3 pl-4 ml-auto md:ml-0">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name || "Guest"}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Premium Member</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
            {user?.image ? <img src={user.image} className="w-full h-full object-cover" alt="User" /> : <User size={16} className="text-gray-400" />}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-6 py-10 flex-grow">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-1">Online Payment</h1>
            <p className="text-sm font-medium text-gray-500">Select your preferred method and complete order</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hidden sm:flex">
            <ShieldCheck size={16} className="text-gray-600" />
            <span className="text-xs font-bold text-gray-700 tracking-wider uppercase">SSL Secured</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="w-full lg:w-64 shrink-0 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Payment Categories</p>
            {[
              { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
              { id: 'upi', label: 'UPI & QR Pay', icon: Smartphone },
              { id: 'wallet', label: 'Mobile Wallets', icon: Wallet },
              { id: 'cod', label: orderType === 'delivery' ? 'Cash on Delivery' : 'Pay at Counter', icon: Truck },
            ].map((method) => (
              <button 
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-sm transition-all border ${
                  paymentMethod === method.id 
                    ? 'bg-white border-[#6b75f2] text-[#6b75f2] shadow-sm' 
                    : 'bg-transparent border-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <method.icon size={18} /> {method.label}
                </div>
                {paymentMethod === method.id && <CheckCircle2 size={16} />}
              </button>
            ))}
          </div>

          <div className="flex-1">
            {paymentMethod === 'card' && (
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Card Information</h2>
                    <p className="text-sm text-gray-500">Safe and secure credit or debit card entry.</p>
                  </div>
                  <Lock size={20} className="text-gray-400 hidden sm:block" />
                </div>

                <form onSubmit={handleCompletePayment} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Card Number</label>
                    <div className="relative">
                      <input type="text" placeholder="0000 0000 0000 0000" required maxLength="19" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-16 py-3.5 text-sm font-medium focus:border-[#6b75f2] focus:bg-white outline-none transition-colors" />
                      <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Expiry Date</label>
                      <input type="text" placeholder="MM / YY" required maxLength="5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:border-[#6b75f2] focus:bg-white outline-none transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1">CVV <Info size={12} className="text-gray-400"/></label>
                      <div className="relative">
                        <input type="password" placeholder="•••" required maxLength="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:border-[#6b75f2] focus:bg-white outline-none transition-colors" />
                        <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Cardholder Name</label>
                    <input type="text" placeholder={user?.name?.toUpperCase() || "CARDHOLDER NAME"} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium uppercase focus:border-[#6b75f2] focus:bg-white outline-none transition-colors" />
                  </div>

                  <div className="pt-8">
                    <button type="submit" disabled={isProcessing} className="w-full bg-[#6b75f2] text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-[#5a64e1] disabled:opacity-70 transition-all flex justify-center items-center gap-2">
                      {isProcessing ? "Processing Secure Payment..." : `Pay ₹${finalTotal}`}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {paymentMethod !== 'card' && (
              <div className="bg-white border border-gray-100 rounded-[32px] p-12 shadow-sm text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#6b75f2]">
                  {paymentMethod === 'upi' ? <Smartphone size={32}/> : paymentMethod === 'wallet' ? <Wallet size={32}/> : <Truck size={32}/>}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {paymentMethod === 'upi' ? 'Pay via UPI' : paymentMethod === 'wallet' ? 'Redirecting to Wallet...' : 'Pay on Arrival'}
                </h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                  {paymentMethod === 'cod' ? 'You will pay the server or delivery executive when your food arrives.' : 'Complete the payment using the secure Razorpay gateway.'}
                </p>
                <button onClick={handleCompletePayment} disabled={isProcessing} className="bg-[#6b75f2] text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-[#5a64e1] transition-all w-full sm:w-auto">
                  {isProcessing ? "Processing..." : (paymentMethod === 'cod' ? `Confirm Order for ₹${finalTotal}` : `Confirm & Pay ₹${finalTotal}`)}
                </button>
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Taxes & Fees</span>
                  <span className="font-bold text-gray-900">₹{gst + packagingCharges}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-gray-900">
                      {deliveryFee === 0 && subtotal > 0 ? <span className="text-green-500">FREE</span> : `₹${deliveryFee}`}
                    </span>
                  </div>
                )}
                <div className="h-px bg-gray-100 my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-900">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              <button onClick={() => navigate('/checkout')} className="w-full py-3.5 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                Back to Checkout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;