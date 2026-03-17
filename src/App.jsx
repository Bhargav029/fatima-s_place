import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Login from './pages/Login'; // Import the Login page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} /> {/* Add this route */}
    </Routes>
  );
}

export default App;