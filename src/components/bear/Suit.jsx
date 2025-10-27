import React from 'react';

// Suit accessory extracted from BearIconResume; now fades in/out
// Updated for new 68x68 viewBox coordinate system (no scaling needed)
const Suit = React.memo(function Suit({ position = 'hidden', idSuffix = '' }) {
  const opacity = position === 'hidden' ? 0 : 1;

  return (
    <g
      aria-hidden="true"
      clipPath={`url(#bearCircleMaskResume${idSuffix})`}
  style={{ pointerEvents: 'none', opacity }}
    >
      <defs>
        <clipPath id={`bearCircleMaskResume${idSuffix}`}>
          <circle cx="34" cy="34" r="34" />
        </clipPath>
      </defs>

      {/* Original suit artwork is already in 68x68 space - no scaling needed */}
      <rect x="33.6318" y="53" width="6.25718" height="6.25718" transform="rotate(45 33.6318 53)" fill="black" />
      <path d="M39.3838 67.5732C37.6301 67.8523 35.8322 68 34 68C31.9544 68 29.951 67.8189 28.0049 67.4727L33.6445 61.834L39.3838 67.5732Z" fill="black" />
      <path d="M8.5 49.5V45.5V45L33.7069 53H34.2931L59.5 45V49L58.9138 50C58.3276 51 56.569 52 53.6379 54.5C51.2931 56.5 42.8908 59.6667 38.9828 61L33.7069 54.5L29.0172 60.5L25.5 59.5C23.7414 59 17.8793 56.5 14.9483 55C12.6034 53.8 9 51.5 8.5 49.5Z" fill="white" stroke="#909090" strokeWidth="0.2" />
    </g>
  );
});

Suit.displayName = 'Suit';
export default Suit;
