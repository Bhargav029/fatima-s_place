import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Palmtree, Mail, Lock, User, ArrowLeft, ChevronRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Input States
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [activeRole, setActiveRole] = useState('Customer');

  const handleAuth = (e) => {
    e.preventDefault();
    
    // Pass the real data to the AuthContext
    login({ 
      name: isLogin ? `${activeRole} User` : fullName, 
      email: email,
      phone: "+91 98765 43210", 
      role: activeRole.toLowerCase() // Sends 'admin', 'customer', or 'staff'
    }); 
    
    // Return to the previous page (or Home if none)
    const origin = location.state?.from || -1;
    navigate(origin); 
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center relative overflow-hidden p-6 transition-colors duration-300">
      
      <Palmtree className="absolute -left-24 top-1/4 w-[500px] h-[500px] text-gray-100/60 stroke-[0.5] -rotate-12 pointer-events-none" />
      <Palmtree className="absolute -right-24 bottom-1/4 w-[500px] h-[500px] text-gray-100/60 stroke-[0.5] rotate-12 pointer-events-none" />

      <Link to="/" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-800 mb-6 z-10 transition-colors">
        <ArrowLeft size={14} /> Back to Fatima's Place
      </Link>

      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[420px] p-8 md:p-10 z-10 border border-gray-50">
        
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 text-white bg-[#5b6aff] rounded-full shadow-sm">
            <Palmtree size={22} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-extrabold text-[#5b6aff] tracking-tight">Fatima's Place</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-[13px] text-gray-500">
            {isLogin ? 'Please enter your details to access your account' : 'Join us to experience authentic coastal dining'}
          </p>
        </div>

        {isLogin && (
          <div className="flex p-1 bg-gray-50 rounded-full mb-8 border border-gray-100">
            {['Customer', 'Staff', 'Admin'].map((role) => (
              <button 
                key={role}
                type="button"
                onClick={() => setActiveRole(role)}
                className={`flex-1 py-2 text-[11px] font-bold rounded-full transition-all ${
                  activeRole === role 
                    ? 'bg-white text-[#5b6aff] shadow-sm border border-gray-100/50' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe" 
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-[#5b6aff] focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300" 
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                required
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-[#5b6aff] focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-[#5b6aff] focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 tracking-widest" 
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 border border-gray-300 rounded-[4px] group-hover:border-[#5b6aff] transition-colors flex items-center justify-center">
                  <input type="checkbox" className="hidden peer" />
                  <div className="w-2 h-2 bg-[#5b6aff] rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-[11px] font-bold text-[#5b6aff] hover:text-indigo-700 transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" className="w-full bg-[#5b6aff] text-white py-3.5 rounded-full font-bold hover:bg-[#4a58e8] hover:shadow-lg hover:shadow-indigo-100 transition-all flex items-center justify-center gap-2 mt-4">
            {isLogin ? 'Sign In to Account' : 'Create Account'}
            <ChevronRight size={16} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <p className="text-xs text-gray-500 font-medium">
            {isLogin ? "New to the family? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-[#5b6aff] hover:text-indigo-700 transition-colors ml-1">
              {isLogin ? "Create an account" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-10 text-center space-y-2 z-10">
        <p className="text-[10px] font-bold text-gray-400">© 2026 Fatima's Place. Premium Coastal Dining Experience.</p>
        <div className="flex justify-center gap-4 text-[9px] font-bold text-gray-300 uppercase tracking-widest">
          <span className="hover:text-gray-500 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-gray-500 cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </div>
  );
};

export default Login;