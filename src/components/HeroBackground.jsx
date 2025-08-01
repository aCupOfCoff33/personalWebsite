// src/components/HeroBackground.js
import React from "react";

const MeshBackground = () => (
  <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
    {/* Base Gradient Layer - Left to Right Flow */}
    <div 
      className="absolute inset-0 w-full h-full"
      style={{
        background: `
          linear-gradient(90deg, 
            #1a2332 0%,           /* Deep navy blue - left */
            #2a1f3d 35%,          /* Navy to purple transition */
            #4a2c54 50%,          /* Muted purple/magenta - center */
            #3d2745 65%,          /* Purple to dark transition */
            #1f1f1f 100%          /* Dark charcoal/black - right */
          )
        `,
      }}
    />
    
    {/* Living Breathing Layer 1 - Subtle Movement */}
    <div 
      className="absolute inset-0 w-full h-full opacity-40"
      style={{
        background: `
          radial-gradient(ellipse 150% 100% at 20% 50%, 
            rgba(26, 35, 50, 0.8) 0%, 
            transparent 70%
          )
        `,
        animation: 'breathe1 12s ease-in-out infinite',
      }}
    />
    
    {/* Living Breathing Layer 2 - Center Purple Pulse */}
    <div 
      className="absolute inset-0 w-full h-full opacity-35"
      style={{
        background: `
          radial-gradient(ellipse 120% 80% at 50% 50%, 
            rgba(74, 44, 84, 0.6) 0%, 
            transparent 60%
          )
        `,
        animation: 'breathe2 15s ease-in-out infinite',
      }}
    />
    
    {/* Living Breathing Layer 3 - Right Side Dark Pulse */}
    <div 
      className="absolute inset-0 w-full h-full opacity-30"
      style={{
        background: `
          radial-gradient(ellipse 140% 90% at 80% 50%, 
            rgba(31, 31, 31, 0.7) 0%, 
            transparent 65%
          )
        `,
        animation: 'breathe3 18s ease-in-out infinite',
      }}
    />
    
    {/* Atmospheric Flow Layer - Gentle Drift */}
    <div 
      className="absolute inset-0 w-full h-full opacity-25"
      style={{
        background: `
          linear-gradient(95deg, 
            rgba(42, 31, 61, 0.4) 0%,
            rgba(74, 44, 84, 0.3) 50%,
            rgba(61, 39, 69, 0.4) 100%
          )
        `,
        animation: 'atmosphericDrift 20s ease-in-out infinite',
      }}
    />

    {/* CSS Keyframes for Living Animations */}
    <style jsx>{`
      @keyframes breathe1 {
        0%, 100% { 
          transform: scale(1) translate(0%, 0%);
          opacity: 0.4;
        }
        25% { 
          transform: scale(1.05) translate(-1%, 2%);
          opacity: 0.5;
        }
        50% { 
          transform: scale(0.95) translate(1%, -1%);
          opacity: 0.3;
        }
        75% { 
          transform: scale(1.02) translate(-0.5%, 1%);
          opacity: 0.45;
        }
      }
      
      @keyframes breathe2 {
        0%, 100% { 
          transform: scale(1) translate(0%, 0%);
          opacity: 0.35;
        }
        30% { 
          transform: scale(1.08) translate(1%, -2%);
          opacity: 0.45;
        }
        60% { 
          transform: scale(0.92) translate(-1%, 1%);
          opacity: 0.25;
        }
      }
      
      @keyframes breathe3 {
        0%, 100% { 
          transform: scale(1) translate(0%, 0%);
          opacity: 0.3;
        }
        40% { 
          transform: scale(1.06) translate(-2%, 1%);
          opacity: 0.4;
        }
        80% { 
          transform: scale(0.94) translate(1%, -1%);
          opacity: 0.2;
        }
      }
      
      @keyframes atmosphericDrift {
        0%, 100% { 
          transform: translateX(0%) skewX(0deg);
          opacity: 0.25;
        }
        25% { 
          transform: translateX(-1%) skewX(0.5deg);
          opacity: 0.3;
        }
        50% { 
          transform: translateX(1%) skewX(-0.3deg);
          opacity: 0.2;
        }
        75% { 
          transform: translateX(-0.5%) skewX(0.2deg);
          opacity: 0.28;
        }
      }
    `}</style>
  </div>
);

export default MeshBackground;