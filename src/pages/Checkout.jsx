import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Minus, Trash2, Truck, ChevronRight, MapPin, CheckCircle2, PlusCircle, Palmtree, 
  Instagram, Facebook, Twitter, Mail, Phone, X, UtensilsCrossed
} from 'lucide-react';
import NavbarMain from "../components/NavbarMain";
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, addToCart, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States for Checkout logic
  const [orderType, setOrderType] = useState('delivery'); 
  const [tableNumber, setTableNumber] = useState(''); 
  
  const [addresses, setAddresses] = useState([]); 
  const [selectedAddressId, setSelectedAddressId] = useState(null); 
  
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: 'Home', text: '', pincode: '' });

  const gst = Math.round(subtotal * 0.18);
  const packagingCharges = subtotal > 0 ? 20 : 0;
  const deliveryFee = orderType === 'dine-in' ? 0 : (subtotal > 1500 ? 0 : (subtotal > 0 ? 45 : 0));
  const total = subtotal + gst + deliveryFee + packagingCharges;

  const isOrderReady = cartItems.length > 0 && (orderType === 'delivery' ? selectedAddressId !== null : tableNumber.trim() !== '');

  const handleSaveAddress = (e) => {
    e.preventDefault();
    const newId = Date.now().toString(); 
    const addressObject = { id: newId, ...newAddress };
    
    setAddresses([...addresses, addressObject]); 
    setSelectedAddressId(newId); 
    setShowAddressModal(false); 
    setNewAddress({ type: 'Home', text: '', pincode: '' }); 
  };

  const handleProceedToPayment = () => {
    if (!isOrderReady) return;

    // Pass the order details to the payment page via router state
    navigate('/payment', { 
      state: { 
        orderType, 
        tableNumber, 
        selectedAddressId,
        totalAmount: total
      } 
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col relative font-sans">
      <NavbarMain />

      {/* ADDRESS MODAL POPUP */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">Add New Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveAddress} className="space-y-5">
              <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                {['Home', 'Work', 'Other'].map(type => (
                  <button 
                    key={type} type="button" 
                    onClick={() => setNewAddress({...newAddress, type})}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${newAddress.type === type ? 'bg-white text-[#6b75f2] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 ml-1">Complete Address</label>
                <textarea 
                  required rows="3"
                  placeholder="House/Flat No., Building Name, Street, Landmark"
                  value={newAddress.text}
                  onChange={(e) => setNewAddress({...newAddress, text: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:border-[#6b75f2] focus:bg-white outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 ml-1">Pincode</label>
                <input 
                  required type="text" maxLength="6"
                  placeholder="e.g. 403516"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value.replace(/\D/g, '')})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#6b75f2] focus:bg-white outline-none transition-colors"
                />
              </div>

              <button type="submit" className="w-full bg-[#6b75f2] text-white py-3.5 rounded-xl font-bold hover:bg-[#5a64e1] transition-colors mt-2">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-10 flex-grow w-full">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Checkout</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Order ID: <span className="text-gray-900">#FP-99214-G</span>
            </span>
            <span className="bg-indigo-50 text-[#6b75f2] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              Active Session
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN: ITEMS & ADDRESS */}
          <div className="flex-1 space-y-12">
            
            <div className="flex gap-4">
              <button onClick={() => setOrderType('delivery')} className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${orderType === 'delivery' ? 'border-[#6b75f2] bg-indigo-50/10 text-[#6b75f2]' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}>
                <Truck size={20}/> Delivery
              </button>
              <button onClick={() => setOrderType('dine-in')} className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${orderType === 'dine-in' ? 'border-[#6b75f2] bg-indigo-50/10 text-[#6b75f2]' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}>
                <UtensilsCrossed size={20}/> Dine-In
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-indigo-50 text-[#6b75f2] flex items-center justify-center font-bold text-sm border border-indigo-100">1</span>
                  <h2 className="text-2xl font-bold text-gray-900">Review Items</h2>
                </div>
                <Link to="/menu" className="text-[#6b75f2] text-sm font-bold flex items-center gap-1 hover:underline">
                  Add More Items <ChevronRight size={16} />
                </Link>
              </div>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-6 flex gap-6 items-center shadow-sm">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                      <img src={`/assets/${item.id}.png`} className="w-full h-full object-cover" alt={item.name} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=150"; }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                        <span className="font-bold text-[#6b75f2] text-lg">₹{item.price * item.qty}</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-1">{item.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1 px-2 border border-gray-100">
                          <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-white rounded-lg transition-all"><Minus size={14} /></button>
                          <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                          <button onClick={() => addToCart(item)} className="p-1 hover:bg-white rounded-lg transition-all"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-rose-500 text-xs font-bold flex items-center gap-1 hover:opacity-80"><Trash2 size={14} /> Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
                {cartItems.length === 0 && (
                  <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400">
                    Your cart is empty. <Link to="/menu" className="text-[#6b75f2] font-bold">Go back to menu</Link>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8 rounded-full bg-indigo-50 text-[#6b75f2] flex items-center justify-center font-bold text-sm border border-indigo-100">2</span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {orderType === 'delivery' ? 'Delivery Address' : 'Table Details'}
                </h2>
              </div>

              {orderType === 'delivery' ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} onClick={() => setSelectedAddressId(addr.id)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col ${selectedAddressId === addr.id ? 'border-[#6b75f2] bg-indigo-50/10 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className={selectedAddressId === addr.id ? 'text-[#6b75f2]' : 'text-gray-500'} />
                          <span className="font-bold text-gray-900 text-sm">{addr.type}</span>
                        </div>
                        {selectedAddressId === addr.id && <CheckCircle2 size={18} className="text-[#6b75f2]" />}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-2 flex-grow">{addr.text}</p>
                      <p className="text-xs font-bold text-gray-400 mb-4">Pincode: {addr.pincode}</p>
                      <div className="text-right mt-auto"><button className="text-[#6b75f2] text-[11px] font-bold hover:underline">Edit Details</button></div>
                    </div>
                  ))}
                  <div onClick={() => setShowAddressModal(true)} className={`p-5 rounded-2xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors min-h-[140px] ${addresses.length === 0 ? 'md:col-span-2 py-12' : ''}`}>
                    <PlusCircle size={24} className="text-[#6b75f2] mb-3" />
                    <span className="text-sm font-bold text-gray-700">Add New Address</span>
                    {addresses.length === 0 && <span className="text-xs text-gray-400 mt-1">Please add an address to continue</span>}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm max-w-md">
                  <label className="block text-sm font-bold text-gray-900 mb-3">What is your Table Number?</label>
                  <p className="text-xs text-gray-500 mb-4">Look for the small metal plaque on your table (e.g., "04").</p>
                  <input 
                    type="text" 
                    placeholder="Enter table number..." 
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm font-bold focus:border-[#6b75f2] focus:bg-white outline-none transition-colors"
                  />
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="w-full lg:w-[400px] space-y-8">
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Price Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>GST (18%)</span>
                  <span className="font-bold text-gray-900">₹{gst}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-gray-900">
                      {deliveryFee === 0 && subtotal > 0 ? <span className="text-green-500 mr-1">Free</span> : `₹${deliveryFee}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Packaging Charges</span>
                  <span className="font-bold text-gray-900">₹{packagingCharges}</span>
                </div>
                <div className="h-px bg-gray-100 my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Grand Total</span>
                  <span className="text-2xl font-black text-[#6b75f2]">₹{total}</span>
                </div>
              </div>

              {/* ROUTE TO PAYMENT PAGE */}
              <button 
                onClick={handleProceedToPayment}
                disabled={!isOrderReady}
                className="w-full bg-[#6b75f2] text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-[#5a64e1] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mb-4"
              >
                {!isOrderReady ? "Complete Details to Continue" : "Proceed to Payment"} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 pt-16 pb-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center md:justify-start">
               <Palmtree className="text-[#6b75f2]" size={24} /> 
               <span className="font-bold text-[#6b75f2] text-xl">Fatima's Place</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">Experience the heart of Goa with every bite. Authentic flavors, coastal vibes, and warm hospitality since 1998.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;