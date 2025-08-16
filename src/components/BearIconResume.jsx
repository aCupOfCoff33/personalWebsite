import React, { useRef } from 'react';
import { useBearState } from './useBearState';
import BearEars from './BearEars';

const DURATION = 420;

const BearIconResume = React.memo(({ className = '', showBase = true, idSuffix = '' }) => {
  const { bearState } = useBearState();
  const svgRef = useRef(null);

  const getSuitTransform = () => {
    // follow same logic as other bears but check for 'resume'
    if (bearState.pendingType === 'resume') {
      switch (bearState.itemPosition) {
        case 'hidden':
          return 'translateY(60px)';
        case 'transitioning-up':
        case 'visible':
          return 'translateY(0px)';
        default:
          return 'translateY(60px)';
      }
    }

    if (bearState.currentType === 'resume') {
      if (bearState.itemPosition === 'hidden') return 'translateY(60px)';
      return 'translateY(0px)';
    }

    if (bearState.previousType === 'resume' && bearState.itemPosition === 'transitioning-down') {
      return 'translateY(60px)';
    }

    return 'translateY(60px)';
  };

  const getSuitTransformAttr = () => {
    const tx = getSuitTransform();
    if (tx.startsWith('translateY')) {
      const num = tx.replace(/translateY\(|px\)/g, '');
      return `translate(0 ${num})`;
    }
    return 'translate(0 0)';
  };

  const suitStyle = {
    transform: getSuitTransform(),
    transition: `transform ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    transformOrigin: 'center bottom',
    pointerEvents: 'none',
  };

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 68 68"
      fill="none"
      className={className}
      role="img"
      aria-label="Bear with suit"
    >
      <defs>
        <clipPath id={`bearCircleMaskResume${idSuffix}`}>
          <circle cx="34" cy="34" r="34" />
        </clipPath>
      </defs>

      {showBase && (
        <>
          <circle cx="34" cy="34" r="34" fill="#E7E9E8" />
          <BearEars />
          <path d="M33.6396 67.999C33.5934 67.999 33.5472 67.9974 33.501 67.9971H33.7793C33.7329 67.9974 33.6861 67.999 33.6396 67.999ZM33.6396 14.75C47.0523 14.75 57.9258 26.6708 57.9258 41.375C57.9257 45.641 57.0088 49.6719 55.3818 53.2461H11.8984C10.2715 49.6719 9.35456 45.641 9.35449 41.375C9.35449 26.6709 20.2272 14.7502 33.6396 14.75Z" fill="#A96229" />
          <ellipse cx="23.3865" cy="34.1803" rx="3.2381" ry="3.95767" fill="#271711" />
          <ellipse cx="44.2547" cy="34.1803" rx="3.2381" ry="3.95767" fill="#271711" />
          <circle cx="23.5757" cy="33.1655" r="1.19873" fill="#D9D9D9" />
          <circle cx="44.354" cy="33.1655" r="1.19873" fill="#D9D9D9" />
          <path d="M33.8203 34.1797C38.9866 34.1797 43.1747 40.0589 43.1748 47.3115C43.1748 49.4486 42.8082 51.4657 42.1631 53.249H25.4775C24.8324 51.4657 24.4658 49.4486 24.4658 47.3115C24.4659 40.0589 28.654 34.1797 33.8203 34.1797Z" fill="#C6843F" />
        </>
      )}

      {/* Suit group: always rendered so it can animate independently */}
      <g
        aria-hidden="true"
        clipPath={`url(#bearCircleMaskResume${idSuffix})`}
        transform={getSuitTransformAttr()}
        style={suitStyle}
      >
        {/* small rotated square (lapel button) */}
        <rect x="33.6318" y="53" width="6.25718" height="6.25718" transform="rotate(45 33.6318 53)" fill="black" />
        <path d="M39.3838 67.5732C37.6301 67.8523 35.8322 68 34 68C31.9544 68 29.951 67.8189 28.0049 67.4727L33.6445 61.834L39.3838 67.5732Z" fill="black" />
        <path d="M8.5 49.5V45.5V45L33.7069 53H34.2931L59.5 45V49L58.9138 50C58.3276 51 56.569 52 53.6379 54.5C51.2931 56.5 42.8908 59.6667 38.9828 61L33.7069 54.5L29.0172 60.5L25.5 59.5C23.7414 59 17.8793 56.5 14.9483 55C12.6034 53.8 9 51.5 8.5 49.5Z" fill="white" stroke="#909090" strokeWidth="0.2" />
      </g>
    </svg>
  );
});

BearIconResume.displayName = 'BearIconResume';
export default BearIconResume;
