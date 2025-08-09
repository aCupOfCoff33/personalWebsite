// CursorSVG.jsx
// Cursor pointer SVG, color will be set via props
import React from 'react';

function CursorSVG({ color = "#9B7CF6", size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2L26 16L18 18L20 26L14 22L10 28L12 18L6 2Z" fill={color} stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

// Optimized: memoize pure SVG component
export default React.memo(CursorSVG);
