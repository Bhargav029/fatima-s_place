import React, { useState } from 'react';
import { User, Moon, Sun, Bell, Shield, LogOut, ChevronRight, Save } from 'lucide-react';
import NavbarMain from "../components/NavbarMain";
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth(); // Get actual user data from Context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0b10] transition-colors duration-300 flex flex-col">
      <NavbarMain />

      <main className="max-w-6xl mx-auto px-6 py-10 w-full flex-grow">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* --- SIDEBAR NAVIGATION --- */}
          <div className="w-full md:w-64 shrink-0 space-y-2">
            {[
              { id: 'Profile', icon: User },
              { id: 'Appearance', icon: Moon },
              { id: 'Notifications', icon: Bell },
              { id: 'Security', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#6b75f2] text-white shadow-md' 
                    : 'text-gray-500 hover:bg-white dark:hover:bg-[#16171d] dark:text-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon size={18} /> {tab.id}
                </div>
                <ChevronRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
              </button>
            ))}

            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
              >
                <LogOut size={18} /> Log Out
              </button>
            </div>
          </div>

          {/* --- MAIN CONTENT AREA --- */}
          <div className="flex-1 bg-white dark:bg-[#16171d] border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 shadow-sm transition-colors duration-300">
            
            {/* PROFILE TAB */}
            {activeTab === 'Profile' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Personal Info</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Your account details across Fatima's Place.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={user?.name || "Guest User"} 
                      readOnly
                      className="w-full bg-gray-50 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-[#6b75f2] outline-none dark:text-white transition-colors" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={user?.email || "not-logged-in@example.com"} 
                      readOnly
                      className="w-full bg-gray-50 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-[#6b75f2] outline-none dark:text-white transition-colors" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={user?.phone || "+91 98765 43210"} 
                      readOnly
                      className="w-full bg-gray-50 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-[#6b75f2] outline-none dark:text-white transition-colors" 
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button className="bg-[#6b75f2] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#5a64e1] transition-colors flex items-center gap-2 text-sm shadow-lg shadow-indigo-100 dark:shadow-none">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'Appearance' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Theme Preferences</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Choose how Fatima's Place looks to you.</p>
                </div>

                <div className="flex items-center justify-between p-5 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-[#1e1f26]">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>
                      {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Dark Mode</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Reduce eye strain and save battery.</p>
                    </div>
                  </div>

                  <button 
                    onClick={toggleTheme}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${isDarkMode ? 'bg-[#6b75f2]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            )}

            {/* PLACEHOLDERS */}
            {(activeTab === 'Notifications' || activeTab === 'Security') && (
              <div className="text-center py-20 text-gray-400 animate-in fade-in duration-300">
                <Bell size={48} className="mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{activeTab} Settings</h3>
                <p className="text-sm">These features are coming soon!</p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;