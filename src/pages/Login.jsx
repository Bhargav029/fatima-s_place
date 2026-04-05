import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Palmtree, Mail, Lock, User, ArrowLeft, ChevronRight } from 'lucide-react';

import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase'; 

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [activeRole, setActiveRole] = useState('Customer');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Standard Email/Password Handler
  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      action: isLogin ? 'login' : 'signup',
      email: email,
      password: password,
      role: isLogin ? activeRole.toLowerCase() : 'customer'
    };
    if (!isLogin) payload.fullName = fullName;

    try {
      const response = await fetch('http://23.22.236.144/api.php', {
    method: 'POST',
    // ... rest of your code
});

      // --- 🟢 MOCK BACKEND CODE (ACTIVE FOR LOCAL TESTING) ---
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = {
        status: 'success',
        user: {
          name: isLogin ? `${activeRole} User` : fullName,
          email: email,
          phone: "+91 98765 43210",
          role: isLogin ? activeRole.toLowerCase() : 'customer'
        }
      };
      // --------------------------------------------------------------

      if (data.status === 'success') {
        const loggedInRole = data.user?.role || (isLogin ? activeRole.toLowerCase() : 'customer');
        
        login({ 
          name: data.user?.name || (isLogin ? `${activeRole} User` : fullName), 
          email: email,
          phone: data.user?.phone || "+91 98765 43210", 
          role: loggedInRole
        }); 

        // 🚀 BULLETPROOF REDIRECT LOGIC
        // Using { replace: true } ensures they cannot hit the "Back" button to see the wrong page
        if (loggedInRole === 'admin') {
          navigate('/admin', { replace: true });
        } else if (loggedInRole === 'staff') {
          navigate('/staff', { replace: true });
        } else {
          // Only customers are allowed to go back to the public pages
          const origin = location.state?.from || '/';
          navigate(origin, { replace: true }); 
        }
      } else {
        setError(data.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Google Authentication Handler
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const payload = {
        action: 'google_login', 
        email: user.email,
        fullName: user.displayName,
        firebaseUid: user.uid, 
        role: 'customer' 
      };

      const response = await fetch('http://23.22.236.144/api.php', {
    method: 'POST',
    // ... rest of your code
});

      // --- 🟢 MOCK BACKEND CODE (ACTIVE FOR LOCAL TESTING) ---
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = {
        status: 'success',
        user: {
          name: user.displayName,
          email: user.email,
          phone: "+91 98765 43210",
          role: 'customer'
        }
      };
      // --------------------------------------------------------------

      if (data.status === 'success') {
        const loggedInRole = data.user?.role || 'customer';

        login({ 
          name: data.user?.name || user.displayName, 
          email: user.email,
          phone: data.user?.phone || "+91 98765 43210", 
          role: loggedInRole
        }); 

        // 🚀 BULLETPROOF REDIRECT LOGIC FOR GOOGLE LOGIN
        if (loggedInRole === 'admin') {
          navigate('/admin', { replace: true });
        } else if (loggedInRole === 'staff') {
          navigate('/staff', { replace: true });
        } else {
          const origin = location.state?.from || '/';
          navigate(origin, { replace: true }); 
        }
      } else {
        setError(data.message || 'Google authentication failed on server.');
      }
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Failed to sign in with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center relative overflow-hidden p-6 transition-colors duration-300">
      
      <Palmtree className="absolute -left-24 top-1/4 w-[500px] h-[500px] text-gray-100/60 stroke-[0.5] -rotate-12 pointer-events-none" />
      <Palmtree className="absolute -right-24 bottom-1/4 w-[500px] h-[500px] text-gray-100/60 stroke-[0.5] rotate-12 pointer-events-none" />

      {/* Only acts as a back button BEFORE they log in */}
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

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-[13px] text-gray-500">
            {isLogin ? 'Please enter your details to access your account' : 'Join us to experience authentic coastal dining'}
          </p>
        </div>

        {isLogin && (
          <div className="flex p-1 bg-gray-50 rounded-full mb-6 border border-gray-100">
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

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
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
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
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

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-[#5b6aff] text-white py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 mt-2 
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#4a58e8] hover:shadow-lg hover:shadow-indigo-100'}`}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In to Account' : 'Create Account')}
            {!isLoading && <ChevronRight size={16} />}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative bg-white px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Or continue with</div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className={`w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-3 shadow-sm hover:bg-gray-50
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <p className="text-xs text-gray-500 font-medium">
            {isLogin ? "New to the family? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError(''); 
              }} 
              className="font-bold text-[#5b6aff] hover:text-indigo-700 transition-colors ml-1"
            >
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