import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, Minus, ShoppingBag, ArrowRight, MapPin, Phone, Mail, UtensilsCrossed, Instagram, Facebook, Twitter 
} from 'lucide-react';
import NavbarMain from "../components/NavBarmain"; 
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext'; 

// --- FULL MENU DATA ---
const menuData = [
  { id: 1, name: "Porridge (Milk/Honey)", price: 130, category: "Breakfast", desc: "Healthy warm oats served with milk and honey." },
  { id: 2, name: "Muesli (Milk/Curd)", price: 200, category: "Breakfast", desc: "Mixed grains, nuts, and fruits with milk or curd." },
  { id: 3, name: "Cornflakes (Banana/Mix Fruit)", price: 220, category: "Breakfast", desc: "Crispy flakes topped with fresh seasonal fruits." },
  { id: 4, name: "Poha", price: 100, category: "Breakfast", desc: "Lightly spiced flattened rice with onions and peanuts." },
  { id: 5, name: "Besan Cheela", price: 100, category: "Breakfast", desc: "Nutritious savory pancakes made from gram flour." },
  { id: 6, name: "Vegetable Cutlets (2pcs)", price: 120, category: "Breakfast", desc: "Golden fried spiced vegetable patties." },
  { id: 7, name: "Masala Omelette", price: 120, category: "Breakfast", desc: "Classic Indian style spiced egg omelette." },
  { id: 8, name: "Cheese Tomato Onion Omelette", price: 140, category: "Breakfast", desc: "Fluffy eggs stuffed with cheese and fresh veggies." },
  { id: 9, name: "Goan Alle-Belle", price: 120, category: "Breakfast", desc: "Traditional Goan pancakes with coconut and jaggery." },
  { id: 10, name: "Millet Pancake", price: 110, category: "Breakfast", desc: "Healthy, gluten-free pancakes made with local millets." },
  { id: 11, name: "Goan Sausages and Chips", price: 250, tag: "Spicy", category: "Goan", desc: "Famous spicy Goan pork sausages with fries." },
  { id: 12, name: "Prawn/Fish Curry", price: 320, tag: "Classic", category: "Goan", desc: "Traditional coconut-based Goan seafood gravy." },
  { id: 13, name: "Vindaloo (Chicken/Beef/Pork)", price: 350, tag: "Extra Spicy", category: "Goan", desc: "Fiery curry with vinegar and dried red chilies." },
  { id: 14, name: "Chicken Cafreal with Chips", price: 400, category: "Goan", desc: "Chicken marinated in coriander-spice paste." },
  { id: 15, name: "Xacuti (Veg/Mushroom)", price: 280, category: "Goan", desc: "A complex blend of roasted spices and coconut." },
  { id: 16, name: "Xacuti (Chicken/Beef)", price: 350, category: "Goan", desc: "Rich and dark Goan specialty with roasted coconut." },
  { id: 17, name: "Chilly Fry (Chicken/Beef)", price: 350, category: "Goan", desc: "Spiced stir-fry with onions, chilies, and peppers." },
  { id: 18, name: "Caldin (Prawns)", price: 320, category: "Goan", desc: "Mild and creamy yellow coconut milk curry." },
  { id: 19, name: "Fish Amotik (Shark/Kite)", price: 300, category: "Goan", desc: "A sharp, spicy, and sour coastal fish curry." },
  { id: 20, name: "Goan Veg Thali", price: 320, category: "Goan", desc: "A platter featuring several local Goan veg delicacies." },
  { id: 21, name: "Dal Makhani", price: 250, category: "Indian", desc: "Black lentils slow-cooked with cream and butter." },
  { id: 22, name: "Channa Masala", price: 220, category: "Indian", desc: "Chickpeas cooked in a tangy tomato-onion gravy." },
  { id: 23, name: "Dal Fry/Dal Tadka", price: 220, category: "Indian", desc: "Yellow lentils tempered with garlic and chilies." },
  { id: 24, name: "Palak Paneer", price: 250, category: "Indian", desc: "Fresh cottage cheese cubes in thick spinach puree." },
  { id: 25, name: "Vegetable Makhanwala", price: 250, category: "Indian", desc: "Assorted vegetables in a rich, buttery tomato sauce." },
  { id: 26, name: "Chicken Makhanwala", price: 350, category: "Indian", desc: "Creamy Butter Chicken made with boneless chunks." },
  { id: 27, name: "Chicken Tikka Masala", price: 350, category: "Indian", desc: "Roasted chicken in a spicy, flavorful gravy." },
  { id: 28, name: "Chicken Korma", price: 350, category: "Indian", desc: "Chicken cooked in a mild, velvety cashew sauce." },
  { id: 29, name: "Prawns Mushroom Korma", price: 450, category: "Indian", desc: "A unique creamy blend of prawns and mushrooms." },
  { id: 30, name: "Paneer Mutter", price: 250, category: "Indian", desc: "Paneer and green peas in classic North Indian gravy." },
  { id: 31, name: "Potato Skin Garlic Sauce", price: 150, category: "Snacks", desc: "Crispy fried skins tossed in house garlic sauce." },
  { id: 32, name: "Cheese/Corn Nuggets", price: 160, category: "Snacks", desc: "Golden-fried bites with a gooey cheese center." },
  { id: 33, name: "Chicken Nuggets", price: 200, category: "Snacks", desc: "Breaded tender chicken pieces served with dip." },
  { id: 34, name: "Fish Fingers", price: 250, category: "Snacks", desc: "Strips of fresh fish, crumbed and deep fried." },
  { id: 35, name: "Kathi Roll", price: 110, category: "Snacks", desc: "Street-style wrap with spiced fillings." },
  { id: 36, name: "French Fries", price: 120, category: "Snacks", desc: "Perfectly salted and crispy golden fries." },
  { id: 37, name: "Veggie Burger", price: 180, category: "Snacks", desc: "Veggie patty with lettuce, tomato, and mayo." },
  { id: 38, name: "Cheese Burger", price: 220, category: "Snacks", desc: "Juicy beef/chicken patty topped with cheese." },
  { id: 39, name: "Chicken Zinger Burger", price: 220, category: "Snacks", desc: "Extra crispy spicy chicken fillet in a bun." },
  { id: 40, name: "Grilled Ham Sandwich", price: 160, category: "Snacks", desc: "Classic toasted sandwich with savory ham." },
  { id: 41, name: "Sea Food Mix Plate", price: 900, category: "Continental", desc: "Premium mix of fried and grilled coastal seafood." },
  { id: 42, name: "Fish Ala Portuguese", price: 700, category: "Continental", desc: "Traditional Portuguese-style fish preparation." },
  { id: 43, name: "Fish Fillet Garlic Butter", price: 700, category: "Continental", desc: "Served with choice of chips or mashed potato." },
  { id: 44, name: "Fish Peri Peri", price: 700, category: "Continental", desc: "Fish marinated in spicy African chili." },
  { id: 45, name: "Prawns Garlic Mushroom", price: 600, category: "Continental", desc: "Fresh prawns in a rich mushroom cream sauce." },
  { id: 46, name: "Beef Steak Mushroom", price: 550, category: "Continental", desc: "Served with chips/mashed potato and salad." },
  { id: 47, name: "Beef Steak Red Wine", price: 550, category: "Continental", desc: "Tender steak in a red wine reduction." },
  { id: 48, name: "Chicken Breast Steak", price: 400, category: "Continental", desc: "Grilled chicken breast with seasonal sides." },
  { id: 49, name: "Beef Stroganoff", price: 450, category: "Continental", desc: "Sautéed beef strips in a creamy sauce." },
  { id: 50, name: "Veg Stroganoff", price: 400, category: "Continental", desc: "Mixed veggies in a creamy Continental sauce." }
];

const Menu = () => {
  const { cartItems, addToCart, removeFromCart, subtotal, searchQuery } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("All");

  const handleCheckoutClick = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  const filteredMenu = menuData.filter(item => {
    const matchesCategory = activeTab === "All" || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes((searchQuery || '').toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0a0b10] transition-colors duration-300 font-sans">
      <NavbarMain />

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* --- LEFT SIDE: MENU LIST --- */}
        <div className="flex-1">
          
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Fatima's Menu</h1>
            {searchQuery && <p className="text-gray-400 mt-2 font-medium">Showing results for "{searchQuery}"</p>}
          </div>

          {/* CATEGORY FILTERS */}
          <div className="flex flex-wrap gap-2 mb-10">
            {["All", "Breakfast", "Goan", "Indian", "Snacks", "Continental"].map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveTab(cat)} 
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === cat 
                  ? 'bg-[#6b75f2] text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                  : 'bg-white dark:bg-[#16171d] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* MENU GRID */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMenu.map(item => (
              <div key={item.id} className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                <div className="h-44 bg-gray-50 dark:bg-gray-900 rounded-2xl mb-4 relative overflow-hidden">
                  {item.tag && (
                    <div className="absolute top-3 left-3 z-10 bg-white/95 dark:bg-black/80 px-3 py-1.5 rounded-lg text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest shadow-sm">
                      {item.tag}
                    </div>
                  )}
                  <img 
                    src={`/assets/${item.id}.png`} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"; }}
                  />
                </div>

                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight w-2/3">{item.name}</h3>
                  <span className="font-black text-[#6b75f2] text-sm">₹{item.price}</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 flex-grow leading-relaxed">{item.desc}</p>
                
                <button 
                  onClick={() => addToCart(item)} 
                  className="w-full bg-indigo-50 dark:bg-indigo-500/10 text-[#6b75f2] font-bold py-3.5 rounded-xl hover:bg-[#6b75f2] hover:text-white transition-all text-xs flex items-center justify-center gap-2 active:scale-95"
                >
                  <Plus size={16} /> Add to Order
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT SIDE: CART SIDEBAR --- */}
        <aside className="w-full lg:w-[380px]">
          <div className="bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 shadow-xl sticky top-24">
            <h2 className="font-black text-2xl text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <ShoppingBag size={24} className="text-[#6b75f2]" /> Your Order
            </h2>
            
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <img 
                      src={`/assets/${item.id}.png`} 
                      className="w-full h-full object-cover" 
                      alt={item.name}
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100"; }} 
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">{item.name}</h4>
                    <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mt-1 block">₹{item.price}</span>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl p-1.5 shrink-0">
                    <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-rose-500 transition-all shadow-sm">
                      <Minus size={12} strokeWidth={3} />
                    </button>
                    <span className="text-xs font-black text-gray-900 dark:text-white w-2 text-center">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-emerald-500 transition-all shadow-sm">
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
              
              {cartItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-gray-700">
                    <ShoppingBag size={24} />
                  </div>
                  <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Your cart is empty</p>
                  <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Add some delicious items!</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-end mb-6">
                <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Subtotal</span>
                <span className="font-black text-gray-900 dark:text-white text-3xl tracking-tighter">₹{subtotal}</span>
              </div>
              
              <button 
                onClick={handleCheckoutClick} 
                disabled={cartItems.length === 0} 
                className="w-full bg-[#6b75f2] text-white py-5 rounded-2xl font-black text-lg flex justify-center items-center gap-3 shadow-lg shadow-indigo-500/30 dark:shadow-none hover:bg-[#5a64e1] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white dark:bg-[#16171d] pt-20 pb-10 px-6 md:px-20 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#6b75f2] rounded-full flex items-center justify-center text-white"><UtensilsCrossed size={16} /></div>
              <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Fatima's Place</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Experience the heart of Goa with every bite. Authentic flavors, coastal vibes, and warm hospitality since 1998.</p>
            <div className="flex gap-4 text-gray-400 dark:text-gray-500">
              <Instagram size={20} className="hover:text-[#6b75f2] cursor-pointer transition-colors" />
              <Facebook size={20} className="hover:text-[#6b75f2] cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-[#6b75f2] cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Explore</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
              <li><Link to="/menu" className="hover:text-[#6b75f2] transition-colors">Menu</Link></li>
              <li><Link to="/reservations" className="hover:text-[#6b75f2] transition-colors">Reservations</Link></li>
              <li><Link to="/offers" className="hover:text-[#6b75f2] transition-colors">Special Offers</Link></li>
              <li><Link to="/contact" className="hover:text-[#6b75f2] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
              <li className="flex items-start gap-3"><MapPin size={18} className="text-[#6b75f2] shrink-0" /> Resort, Small Rd, Opp Leaney, Dmello Vaddo, Vagator, Goa</li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-[#6b75f2] shrink-0" /> +91 987 654 3210</li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-[#6b75f2] shrink-0" /> hello@fatimasplace.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Newsletter</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-medium">Get Goan recipes and special offers delivered to your inbox.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="bg-gray-50 dark:bg-[#0a0b10] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#6b75f2] dark:text-white transition-colors" />
              <button className="bg-[#6b75f2] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#5a64e1] transition-colors">Join</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
          <p>© 2026 Fatima's Place. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Menu;