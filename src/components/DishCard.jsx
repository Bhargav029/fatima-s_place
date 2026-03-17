const DishCard = ({ image, price, name, description, rating }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center max-w-sm w-full relative">
    {/* Price Tag in top right corner of the card */}
    <div className="absolute top-4 right-4 bg-gray-100/70 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
      ₹{price}
    </div>
    
    {/* Product Image */}
    <div className="w-full flex justify-center h-48 mb-6 mt-6">
      <img src={image} alt={name} className="h-full object-contain" />
    </div>

    {/* Content Container to align text consistently */}
    <div className="self-start w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{name}</h3>
      
      {/* Shortened description with ellipsis */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
        {description}
      </p>

      {/* Star Rating and Add Button at the bottom */}
      <div className="flex items-center justify-between w-full border-t border-gray-100 pt-4 mt-auto">
        <div className="flex items-center text-orange-400">
          {/* Display stars based on rating */}
          {[...Array(5)].map(((_, i) => 
            <span key={i} className={`text-xl ${i < rating ? "opacity-100" : "opacity-30"}`}>★</span>
          ))}
        </div>
        
        {/* Simple round add button */}
        <button className="w-10 h-10 border border-gray-200 text-gray-400 rounded-full flex items-center justify-center font-mono hover:bg-gray-50 active:bg-gray-100 text-2xl transition">
          +
        </button>
      </div>
    </div>
  </div>
);