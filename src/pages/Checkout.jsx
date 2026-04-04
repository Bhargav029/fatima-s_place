import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Minus, Trash2, Truck, ChevronRight, MapPin, CheckCircle2, PlusCircle, 
  X, UtensilsCrossed
} from 'lucide-react';
import NavbarMain from "../components/NavBarmain";
import Footer from "../components/Footer";
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, addToCart, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States for Checkout logic
  const [orderType, setOrderType] = useState('delivery'); 
  const [selectedTables, setSelectedTables] = useState([]); 
  
  const [addresses, setAddresses] = useState([]); 
  const [selectedAddressId, setSelectedAddressId] = useState(null); 
  
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: 'Home', text: '', pincode: '' });

  const gst = Math.round(subtotal * 0.18);
  const packagingCharges = subtotal > 0 ? 20 : 0;
  const deliveryFee = orderType === 'dine-in' ? 0 : (subtotal > 1500 ? 0 : (subtotal > 0 ? 45 : 0));
  const total = subtotal + gst + deliveryFee + packagingCharges;

  // Validation logic
  const isOrderReady = cartItems.length > 0 && (orderType === 'delivery' ? selectedAddressId !== null : selectedTables.length > 0);

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

    navigate('/payment', { 
      state: { 
        orderType, 
        tableNumber: selectedTables.join(', '), 
        selectedAddressId,
        totalAmount: total
      } 
    });
  };

  // --- RESTAURANT 9-TABLE LAYOUT ---
  const tables = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  // Mock occupied tables (Greyed out)
  const occupiedTables = ['3', '7'];

  const handleTableClick = (tableId) => {
    if (occupiedTables.includes(tableId)) return;
    setSelectedTables((prev) =>
      prev.includes(tableId)
        ? prev.filter((t) => t !== tableId)
        : [...prev, tableId]
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0b10] flex flex-col relative font-sans transition-colors duration-300">
      <NavbarMain />

      {/* ADDRESS MODAL POPUP */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#16171d] rounded-[32px] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200 border border-transparent dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Add New Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveAddress} className="space-y-5">
              <div className="flex gap-2 p-1 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                {['Home', 'Work', 'Other'].map(type => (
                  <button 
                    key={type} type="button" 
                    onClick={() => setNewAddress({...newAddress, type})}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${newAddress.type === type ? 'bg-white dark:bg-[#16171d] text-[#6b75f2] shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
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
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-[#6b75f2] dark:focus:border-[#6b75f2] focus:bg-white dark:focus:bg-[#16171d] outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 ml-1">Pincode</label>
                <input 
                  required type="text" maxLength="6"
                  placeholder="e.g. 403516"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value.replace(/\D/g, '')})}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-[#6b75f2] dark:focus:border-[#6b75f2] focus:bg-white dark:focus:bg-[#16171d] outline-none transition-colors"
                />
              </div>

              <button type="submit" className="w-full bg-[#6b75f2] text-white py-3.5 rounded-xl font-bold hover:bg-[#5a64e1] transition-colors mt-2 active:scale-[0.98]">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-10 flex-grow w-full">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Checkout</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Order ID: <span className="text-gray-900 dark:text-gray-300">#FP-99214-G</span>
            </span>
            <span className="bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              Active Session
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN: ITEMS & ADDRESS/SEATING */}
          <div className="flex-1 space-y-12">
            
            <div className="flex gap-4">
              <button onClick={() => setOrderType('delivery')} className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${orderType === 'delivery' ? 'border-[#6b75f2] bg-indigo-50/10 dark:bg-indigo-500/10 text-[#6b75f2]' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-[#16171d] text-gray-400 hover:border-gray-200 dark:hover:border-gray-700'}`}>
                <Truck size={20}/> Delivery
              </button>
              <button onClick={() => setOrderType('dine-in')} className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${orderType === 'dine-in' ? 'border-[#6b75f2] bg-indigo-50/10 dark:bg-indigo-500/10 text-[#6b75f2]' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-[#16171d] text-gray-400 hover:border-gray-200 dark:hover:border-gray-700'}`}>
                <UtensilsCrossed size={20}/> Dine-In
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] flex items-center justify-center font-bold text-sm border border-indigo-100 dark:border-indigo-500/20">1</span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Items</h2>
                </div>
                <Link to="/menu" className="text-[#6b75f2] text-sm font-bold flex items-center gap-1 hover:underline">
                  Add More Items <ChevronRight size={16} />
                </Link>
              </div>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 flex gap-6 items-center shadow-sm">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 shrink-0 border border-gray-100 dark:border-gray-800">
                      <img src={`/assets/${item.id}.png`} className="w-full h-full object-cover" alt={item.name} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=150"; }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{item.name}</h3>
                        <span className="font-bold text-[#6b75f2] text-lg">₹{item.price * item.qty}</span>
                      </div>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 line-clamp-1">{item.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-1 px-2 border border-gray-100 dark:border-gray-800">
                          <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all"><Minus size={14} /></button>
                          <span className="font-bold text-sm w-4 text-center dark:text-white">{item.qty}</span>
                          <button onClick={() => addToCart(item)} className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-rose-500 text-xs font-bold flex items-center gap-1 hover:opacity-80"><Trash2 size={14} /> Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
                {cartItems.length === 0 && (
                  <div className="bg-white dark:bg-[#16171d] border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center text-gray-400 dark:text-gray-500">
                    Your cart is empty. <Link to="/menu" className="text-[#6b75f2] font-bold hover:underline">Go back to menu</Link>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] flex items-center justify-center font-bold text-sm border border-indigo-100 dark:border-indigo-500/20">2</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orderType === 'delivery' ? 'Delivery Address' : 'Table Details'}
                </h2>
              </div>

              {orderType === 'delivery' ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} onClick={() => setSelectedAddressId(addr.id)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col ${selectedAddressId === addr.id ? 'border-[#6b75f2] bg-indigo-50/10 dark:bg-indigo-500/10 shadow-sm' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#16171d] hover:border-gray-300 dark:hover:border-gray-700'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className={selectedAddressId === addr.id ? 'text-[#6b75f2]' : 'text-gray-500'} />
                          <span className="font-bold text-gray-900 dark:text-white text-sm">{addr.type}</span>
                        </div>
                        {selectedAddressId === addr.id && <CheckCircle2 size={18} className="text-[#6b75f2]" />}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2 flex-grow">{addr.text}</p>
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-4">Pincode: {addr.pincode}</p>
                      <div className="text-right mt-auto"><button className="text-[#6b75f2] text-[11px] font-bold hover:underline">Edit Details</button></div>
                    </div>
                  ))}
                  <div onClick={() => setShowAddressModal(true)} className={`p-5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-[#16171d] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-700 transition-colors min-h-[140px] ${addresses.length === 0 ? 'md:col-span-2 py-12' : ''}`}>
                    <PlusCircle size={24} className="text-[#6b75f2] mb-3" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Add New Address</span>
                    {addresses.length === 0 && <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">Please add an address to continue</span>}
                  </div>
                </div>
              ) : 
              (
                <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-[32px] p-6 shadow-sm overflow-hidden">
                  
                  {/* Legend */}
                  <div className="flex justify-center gap-6 mb-8 pt-4 pb-6 border-b border-gray-50 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-4 h-4 rounded border-2 border-[#6b75f2] bg-white dark:bg-transparent"></div> Available
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-4 h-4 rounded bg-[#6b75f2]"></div> Selected
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700"></div> Occupied
                    </div>
                  </div>

                  {/* 3x3 Table Grid */}
                  <div className="flex justify-center pb-6">
                    <div className="grid grid-cols-3 gap-4 md:gap-6">
                      {tables.map((tableId) => {
                        const isOccupied = occupiedTables.includes(tableId);
                        const isSelected = selectedTables.includes(tableId);

                        return (
                          <button
                            key={tableId}
                            disabled={isOccupied}
                            onClick={() => handleTableClick(tableId)}
                            className={`
                              w-16 h-16 md:w-20 md:h-20 rounded-2xl text-lg md:text-xl font-black transition-all flex items-center justify-center
                              ${isOccupied 
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border-transparent shadow-inner' 
                                : isSelected 
                                  ? 'bg-[#6b75f2] text-white border-[#6b75f2] shadow-lg shadow-[#6b75f2]/30 scale-105' 
                                  : 'bg-white dark:bg-[#16171d] border-2 border-[#6b75f2] text-[#6b75f2] hover:bg-[#6b75f2]/10'
                              }
                            `}
                          >
                            T{tableId}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-center text-xs text-gray-400">
                    Front Entrance / Counter Area
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="w-full lg:w-[400px] space-y-8">
            <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Price Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>GST (18%)</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{gst}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {deliveryFee === 0 && subtotal > 0 ? <span className="text-emerald-500 dark:text-emerald-400 mr-1">Free</span> : `₹${deliveryFee}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Packaging Charges</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{packagingCharges}</span>
                </div>
                
                {/* Show selected tables in summary if Dine-In */}
                {orderType === 'dine-in' && selectedTables.length > 0 && (
                  <div className="flex justify-between text-sm text-[#6b75f2] bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-xl mt-4">
                    <span className="font-bold">Table(s) Selected</span>
                    <span className="font-bold text-right">{selectedTables.map(t => `T${t}`).join(', ')}</span>
                  </div>
                )}

                <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-white">Grand Total</span>
                  <span className="text-2xl font-black text-[#6b75f2]">₹{total}</span>
                </div>
              </div>

              {/* ROUTE TO PAYMENT PAGE */}
              <button 
                onClick={handleProceedToPayment}
                disabled={!isOrderReady}
                className="w-full bg-[#6b75f2] text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-[#5a64e1] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mb-4 active:scale-[0.98]"
              >
                {!isOrderReady ? "Complete Details to Continue" : "Proceed to Payment"} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;