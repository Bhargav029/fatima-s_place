import { useCart } from '../Context/CartContext';

const CartSidebar = () => {
  const { cartItems, subtotal, addToCart, removeFromCart } = useCart();

  return (
    <div>
      {cartItems.map(item => (
        <div key={item.id}>
           <p>{item.name} x {item.quantity}</p>
           <button onClick={() => removeFromCart(item.id)}>-</button>
           <button onClick={() => addToCart(item)}>+</button>
        </div>
      ))}
      <h3>Total: ₹{subtotal}</h3>
    </div>
  );
};