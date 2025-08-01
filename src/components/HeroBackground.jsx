// src/components/HeroBackground.js
import React from "react";

const MeshBackground = React.memo(() => (
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
    
    {/* Optimized Single Breathing Layer - Reduced from 4 to 2 layers */}
    <div 
      className="absolute inset-0 w-full h-full opacity-30"
      style={{
        background: `
          radial-gradient(ellipse 140% 90% at 30% 50%, 
            rgba(26, 35, 50, 0.6) 0%, 
            rgba(74, 44, 84, 0.4) 50%,
            transparent 70%
          )
        `,
        animation: 'optimizedBreathe 16s ease-in-out infinite',
      }}
    />
    
    {/* Atmospheric Flow Layer - Reduced complexity */}
    <div 
      className="absolute inset-0 w-full h-full opacity-20"
      style={{
        background: `
          linear-gradient(95deg, 
            rgba(42, 31, 61, 0.3) 0%,
            rgba(61, 39, 69, 0.2) 100%
          )
        `,
        animation: 'optimizedDrift 24s ease-in-out infinite',
      }}
    />

    {/* Optimized CSS Keyframes - Reduced transform complexity */}
    <style>{`
      @keyframes optimizedBreathe {
        0%, 100% { 
          transform: scale(1);
          opacity: 0.3;
        }
        33% { 
          transform: scale(1.03);
          opacity: 0.4;
        }
        66% { 
          transform: scale(0.97);
          opacity: 0.25;
        }
      }
      
      @keyframes optimizedDrift {
        0%, 100% { 
          transform: translateX(0%);
          opacity: 0.2;
        }
        50% { 
          transform: translateX(0.5%);
          opacity: 0.15;
        }
      }
    `}</style>
  </div>
));

export default MeshBackground;