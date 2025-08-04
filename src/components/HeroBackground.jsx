// src/components/HeroBackground.js
import React from "react";

const MeshBackground = React.memo(() => (
  <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
    {/* Base Dynamic Gradient Layer */}
    <div 
      className="absolute inset-0 w-full h-full"
      style={{
        background: `
          linear-gradient(135deg, 
            #0f172a 0%,           /* Deep slate - top left */
            #1e1b4b 20%,          /* Dark indigo */
            #312e81 40%,          /* Purple-indigo */
            #1f2937 60%,          /* Cool gray */
            #111827 80%,          /* Dark gray */
            #000000 100%          /* Pure black - bottom right */
          )
        `,
        animation: 'gradientShift 25s ease-in-out infinite',
      }}
    />
    
    {/* Animated Mesh Grid */}
    <div className="absolute inset-0 opacity-20">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="mesh" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <path 
              d="M 10 0 L 0 0 0 10" 
              fill="none" 
              stroke="url(#meshGradient)" 
              strokeWidth="0.1"
              className="animate-pulse"
            />
          </pattern>
          <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#mesh)" />
      </svg>
    </div>
    
    {/* Primary Floating Orb - Large */}
    <div 
      className="absolute w-96 h-96 rounded-full opacity-30"
      style={{
        background: `
          radial-gradient(circle, 
            rgba(59, 130, 246, 0.4) 0%, 
            rgba(147, 51, 234, 0.3) 40%,
            rgba(236, 72, 153, 0.2) 70%,
            transparent 100%
          )
        `,
        top: '20%',
        left: '10%',
        animation: 'floatLarge 30s ease-in-out infinite',
        filter: 'blur(40px)',
      }}
    />
    
    {/* Secondary Floating Orb - Medium */}
    <div 
      className="absolute w-64 h-64 rounded-full opacity-25"
      style={{
        background: `
          radial-gradient(circle, 
            rgba(168, 85, 247, 0.4) 0%, 
            rgba(59, 130, 246, 0.3) 50%,
            rgba(34, 197, 94, 0.2) 80%,
            transparent 100%
          )
        `,
        top: '60%',
        right: '15%',
        animation: 'floatMedium 22s ease-in-out infinite reverse',
        filter: 'blur(30px)',
      }}
    />
    
    {/* Tertiary Floating Orb - Small */}
    <div 
      className="absolute w-48 h-48 rounded-full opacity-20"
      style={{
        background: `
          radial-gradient(circle, 
            rgba(34, 197, 94, 0.4) 0%, 
            rgba(168, 85, 247, 0.3) 60%,
            transparent 100%
          )
        `,
        top: '40%',
        left: '70%',
        animation: 'floatSmall 26s ease-in-out infinite',
        filter: 'blur(25px)',
      }}
    />
    
    {/* Ambient Particles Layer */}
    <div 
      className="absolute inset-0 w-full h-full opacity-10"
      style={{
        background: `
          radial-gradient(ellipse 200% 100% at 20% 30%, 
            rgba(59, 130, 246, 0.1) 0%,
            transparent 50%
          ),
          radial-gradient(ellipse 180% 120% at 80% 70%, 
            rgba(147, 51, 234, 0.1) 0%,
            transparent 50%
          ),
          radial-gradient(ellipse 150% 80% at 40% 90%, 
            rgba(236, 72, 153, 0.1) 0%,
            transparent 50%
          )
        `,
        animation: 'particleDrift 35s linear infinite',
      }}
    />
    
    {/* Atmospheric Breathing Layer */}
    <div 
      className="absolute inset-0 w-full h-full opacity-15"
      style={{
        background: `
          linear-gradient(45deg, 
            rgba(59, 130, 246, 0.1) 0%,
            rgba(147, 51, 234, 0.08) 30%,
            rgba(236, 72, 153, 0.06) 60%,
            transparent 100%
          )
        `,
        animation: 'atmosphericBreathe 18s ease-in-out infinite',
      }}
    />

    {/* Enhanced CSS Keyframes for Fluid Motion */}
    <style>{`
      @keyframes gradientShift {
        0%, 100% { 
          filter: hue-rotate(0deg) brightness(1);
        }
        25% { 
          filter: hue-rotate(8deg) brightness(1.1);
        }
        50% { 
          filter: hue-rotate(-5deg) brightness(0.95);
        }
        75% { 
          filter: hue-rotate(12deg) brightness(1.05);
        }
      }
      
      @keyframes floatLarge {
        0%, 100% { 
          transform: translate(0%, 0%) scale(1) rotate(0deg);
          opacity: 0.3;
        }
        25% { 
          transform: translate(15%, -8%) scale(1.1) rotate(90deg);
          opacity: 0.4;
        }
        50% { 
          transform: translate(-8%, 12%) scale(0.9) rotate(180deg);
          opacity: 0.25;
        }
        75% { 
          transform: translate(12%, 5%) scale(1.05) rotate(270deg);
          opacity: 0.35;
        }
      }
      
      @keyframes floatMedium {
        0%, 100% { 
          transform: translate(0%, 0%) scale(1) rotate(0deg);
          opacity: 0.25;
        }
        33% { 
          transform: translate(-12%, 15%) scale(1.15) rotate(120deg);
          opacity: 0.35;
        }
        66% { 
          transform: translate(18%, -10%) scale(0.85) rotate(240deg);
          opacity: 0.2;
        }
      }
      
      @keyframes floatSmall {
        0%, 100% { 
          transform: translate(0%, 0%) scale(1);
          opacity: 0.2;
        }
        50% { 
          transform: translate(-20%, 18%) scale(1.2);
          opacity: 0.3;
        }
      }
      
      @keyframes particleDrift {
        0% { 
          transform: translateX(0%) translateY(0%);
          opacity: 0.1;
        }
        50% { 
          transform: translateX(3%) translateY(-2%);
          opacity: 0.15;
        }
        100% { 
          transform: translateX(-2%) translateY(2%);
          opacity: 0.1;
        }
      }
      
      @keyframes atmosphericBreathe {
        0%, 100% { 
          transform: scale(1);
          opacity: 0.15;
        }
        50% { 
          transform: scale(1.03);
          opacity: 0.2;
        }
      }
    `}</style>
  </div>
));

export default MeshBackground;