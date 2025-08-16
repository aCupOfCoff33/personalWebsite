import React from 'react';

// Laptop accessory extracted from BearIconProjects; controls its own vertical transform
const Laptop = React.memo(function Laptop({ position = 'hidden', idSuffix = '' }) {
  // Map position to translateY
  const getTransformY = () => {
    switch (position) {
      case 'visible':
      case 'transitioning-up':
        return 0;
      case 'transitioning-down':
      case 'hidden':
      default:
        return 60;
    }
  };

  const cssTransform = `translateY(${getTransformY()}px)`;
  const svgTransform = `translate(0 ${getTransformY()})`;

  return (
    <g
      filter={`url(#lidShadow${idSuffix})`}
      clipPath={`url(#bearCircleMask${idSuffix})`}
      transform={svgTransform}
      style={{
        transform: cssTransform,
        transition: 'transform 420ms cubic-bezier(0.4, 0, 0.2, 1)',
        transformOrigin: 'center bottom',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <linearGradient id={`lidLinear${idSuffix}`} x1="0" y1="72" x2="0" y2="116" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BEBFC3"/>
          <stop offset="100%" stopColor="#5A5B5D"/>
        </linearGradient>
        <linearGradient id={`lidInnerTop${idSuffix}`} x1="0" y1="72" x2="0" y2="116" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(0,0,0,0.25)"/>
          <stop offset="35%" stopColor="rgba(0,0,0,0)"/>
        </linearGradient>
        <radialGradient id={`lidCenterLight${idSuffix}`} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.16)"/>
          <stop offset="70%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <linearGradient id={`appleGrad${idSuffix}`} x1="0" y1="-12" x2="0" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D8D9DD"/>
          <stop offset="100%" stopColor="#BDBEC2"/>
        </linearGradient>
        <filter id={`lidShadow${idSuffix}`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.28"/>
        </filter>
        <clipPath id={`bearCircleMask${idSuffix}`}>
          <circle cx="63.8175" cy="63.8175" r="63.8175"/>
        </clipPath>
      </defs>

      <g aria-hidden="true">
        <path id={`lidShape${idSuffix}`} d="M24 72 L104 72 Q106 72 105.73 73.98 L100.27 114.02 Q100 116 98 116 L30 116 Q28 116 27.73 114.02 L22.27 73.98 Q22 72 24 72 Z" fill={`url(#lidLinear${idSuffix})`} />
        <path d="M24 72 L104 72 Q106 72 105.73 73.98 L100.27 114.02 Q100 116 98 116 L30 116 Q28 116 27.73 114.02 L22.27 73.98 Q22 72 24 72 Z" fill={`url(#lidInnerTop${idSuffix})`} />
        <path d="M24 72 L104 72 Q106 72 105.73 73.98 L100.27 114.02 Q100 116 98 116 L30 116 Q28 116 27.73 114.02 L22.27 73.98 Q22 72 24 72 Z" fill={`url(#lidCenterLight${idSuffix})`} />
        <g transform="translate(64 94) scale(0.75) translate(-12 -12)">
          <path fill={`url(#appleGrad${idSuffix})`} d="M17.05 20.28c-.98.95-2.05.8-3.08.35c-1.09-.46-2.09-.48-3.24 0c-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8c1.18-.24 2.31-.93 3.57-.84c1.51.12 2.65.72 3.4 1.8c-3.12 1.87-2.38 5.98.48 7.13c-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25c.29 2.58-2.34 4.5-3.74 4.25" />
        </g>
      </g>
    </g>
  );
});

Laptop.displayName = 'Laptop';
export default Laptop;
