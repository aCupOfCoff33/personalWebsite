// src/components/HeroBackground.js
import React from "react";

const MeshBackground = () => (
  <svg
    // --- CHANGE HERE: Use 'fixed' positioning ---
    className="fixed inset-0 w-full h-full -z-10"
    xmlns="http://www.w3.org/2000/svg"
    id="mesh-gradient"
    viewBox="0 0 1000 500"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <filter
        id="blur"
        filterUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="1000"
        height="500"
      >
        <feGaussianBlur stdDeviation="80" />
      </filter>

      <filter id="noise" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="1" // Adjust baseFrequency if noise is too fine/coarse
          octaves="3"
          result="turbulence"
          stitchTiles="stitch"
        />
        {/* Consider reducing opacity/changing mode if noise is too strong */}
        <feBlend in="SourceGraphic" in2="turbulence" mode="overlay" />
      </filter>
    </defs>

    {/* Base fill for the SVG area, blurred shapes go on top */}
    <rect id="background" width="100%" height="100%" fill="#000" />

    <g id="swatches" filter="url(#blur)">
       {/* These shapes create the blurred gradient effect */}
      <rect
        x="53.59078142488147"
        y="16.49314287350836"
        width="482.15594347795525"
        height="582.7161406963531"
        fill="#563E52" // Dark purple/mauve
      />
      <rect
        x="-252.71676055464923"
        y="-331.3527803179682"
        width="752.4433023692997"
        height="817.0740330977048"
        fill="#321D43" // Deep purple
      />
      <rect
        x="-220.5433394966917"
        y="-115.98477577508713"
        width="448.10070688038326"
        height="457.63129369734463"
        fill="#223165" // Deep blue/indigo
      />
    </g>

    {/* Noise overlay */}
    <rect
      x="0"
      y="0"
      width="100%" // Use 100% instead of fixed pixels for responsiveness
      height="100%"
      // Reduced opacity slightly for subtlety, adjust as needed
      style={{ mixBlendMode: "luminosity", opacity: "8%" }}
      filter="url(#noise)"
    />
  </svg>
);

export default MeshBackground;