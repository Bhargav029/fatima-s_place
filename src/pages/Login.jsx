import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Palmtree } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(); // Mark user as logged in
    navigate('/checkout'); // Send them straight to checkout
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[32px] shadow-xl max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[#6b75f2] text-white rounded-full flex items-center justify-center mx-auto mb-6">
          <Palmtree size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500 mb-8 text-sm">Sign in to complete your order</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#6b75f2] transition-colors" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#6b75f2] transition-colors" 
          />
          <button type="submit" className="w-full bg-[#6b75f2] text-white py-3 rounded-xl font-bold hover:bg-[#5a64e1] transition-colors shadow-lg shadow-indigo-100">
            Sign In & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;