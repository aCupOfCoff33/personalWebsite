import React, { useRef, useEffect } from 'react';

// Book accessory extracted from BearIconReading; includes subtle page flip when mounted
// Updated for new 68x68 viewBox coordinate system
const PAGE_FLIP_DURATION_MS = 320;
const PAGE_FLIP_DEG = -12;

const Book = React.memo(function Book({ position = 'hidden', idSuffix = '' }) {
  const pageRef = useRef(null);

  // simple entry flip effect on mount
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    page.style.transformOrigin = '17px 58.5px'; // Scaled from 32px 110px
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
        <linearGradient id={`bookLeft${idSuffix}`} x1="20.7" y1="39.3" x2="34" y2="61.6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C73B33" />
          <stop offset="1" stopColor="#9E2B26" />
        </linearGradient>
        <linearGradient id={`bookRight${idSuffix}`} x1="46.7" y1="39.3" x2="34" y2="61.6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D85C55" />
          <stop offset="1" stopColor="#A1332D" />
        </linearGradient>
        <clipPath id={`bearCircleMaskReading${idSuffix}`}>
          <circle cx="34" cy="34" r="34" />
        </clipPath>
      </defs>

      <g ref={pageRef} style={{ transformOrigin: '17px 58.5px' }}>
        <path d="M34 42.5 L17 36.1 L17 61.6 L34 64.8 Z" fill="#F6ECEB" />
        <g stroke="#C4B5B3" strokeWidth="0.42">
          <line x1="19.1" y1="43.5" x2="31.9" y2="41.4" />
          <line x1="19.6" y1="46.7" x2="31.3" y2="44.6" />
          <line x1="19.6" y1="49.9" x2="31.3" y2="47.8" />
          <line x1="19.6" y1="53.1" x2="31.3" y2="51" />
          <line x1="19.6" y1="56.3" x2="31.3" y2="54.2" />
          <line x1="19.6" y1="59.5" x2="31.3" y2="57.4" />
        </g>
      </g>

      <path d="M34 41.4 L17 35 L17 62.7 L34 65.9 Z" fill={`url(#bookLeft${idSuffix})`} />
      <path d="M34 41.4 L51 35 L51 62.7 L34 65.9 Z" fill={`url(#bookRight${idSuffix})`} />
      <path d="M34 41.4 L34 65.9" stroke="#E6D3D1" strokeWidth="1.06" />
      <g stroke="#EBD9D6" strokeWidth="0.42">
        <line x1="36.1" y1="44.6" x2="48.9" y2="41.4" />
        <line x1="36.6" y1="47.8" x2="48.3" y2="44.6" />
        <line x1="36.6" y1="51" x2="48.3" y2="47.8" />
        <line x1="36.6" y1="54.2" x2="48.3" y2="51" />
        <line x1="36.6" y1="57.4" x2="48.3" y2="54.2" />
      </g>
    </g>
  );
});

Book.displayName = 'Book';
export default Book;
