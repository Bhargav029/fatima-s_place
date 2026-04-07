import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  CreditCard, Smartphone, Wallet, Truck, Globe, 
  Lock, ShieldCheck, CheckCircle2, Palmtree, User, Info 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// --- FIREBASE IMPORTS ---
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

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
  const hasTriggered = useRef(false);

  if (!location.state) {
    return <Navigate to="/checkout" replace />;
  }

  const gst = Math.round(subtotal * 0.18);
  const packagingCharges = subtotal > 0 ? 20 : 0;
  const deliveryFee = orderType === 'dine-in' ? 0 : (subtotal > 1500 ? 0 : (subtotal > 0 ? 45 : 0));
  const finalTotal = subtotal + gst + deliveryFee + packagingCharges;

  // --- AUTO-TRIGGER RAZORPAY ---
  useEffect(() => {
    if (paymentMethod !== 'cod' && !hasTriggered.current) {
      handleCompletePayment();
      hasTriggered.current = true;
    }
  }, [paymentMethod]);

  const handleMethodChange = (method) => {
    hasTriggered.current = false; 
    setPaymentMethod(method);
  };

  const saveOrderToFirebase = async (orderData) => {
    try {
      await setDoc(doc(db, "orders", orderData.id), {
        ...orderData,
        createdAt: new Date().toISOString(),
        cartItems: cartItems 
      });
    } catch (error) {
      console.error("Error saving order to Firebase: ", error);
    }
  };

  const handleCompletePayment = async (e) => {
    if (e) e.preventDefault();
    if (isProcessing) return;

    // --- ADD THIS SAFETY CHECK ---
    if (finalTotal <= 0) {
      alert("Your cart is empty! Please add items before paying.");
      return;
    }

    const orderData = {
      id: `F-${Math.floor(10000 + Math.random() * 90000)}`, 
      customer: user?.name || 'Guest Customer',
      userEmail: user?.email || 'guest@example.com',
      items: `${cartItems.length} items`,
      status: 'Pending',
      amount: `₹${finalTotal}`,
      type: orderType === 'delivery' ? 'Delivery' : `Dine-In (T-${tableNumber})`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: paymentMethod
    };

    if (paymentMethod === 'cod') {
      await saveOrderToFirebase(orderData); 
      
      navigate('/payment-success', { 
        state: { orderData, orderType, cartItems, subtotal, deliveryFee, finalTotal, paymentMethod: 'cod' } 
      });
      
      if (clearCart) clearCart();
      return; 
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you connected to the internet?');
      setIsProcessing(false);
      return;
    }

    try {
      const createOrderUrl = `${import.meta.env.VITE_API_URL}/payment.php?action=create_order`;

      const fetchOrder = await fetch(createOrderUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal })
      });
      
      if (!fetchOrder.ok) {
        const errorText = await fetchOrder.text();
        throw new Error(`Server returned status ${fetchOrder.status}.\nDetails: ${errorText}`);
      }

      const textResponse = await fetchOrder.text();
      let order;
      try {
        order = JSON.parse(textResponse);
      } catch (parseError) {
        throw new Error(`Server did not return valid JSON.\nDetails:\n${textResponse.substring(0, 150)}...`);
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: "INR",
        name: "Fatima's Place",
        description: "Authentic Goan Cuisine Order",
        order_id: order.id,
        
        config: {
          display: {
            blocks: {
              upi: { name: "Pay via UPI", instruments: [{ method: "upi" }] },
              wallets: { name: "Mobile Wallets", instruments: [{ method: "wallet" }] }
            },
            sequence: paymentMethod === 'upi' ? ["block.upi"] : paymentMethod === 'wallet' ? ["block.wallets"] : ["block.cards", "block.upi"]
          }
        },

        handler: async function (response) {
          try {
            const verifyPaymentUrl = `${import.meta.env.VITE_API_URL}/payment.php?action=verify_payment`;

            const verifyRes = await fetch(verifyPaymentUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });
            
            if (verifyRes.ok) {
              await saveOrderToFirebase(orderData);
              
              navigate('/payment-success', { 
                state: { orderData, orderType, cartItems, subtotal, deliveryFee, finalTotal, paymentMethod: 'online' } 
              });
              
              if (clearCart) clearCart();
            } else {
              alert("Payment verification failed at the server!");
              setIsProcessing(false);
            }
          } catch (err) {
            alert(`Verification Error: ${err.message}`);
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@example.com",
          contact: user?.phone || "9999999999"
        },
        theme: { color: "#6b75f2" },
        modal: {
          ondismiss: function() {
            setIsProcessing(false); 
            hasTriggered.current = false; 
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        alert(`Razorpay Gateway Error: ${response.error.description}`);
        setIsProcessing(false);
        hasTriggered.current = false;
      });
      
      paymentObject.open();

    } catch (error) {
      alert(`🚨 CRITICAL ERROR DETECTED:\n\n${error.message}`);
      console.error("Payment setup failed:", error);
      setIsProcessing(false);
      hasTriggered.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      
      {/* Header */}
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

      {/* Main Content */}
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
          
          {/* Left Column: Payment Methods */}
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
                onClick={() => handleMethodChange(method.id)}
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

          {/* Middle Column: Payment Gateway UI */}
          <div className="flex-1">
            <div className="bg-white border border-gray-100 rounded-[32px] p-12 shadow-sm text-center min-h-[300px] flex flex-col justify-center">
              {isProcessing && paymentMethod !== 'cod' ? (
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Lock className="text-[#6b75f2]" size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Securely connecting to Razorpay...</h2>
                  <p className="text-gray-500 mt-2">Please do not refresh the page.</p>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#6b75f2]">
                    {paymentMethod === 'upi' ? <Smartphone size={32}/> : paymentMethod === 'wallet' ? <Wallet size={32}/> : paymentMethod === 'card' ? <CreditCard size={32}/> : <Truck size={32}/>}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {paymentMethod === 'cod' ? 'Pay on Arrival' : 'Online Payment'}
                  </h2>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    {paymentMethod === 'cod' 
                      ? 'You will pay the server or delivery executive when your food arrives.' 
                      : 'Click below if the secure Razorpay gateway did not open automatically.'}
                  </p>
                  <button 
                    onClick={handleCompletePayment} 
                    disabled={isProcessing} 
                    className="bg-[#6b75f2] text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-[#5a64e1] disabled:opacity-70 transition-all mx-auto block w-full sm:w-auto"
                  >
                    {paymentMethod === 'cod' ? `Confirm Order for ₹${finalTotal}` : `Open Payment Gateway`}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
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