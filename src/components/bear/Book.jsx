import React, { useRef, useEffect } from 'react';

// Book accessory extracted from BearIconReading; includes subtle page flip when mounted
const PAGE_FLIP_DURATION_MS = 320;
const PAGE_FLIP_DEG = -12;

const Book = React.memo(function Book({ position = 'hidden', idSuffix = '' }) {
  const pageRef = useRef(null);

  // simple entry flip effect on mount
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    page.style.transformOrigin = '32px 110px';
    page.style.transition = `transform ${PAGE_FLIP_DURATION_MS}ms ease-in-out`;
    page.style.transform = `rotateY(${PAGE_FLIP_DEG}deg)`;
    const t = setTimeout(() => {
      if (page) page.style.transform = 'rotateY(0deg)';
    }, PAGE_FLIP_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  const opacity = position === 'hidden' ? 0 : 1;

  return (
    <g
      aria-hidden="true"
      clipPath={`url(#bearCircleMaskReading${idSuffix})`}
      style={{ pointerEvents: 'none', opacity }}
    >
      <defs>
        <linearGradient id={`bookLeft${idSuffix}`} x1="39" y1="74" x2="64" y2="116" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C73B33" />
          <stop offset="1" stopColor="#9E2B26" />
        </linearGradient>
        <linearGradient id={`bookRight${idSuffix}`} x1="88" y1="74" x2="64" y2="116" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D85C55" />
          <stop offset="1" stopColor="#A1332D" />
        </linearGradient>
        <clipPath id={`bearCircleMaskReading${idSuffix}`}>
          <circle cx="63.8175" cy="63.8175" r="63.8175" />
        </clipPath>
      </defs>

      <g ref={pageRef} style={{ transformOrigin: '32px 110px' }}>
        <path d="M64 80 L32 68 L32 116 L64 122 Z" fill="#F6ECEB" />
        <g stroke="#C4B5B3" strokeWidth="0.8">
          <line x1="36" y1="82" x2="60" y2="78" />
          <line x1="37" y1="88" x2="59" y2="84" />
          <line x1="37" y1="94" x2="59" y2="90" />
          <line x1="37" y1="100" x2="59" y2="96" />
          <line x1="37" y1="106" x2="59" y2="102" />
          <line x1="37" y1="112" x2="59" y2="108" />
        </g>
      </g>

      <path d="M64 78 L32 66 L32 118 L64 124 Z" fill={`url(#bookLeft${idSuffix})`} />
      <path d="M64 78 L96 66 L96 118 L64 124 Z" fill={`url(#bookRight${idSuffix})`} />
      <path d="M64 78 L64 124" stroke="#E6D3D1" strokeWidth="2" />
      <g stroke="#EBD9D6" strokeWidth="0.8">
        <line x1="68" y1="84" x2="92" y2="78" />
        <line x1="69" y1="90" x2="91" y2="84" />
        <line x1="69" y1="96" x2="91" y2="90" />
        <line x1="69" y1="102" x2="91" y2="96" />
        <line x1="69" y1="108" x2="91" y2="102" />
      </g>
    </g>
  );
});

Book.displayName = 'Book';
export default Book;
