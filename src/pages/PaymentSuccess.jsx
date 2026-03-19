import React from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  HelpCircle, CheckCircle2, User, FileText, Clock3, 
  ChevronRight, ClipboardCheck, WalletCards, Download, 
  UtensilsCrossed, Palmtree, Instagram, Facebook, Twitter, Mail, Phone, MapPin, Truck
} from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Catch ALL the dynamic data passed from the Payment page
  const { orderData, orderType, cartItems, subtotal, deliveryFee, finalTotal, paymentMethod } = location.state || {};

  // Security check
  if (!orderData || !cartItems) return <Navigate to="/" />;

  // --- NEW: DYNAMIC TEXT BASED ON PAYMENT TYPE ---
  const isCOD = paymentMethod === 'cod';
  
  const pageTitle = isCOD ? "Order Placed Successfully!" : "Payment Successful!";
  const pageSubtitle = isCOD 
    ? (orderType === 'delivery' ? "Your order has been received. Please pay the delivery executive upon arrival." : "Your order has been received. Please pay the server at the counter.")
    : "Your order from Fatima's Place has been received and is being prepared with care.";
    
  const amountLabel = isCOD ? "AMOUNT TO PAY" : "PAID AMOUNT";
  const totalLabel = isCOD ? "TOTAL TO PAY" : "TOTAL PAID";
  const paymentMethodText = isCOD ? (orderType === 'delivery' ? 'Cash on Delivery' : 'Pay at Counter') : 'Online / App Payment';

  const currentDate = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', 
    hour: '2-digit', minute: '2-digit', hour12: true 
  });

  // --- DYNAMIC RECEIPT GENERATOR ---
  const handleDownloadReceipt = () => {
    const itemRows = cartItems.map(item => 
      `      ${item.qty}x ${item.name.padEnd(35, ' ')} - ₹${item.price * item.qty}`
    ).join('\n');

    const taxesAndFees = finalTotal - subtotal - deliveryFee;

    const receiptContent = `
      FATIMA'S PLACE - ORDER RECEIPT
      ===============================================
      Order ID:      ${orderData.id}
      Customer:      ${orderData.customer}
      Date:          ${currentDate}
      Order Type:    ${orderData.type}
      Payment:       ${paymentMethodText}

      YOUR ORDER:
      -----------
${itemRows}

      -----------------------------------------------
      Subtotal:                           ₹${subtotal}
      Taxes & Packaging:                  ₹${taxesAndFees}
      Delivery Fee:                       ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
      
      ${totalLabel}:                      ₹${finalTotal}
      ===============================================
      Thank you for dining with Fatima's Place!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${orderData.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      
      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="w-1/3 hidden md:block"></div>
        <div className="flex items-center gap-2 justify-center w-full md:w-1/3">
          <div className="w-8 h-8 bg-[#6b75f2] rounded-full flex items-center justify-center text-white shadow-sm">
            <UtensilsCrossed size={16} />
          </div>
          <span className="font-extrabold text-xl text-gray-900 hidden sm:block">Fatima's Place Checkout</span>
        </div>
        <div className="flex items-center gap-4 w-1/3 justify-end">
          <HelpCircle size={20} className="text-gray-400 cursor-pointer hover:text-gray-600 hidden sm:block" />
          <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-tight">{orderData.customer}</p>
              <p className="text-[10px] font-bold text-[#6b75f2] uppercase tracking-widest">PREMIUM MEMBER</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-[#6b75f2] flex items-center justify-center overflow-hidden shrink-0">
              <User size={20} className="text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16 flex-grow flex flex-col items-center">
        
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-md border border-emerald-100">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-2 text-center">{pageTitle}</h1>
        <p className="text-base font-medium text-gray-500 mb-10 max-w-lg text-center leading-relaxed">
          {pageSubtitle}
        </p>

        <div className="flex gap-16 mb-16 bg-white border border-gray-100 rounded-[24px] p-6 px-10 shadow-sm flex-col sm:flex-row items-center">
          <div className="text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{amountLabel}</p>
            <span className="text-3xl font-black text-[#6b75f2]">₹{finalTotal}</span>
          </div>
          <div className="w-full sm:w-px h-px sm:h-12 bg-gray-100" />
          <div className="text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5"><FileText size={12}/> Order ID</p>
            <span className="text-sm font-bold text-gray-900 tracking-wide">{orderData.id}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-12 w-full max-w-5xl">
          
          <div className="space-y-8">
            <div className="bg-white border border-gray-100 rounded-[24px] p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-[#6b75f2]">
                        {orderType === 'delivery' ? <Truck size={18} /> : <MapPin size={18} />}
                    </span>
                    <p className="text-sm font-medium text-gray-600 text-center sm:text-left">
                        {orderType === 'delivery' ? 'Track your delivery in real-time' : 'View order status on your dashboard'}
                    </p>
                </div>
                <button onClick={() => navigate(orderType === 'delivery' ? '/track-order' : '/dashboard')} className="text-[#6b75f2] text-sm font-bold flex items-center gap-2 hover:underline shrink-0">
                    {orderType === 'delivery' ? 'Track Order' : 'Go to Dashboard'} →
                </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <WalletCards size={20} className="text-gray-400"/>
                    <h2 className="text-xl font-bold text-gray-900">Payment Summary</h2>
                </div>
                <div className="space-y-5">
                    {[
                        { label: 'Payment Method', value: paymentMethodText, icon: WalletCards },
                        { label: 'Date & Time', value: currentDate, icon: Clock3 },
                        { label: 'Order Type', value: orderData.type, icon: UtensilsCrossed }
                    ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2.5 text-gray-500"><item.icon size={16}/> {item.label}</span>
                            <span className="font-bold text-gray-900 text-right">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={() => navigate('/dashboard')} className="w-full bg-[#6b75f2] hover:bg-[#5a64e1] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-indigo-100 transition-all flex justify-center items-center gap-3">
              View Order Details <ChevronRight size={18} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <button onClick={handleDownloadReceipt} className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 hover:bg-gray-50 transition-colors">
                    <Download size={16}/> Download Receipt
                </button>
                <button onClick={() => navigate('/')} className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors">
                    Back to Home
                </button>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm w-full lg:w-[420px] shrink-0 h-fit">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">Your Order</h2>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5"><ClipboardCheck size={12}/> CONFIRMED</span>
            </div>
            
            <div className="space-y-6 mb-8 border-b border-gray-100 pb-8">
                {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-sm gap-3">
                        <div className="flex gap-2">
                            <span className="w-5 font-medium text-gray-400">{item.qty}x</span>
                            <span className="font-bold text-gray-900 leading-tight">{item.name}</span>
                        </div>
                        <span className="font-bold text-gray-900 shrink-0">₹{item.price * item.qty}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery Fee</span>
                    <span className={`font-bold ${deliveryFee === 0 ? 'text-green-500' : 'text-gray-900'}`}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                </div>
                <div className="h-px bg-gray-100 my-4" />
                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-base">{totalLabel}</span>
                    <span className="text-2xl font-black text-[#6b75f2]">₹{finalTotal}</span>
                </div>
            </div>
          </div>
        </div>

      </main>

      <footer className="bg-white border-t border-gray-100 pt-16 pb-10 mt-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center md:justify-start">
               <Palmtree className="text-[#6b75f2]" size={24} /> 
               <span className="font-bold text-[#6b75f2] text-xl">Fatima's Place</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">Experience the heart of Goa with every bite. Authentic flavors, coastal vibes, and warm hospitality since 1998.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
            <ul className="text-xs text-gray-500 space-y-3">
              <li className="flex items-center justify-center md:justify-start gap-2"><MapPin size={14} className="text-[#6b75f2]" /> Vagator Beach Rd, Goa 403509</li>
              <li className="flex items-center gap-3 justify-center md:justify-start"><Phone size={18} className="text-indigo-400 shrink-0" /> +91 987 654 3210</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentSuccess;