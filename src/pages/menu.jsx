import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Minus, ShoppingBag, Filter, ArrowRight, Palmtree,
  Leaf, Info, PlusCircle, Instagram, Facebook, Twitter, MapPin, Phone, Mail 
} from 'lucide-react';
import NavbarMain from "../components/NavbarMain";
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext'; // Import Auth

const menuData = [
  // --- BREAKFAST ---
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

  // --- GOAN DELIGHTS ---
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

  // --- INDIAN SPECIALITY ---
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

  // --- SNACKS ---
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

  // --- CONTINENTAL ---
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
  const { isAuthenticated } = useAuth(); // Check if logged in
  const [activeTab, setActiveTab] = useState("All");
  const navigate = useNavigate();

  // The new Checkout Logic
  const handleCheckoutClick = () => {
    if (isAuthenticated) {
      navigate('/checkout'); // If logged in, go to payment
    } else {
      navigate('/login'); // If NOT logged in, go to login screen
    }
  };

  const filteredMenu = menuData.filter(item => {
    const matchesCategory = activeTab === "All" || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <NavbarMain />

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* --- MENU LIST --- */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Fatima's Menu</h1>
            {searchQuery && <p className="text-gray-400 mt-2">Showing results for "{searchQuery}"</p>}
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {["All", "Breakfast", "Goan", "Indian", "Snacks", "Continental"].map(cat => (
              <button key={cat} onClick={() => setActiveTab(cat)} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${activeTab === cat ? 'bg-[#6b75f2] text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>{cat}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredMenu.map(item => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-[32px] p-5 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                {/* IMAGE CONTAINER */}
                <div className="h-44 bg-gray-50 rounded-2xl mb-4 relative overflow-hidden">
                  {item.tag && (
                    <div className="absolute top-3 left-3 z-10 bg-white/90 px-3 py-1 rounded-lg text-[10px] font-bold text-orange-600 uppercase tracking-tighter shadow-sm">{item.tag}</div>
                  )}
                  <img 
                    src={`/assets/${item.id}.png`} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"; }}
                  />
                </div>

                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight w-2/3">{item.name}</h3>
                  <span className="font-bold text-[#6b75f2] text-sm">₹{item.price}</span>
                </div>
                <p className="text-[11px] text-gray-400 mb-6 flex-grow">{item.desc}</p>
                
                <button onClick={() => addToCart(item)} className="w-full bg-[#fbe7e0] text-[#e9916b] font-bold py-3 rounded-2xl hover:bg-[#e9916b] hover:text-white transition-all text-xs flex items-center justify-center gap-2">
                  <Plus size={16} /> Add to Order
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- CART SIDEBAR --- */}
        <aside className="w-full lg:w-[360px]">
          <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-2xl sticky top-24">
            <h2 className="font-bold text-gray-900 mb-8 pb-4 border-b">Your Order</h2>
            <div className="space-y-6 mb-10 max-h-[350px] overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  
                  {/* --- THE IMAGE --- */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                    <img 
                      src={`/assets/${item.id}.png`} 
                      className="w-full h-full object-cover" 
                      alt={item.name}
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100"; }} 
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-[11px] font-bold text-gray-800 leading-tight">{item.name}</h4>
                    <span className="text-[10px] text-gray-400">₹{item.price} x {item.qty}</span>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button onClick={() => removeFromCart(item.id)} className="p-1"><Minus size={10} /></button>
                    <span className="text-xs font-bold text-gray-700">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="p-1"><Plus size={10} /></button>
                  </div>
                </div>
              ))}
              {cartItems.length === 0 && (
                <p className="text-center text-gray-300 text-xs py-10 italic">Your cart is empty</p>
              )}
            </div>

            <div className="pt-6 border-t">
              <div className="flex justify-between mb-6">
                <span className="text-sm text-gray-400">Subtotal</span>
                <span className="font-bold text-gray-900 text-2xl tracking-tighter">₹{subtotal}</span>
              </div>
              
              {/* UPDATED BUTTON */}
              <button 
                onClick={handleCheckoutClick} 
                disabled={cartItems.length === 0} 
                className="w-full bg-[#6b75f2] text-white py-4 rounded-2xl font-bold flex justify-between items-center px-6 shadow-lg shadow-indigo-100 hover:bg-[#5a64e1] disabled:opacity-50 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-50/50 border-t pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center md:justify-start">
               <Palmtree className="text-[#6b75f2]" /> <span className="font-bold text-indigo-600">Fatima's Place</span>
            </div>
            <p className="text-xs text-gray-400">Authentic Goan flavors since 1998.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Explore</h4>
            <ul className="text-xs text-gray-500 space-y-2"><li>Menu</li><li>Reservations</li></ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
            <ul className="text-xs text-gray-500 space-y-2"><li>Calangute, North Goa</li><li>+91 987 654 3210</li></ul>
          </div>
          <div>
             <h4 className="font-bold text-gray-900 mb-4">Newsletter</h4>
             <div className="flex gap-2"><input className="border rounded p-2 w-full text-xs" placeholder="Email" /><button className="bg-rose-500 text-white p-2 rounded text-xs">Join</button></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Menu;