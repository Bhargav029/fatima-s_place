import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Minus, Trash2, CreditCard, Truck, Info, 
  ChevronRight, Smartphone, MapPin, CheckCircle2, PlusCircle, Palmtree, Instagram, Facebook, Twitter, Mail, Phone, X
} from 'lucide-react';
import NavbarMain from "../components/NavbarMain";
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, addToCart, removeFromCart, subtotal } = useCart();
  
  // States for Checkout logic
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [addresses, setAddresses] = useState([]); // Array to store user's addresses
  const [selectedAddressId, setSelectedAddressId] = useState(null); // Which address is selected
  
  // States for the Modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: 'Home', text: '', pincode: '' });

  // Calculations
  const gst = Math.round(subtotal * 0.18);
  const packagingCharges = subtotal > 0 ? 20 : 0;
  const deliveryFee = subtotal > 1500 ? 0 : (subtotal > 0 ? 45 : 0);
  const total = subtotal + gst + deliveryFee + packagingCharges;

  // Handle saving the new address
  const handleSaveAddress = (e) => {
    e.preventDefault();
    const newId = Date.now().toString(); // Generate a unique ID
    const addressObject = { id: newId, ...newAddress };
    
    setAddresses([...addresses, addressObject]); // Add to list
    setSelectedAddressId(newId); // Auto-select the newly created address
    setShowAddressModal(false); // Close modal
    setNewAddress({ type: 'Home', text: '', pincode: '' }); // Reset form
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col relative">
      <NavbarMain />

      {/* --- ADDRESS MODAL POPUP --- */}
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
              {/* Address Type Selector */}
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

              {/* Full Address Input */}
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

              {/* Pincode */}
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
        {/* Header Section */}
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
          
          {/* --- LEFT COLUMN: ITEMS & ADDRESS --- */}
          <div className="flex-1 space-y-12">
            
            {/* STEP 1: REVIEW ITEMS */}
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
                      <img 
                        src={`/assets/${item.id}.png`} 
                        className="w-full h-full object-cover" 
                        alt={item.name}
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=150"; }}
                      />
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
                        <button onClick={() => removeFromCart(item.id)} className="text-rose-500 text-xs font-bold flex items-center gap-1 hover:opacity-80">
                          <Trash2 size={14} /> Remove
                        </button>
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

            {/* STEP 2: DELIVERY ADDRESS */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8 rounded-full bg-indigo-50 text-[#6b75f2] flex items-center justify-center font-bold text-sm border border-indigo-100">2</span>
                <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                
                {/* Dynamically Render User Addresses */}
                {addresses.map((addr) => (
                  <div 
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col ${selectedAddressId === addr.id ? 'border-[#6b75f2] bg-indigo-50/10 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className={selectedAddressId === addr.id ? 'text-[#6b75f2]' : 'text-gray-500'} />
                        <span className="font-bold text-gray-900 text-sm">{addr.type}</span>
                      </div>
                      {selectedAddressId === addr.id && <CheckCircle2 size={18} className="text-[#6b75f2]" />}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2 flex-grow">
                      {addr.text}
                    </p>
                    <p className="text-xs font-bold text-gray-400 mb-4">Pincode: {addr.pincode}</p>
                    <div className="text-right mt-auto">
                      <button className="text-[#6b75f2] text-[11px] font-bold hover:underline">Edit Details</button>
                    </div>
                  </div>
                ))}

                {/* Add New Address Button */}
                <div 
                  onClick={() => setShowAddressModal(true)}
                  className={`p-5 rounded-2xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors min-h-[140px] ${addresses.length === 0 ? 'md:col-span-2 py-12' : ''}`}
                >
                  <PlusCircle size={24} className="text-[#6b75f2] mb-3" />
                  <span className="text-sm font-bold text-gray-700">Add New Address</span>
                  {addresses.length === 0 && <span className="text-xs text-gray-400 mt-1">Please add an address to continue</span>}
                </div>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN: PAYMENT & SUMMARY --- */}
          <div className="w-full lg:w-[400px] space-y-8">
            
            {/* STEP 3: Payment Method */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8 rounded-full bg-indigo-50 text-[#6b75f2] flex items-center justify-center font-bold text-sm border border-indigo-100">3</span>
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', desc: 'Pay Instantly using any UPI app', icon: <Smartphone className={paymentMethod === 'upi' ? 'text-indigo-500' : 'text-gray-400'} /> },
                  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay supported', icon: <CreditCard className={paymentMethod === 'card' ? 'text-indigo-500' : 'text-gray-400'} /> },
                  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your food arrives', icon: <Truck className={paymentMethod === 'cod' ? 'text-indigo-500' : 'text-gray-400'} /> }
                ].map((method) => (
                  <label 
                    key={method.id}
                    className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === method.id ? 'border-[#6b75f2] bg-indigo-50/10' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      className="hidden" 
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === method.id ? 'bg-[#6b75f2] text-white shadow-sm' : 'bg-gray-50'}`}>
                      {paymentMethod === method.id ? React.cloneElement(method.icon, { className: 'text-white' }) : method.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{method.label}</p>
                      <p className="text-[10px] text-gray-400">{method.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-[#6b75f2]' : 'border-gray-200'}`}>
                      {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-[#6b75f2]" />}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Summary */}
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
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-gray-900">
                    {deliveryFee === 0 && subtotal > 0 ? <span className="text-green-500 mr-1">Free</span> : `₹${deliveryFee}`}
                  </span>
                </div>
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

              {/* Promo Box */}
              {subtotal > 1500 && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-6">
                  <p className="text-[11px] text-gray-500 text-center leading-tight">
                    Free delivery applied for coastal orders above ₹1,500!
                  </p>
                </div>
              )}

              {/* Confirm Order Button - Disabled if no address is selected! */}
              <button 
                disabled={cartItems.length === 0 || !selectedAddressId}
                title={!selectedAddressId ? "Please add a delivery address" : ""}
                className="w-full bg-[#6b75f2] text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-[#5a64e1] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mb-4"
              >
                {!selectedAddressId ? "Select Address to Continue" : "Confirm Order"} <ChevronRight size={18} />
              </button>

              <p className="text-[9px] text-gray-400 text-center leading-relaxed">
                By placing this order, you agree to Fatima's Place Terms of Service and Privacy Policy. All orders are subject to kitchen availability.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-10 mt-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center md:justify-start">
               <Palmtree className="text-[#6b75f2]" size={24} /> 
               <span className="font-bold text-[#6b75f2] text-xl">Fatima's Place</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Experience the heart of Goa with every bite. Authentic flavors, coastal vibes, and warm hospitality since 1998.
            </p>
            <div className="flex gap-4 justify-center md:justify-start text-gray-400 pt-2">
              <Instagram size={18} className="hover:text-gray-900 cursor-pointer" />
              <Facebook size={18} className="hover:text-gray-900 cursor-pointer" />
              <Twitter size={18} className="hover:text-gray-900 cursor-pointer" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Explore</h4>
            <ul className="text-xs text-gray-500 space-y-3">
              <li className="hover:text-[#6b75f2] cursor-pointer">Menu</li>
              <li className="hover:text-[#6b75f2] cursor-pointer">Our Story</li>
              <li className="hover:text-[#6b75f2] cursor-pointer">Reservations</li>
              <li className="hover:text-[#6b75f2] cursor-pointer">Special Offers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
            <ul className="text-xs text-gray-500 space-y-3">
              <li className="flex items-center justify-center md:justify-start gap-2"><MapPin size={14} className="text-[#6b75f2]" /> Resort, Small,Rd,Opp Leaney , Dmello Vaddo ,Vagator,Goa 403509</li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-indigo-400 shrink-0" /> +91 987 654 3210</li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-indigo-400 shrink-0" /> hello@fatimasplace.com</li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold text-gray-900 mb-4">Newsletter</h4>
             <p className="text-xs text-gray-500 mb-3">Get Goan recipes delivered to your inbox.</p>
             <div className="flex gap-2">
               <input className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 w-full text-xs outline-none focus:border-[#6b75f2]" placeholder="Email address" />
               <button className="bg-[#ec4899] hover:bg-pink-600 transition-colors text-white px-4 py-2 rounded-lg text-xs font-bold">Join</button>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;