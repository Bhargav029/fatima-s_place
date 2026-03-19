import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Login from './pages/Login'; // Import the Login page
import Settings from './pages/Settings';
import Reservation from "./pages/Reservation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} /> {/* Add this route */}
      <Route path="/settings" element={<Settings />} /> 
      <Route path="/reservations" element={<Reservation />} />
    </Routes>
  );
}

export default App;