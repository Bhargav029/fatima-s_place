import React, { useState, useEffect } from 'react';
import { Palmtree } from 'lucide-react';

const SplashScreen = () => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isGone, setIsGone] = useState(false);

  useEffect(() => {
    // 1. Give the wave and splash sequence 3.5 seconds to play out
    const timer1 = setTimeout(() => {
      setIsLeaving(true);
    }, 3500);

    // 2. Wait 1 full second for the smooth slide to finish before deleting the component
    const timer2 = setTimeout(() => {
      setIsGone(true);
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (isGone) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#f8f9fb] dark:bg-[#0a0b10] flex flex-col items-center justify-center transition-transform duration-[1000ms] ease-in-out will-change-transform ${
        isLeaving ? '-translate-y-full' : 'translate-y-0'
      } overflow-hidden`}
    >
      {/* 🌅 Glowing "Goan Sunset" Background Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-[80px] custom-logo-reveal"></div>

      {/* 🌊 THE ANIMATION CONTAINER */}
      <div className="relative flex flex-col items-center justify-center w-full h-64 mb-4">
        
        {/* 1. The Surging Liquid Wave */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-t from-cyan-500 to-blue-400 dark:from-cyan-400 dark:to-blue-500 opacity-0 custom-liquid-wave z-20 shadow-[0_0_40px_rgba(6,182,212,0.6)]"></div>
        
        {/* 2. The Splash Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-[12px] border-cyan-300 dark:border-cyan-200 rounded-full opacity-0 custom-splash-ring z-10"></div>

        {/* 3. The Splash Droplets */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-4 h-4 bg-cyan-400 rounded-full custom-droplet opacity-0"
              style={{
                '--angle': `${i * 60}deg`,
                '--distance': '120px',
                '--delay': '1.35s' // Triggers exactly when the wave hits maximum size
              }}
            ></div>
          ))}
        </div>

        {/* 4. The Main Logo (Reveals after splash) */}
        <div className="relative z-30 w-32 h-32 bg-gradient-to-tr from-[#6b75f2] to-[#8b93f6] rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(107,117,242,0.5)] custom-logo-reveal">
          <Palmtree size={64} strokeWidth={2} className="relative right-1" />
        </div>
        
      </div>

      {/* 📝 Brand Text Reveal */}
      <div className="relative z-30 flex flex-col items-center custom-logo-reveal">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">Fatima's Place</h1>
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-[0.3em] mt-3 uppercase">Taste of Goa</p>
      </div>

      {/* 🎨 INJECTED CUSTOM CSS ANIMATIONS */}
      <style>{`
        /* 1. Organic Liquid Wave: Uses shifting border-radius to look like real fluid */
        @keyframes liquid-surge {
          0% { 
            transform: translate(-50%, 150px) scale(0.2); 
            opacity: 0; 
            border-radius: 43% 57% 55% 45% / 54% 47% 53% 46%; 
          }
          15% { opacity: 1; }
          40% { 
            transform: translate(-50%, 10px) scale(2); 
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; 
            background: linear-gradient(to top, #06b6d4, #e0f2fe);
          }
          45% { 
            transform: translate(-50%, -10px) scale(2.8); 
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; 
            opacity: 0.8;
          }
          50% { transform: translate(-50%, -15px) scale(3.2); opacity: 0; }
          100% { opacity: 0; }
        }
        .custom-liquid-wave {
          animation: liquid-surge 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        /* 2. The Splash Ring */
        @keyframes splash-burst {
          0%, 42% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; border-width: 20px; }
          45% { opacity: 1; border-color: #67e8f9; }
          65% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; border-width: 0px; }
          100% { opacity: 0; }
        }
        .custom-splash-ring {
          animation: splash-burst 3.5s ease-out forwards;
        }

        /* 3. The Flying Water Droplets */
        @keyframes droplet-shoot {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          1% { opacity: 1; }
          100% { 
            transform: translate(
              calc(cos(var(--angle)) * var(--distance)), 
              calc(sin(var(--angle)) * var(--distance))
            ) scale(0); 
            opacity: 0; 
          }
        }
        .custom-droplet {
          animation: droplet-shoot 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--delay);
        }

        /* 4. Logo and Text popping out of the splash */
        @keyframes logo-reveal {
          0%, 45% { opacity: 0; transform: scale(0.3) translateY(40px); }
          55% { opacity: 1; transform: scale(1.1) translateY(0px); }
          65% { opacity: 1; transform: scale(1) translateY(0px); }
          85% { transform: translateY(-8px); } /* Start floating */
          100% { transform: translateY(0px); opacity: 1; }
        }
        .custom-logo-reveal {
          animation: logo-reveal 3.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0; 
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;