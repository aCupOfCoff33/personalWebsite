// Reading bear component that syncs page flips with note sections
// - Animated book positioning based on route transitions
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNotesTOC } from './notes/NotesContext';
import { useBearState } from './useBearState';
import BearEars from './BearEars';

const MAX_HIGHLIGHT_MOVEMENT = 1.5; // highlight wobble (inside the iris)
const BLINK_DURATION_MS = 120;

// reading motion tuning
const EYE_SCAN_AMPLITUDE_PX = 2.0;
const EYE_SCAN_DOWN_BIAS_PX = 1.4;
const EYE_SCAN_PERIOD_MS = 3200;
const SACCADE_THRESHOLD = 0.85;

const PAGE_FLIP_DURATION_MS = 320;
const PAGE_FLIP_DEG = -12;

const BearIconReading = React.memo(({ className = '', showBase = true, idSuffix = '' }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const svgRef = useRef(null);
  const { bearState } = useBearState();

  const leftHighlightRef = useRef(null);
  const rightHighlightRef = useRef(null);
  const leftIrisGroupRef = useRef(null);
  const rightIrisGroupRef = useRef(null);
  const pageRef = useRef(null);

  const blinkTimeoutRef = useRef(null);
  const periodicBlinkTimeoutRef = useRef(null);
  const scanStartRef = useRef(null);
  const pageFlipResetTimeoutRef = useRef(null);

  const { tocItems, readingProgress } = useNotesTOC();

  const getBookTransform = () => {
    // Outgoing: if we were stories and are transitioning down, slide it away (check this first)
    if (bearState.previousType === 'stories' && bearState.itemPosition === 'transitioning-down') {
      return 'translateY(60px)';
    }

    if (bearState.pendingType === 'stories') {
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

    if (bearState.currentType === 'stories') {
      if (bearState.itemPosition === 'hidden') return 'translateY(60px)';
      return 'translateY(0px)';
    }

    return 'translateY(60px)';
  };

  const getBookTransformAttr = () => {
    const tx = getBookTransform();
    if (tx.startsWith('translateY')) {
      const num = tx.replace(/translateY\(|px\)/g, '');
      return `translate(0 ${num})`;
    }
    return 'translate(0 0)';
  };

  // Decide whether to mount/render the book group. Keep it mounted during exit animations.
  const shouldRenderBook = (() => {
    const pos = bearState?.itemPosition;
    if (bearState?.pendingType === 'stories') return pos !== 'hidden';
    if (bearState?.currentType === 'stories') return true;
    // outgoing: keep rendering during transitioning-down to animate out
    if (bearState?.previousType === 'stories' && pos === 'transitioning-down') return true;
    return false;
  })();

  const triggerBlink = useCallback(() => {
    if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    setIsBlinking(true);
    blinkTimeoutRef.current = setTimeout(() => {
      setIsBlinking(false);
      blinkTimeoutRef.current = null;
    }, BLINK_DURATION_MS);
  }, []);

  const schedulePeriodicBlink = useCallback(() => {
    if (periodicBlinkTimeoutRef.current) clearTimeout(periodicBlinkTimeoutRef.current);
    const delay = Math.random() * 5000 + 2000;
    periodicBlinkTimeoutRef.current = setTimeout(() => {
      triggerBlink();
      schedulePeriodicBlink();
    }, delay);
  }, [triggerBlink]);

  useEffect(() => {
    schedulePeriodicBlink();
    return () => {
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
      if (periodicBlinkTimeoutRef.current) clearTimeout(periodicBlinkTimeoutRef.current);
    };
  }, [schedulePeriodicBlink]);

  useEffect(() => {
    const left = leftIrisGroupRef.current;
    const right = rightIrisGroupRef.current;
    if (!left || !right) return;

    let rafId;
    const tick = (t) => {
      if (scanStartRef.current == null) scanStartRef.current = t;
      const elapsed = t - scanStartRef.current;
      const p = (elapsed % EYE_SCAN_PERIOD_MS) / EYE_SCAN_PERIOD_MS;
      const isSaccade = p > SACCADE_THRESHOLD;
      const progress = isSaccade ? 0 : p / SACCADE_THRESHOLD;
      const x = -EYE_SCAN_AMPLITUDE_PX + (2 * EYE_SCAN_AMPLITUDE_PX * progress);
      const y = EYE_SCAN_DOWN_BIAS_PX;
      const tStr = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      left.style.transform = tStr;
      right.style.transform = tStr;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (!tocItems?.length) return;
    const newSectionIndex = Math.floor(readingProgress * tocItems.length);
    const clampedIndex = Math.max(0, Math.min(newSectionIndex, tocItems.length - 1));
    if (clampedIndex !== currentSectionIndex) {
      setCurrentSectionIndex(clampedIndex);
      const page = pageRef.current;
      if (page) {
        page.style.transition = `transform ${PAGE_FLIP_DURATION_MS}ms ease-in-out`;
        page.style.transformOrigin = '32px 110px';
        page.style.transform = `rotateY(${PAGE_FLIP_DEG}deg)`;
        if (pageFlipResetTimeoutRef.current) clearTimeout(pageFlipResetTimeoutRef.current);
        pageFlipResetTimeoutRef.current = setTimeout(() => {
          if (page) page.style.transform = 'rotateY(0deg)';
        }, PAGE_FLIP_DURATION_MS);
      }
    }
  }, [tocItems, readingProgress, currentSectionIndex]);

  useEffect(() => {
    return () => {
      if (pageFlipResetTimeoutRef.current) clearTimeout(pageFlipResetTimeoutRef.current);
    };
  }, []);

  const handleClick = () => triggerBlink();

  const eyeBlinkStyle = {
    transform: isBlinking ? 'scaleY(0.1)' : 'scaleY(1)',
    transformOrigin: 'center center',
    transition: `transform ${BLINK_DURATION_MS}ms ease-in-out`,
  };

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      fill="none"
      className={className}
      role="img"
      aria-label="Bear reading a book"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
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

      {showBase && (
        <>
          <circle cx="63.8175" cy="63.8175" r="63.8175" fill="#E7E9E8" />
          <BearEars />
          <path fillRule="evenodd" clipRule="evenodd" d="M103.954 99.9468C107.008 93.2376 108.726 85.6695 108.726 77.6615C108.726 50.0619 88.3175 27.688 63.1422 27.688C37.9669 27.688 17.5583 50.0619 17.5583 77.6615C17.5583 85.6695 19.2764 93.2376 22.3306 99.9468H103.954ZM63.2227 127.635H63.0616C63.0885 127.635 63.1153 127.635 63.1422 127.635C63.169 127.635 63.1958 127.635 63.2227 127.635Z" fill="#A96229" />
          <path fillRule="evenodd" clipRule="evenodd" d="M79.1457 99.9468C80.3559 96.6003 81.0381 92.8139 81.0381 88.8039C81.0381 75.1906 73.177 64.1548 63.4798 64.1548C53.7827 64.1548 45.9216 75.1906 45.9216 88.8039C45.9216 92.8139 46.6037 96.6003 47.8139 99.9468H79.1457Z" fill="#C6843F" />
          <path d="M57.0643 85.765C56.9517 85.765 56.389 85.4274 55.0383 84.0767C53.6877 82.7261 54.7007 82.1633 55.376 82.0508C55.4885 82.501 56.389 83.6715 59.0902 84.752C62.4668 86.1027 63.4798 82.7261 63.4798 84.0767C63.4798 85.4274 63.4798 85.765 62.1292 86.4403C61.0487 86.9806 59.4279 86.6654 58.7526 86.4403L57.0643 85.765Z" fill="#241E16" stroke="#281E11" />
          <path d="M69.5672 85.765C69.6798 85.765 70.2426 85.4274 71.5932 84.0767C72.9438 82.7261 71.9309 82.1633 71.2555 82.0508C71.143 82.501 70.2426 83.6715 67.5413 84.752C64.1647 86.1027 63.1517 82.7261 63.1517 84.0767C63.1517 85.4274 63.1517 85.765 64.5024 86.4403C65.5829 86.9806 67.2036 86.6654 67.8789 86.4403L69.5672 85.765Z" fill="#241E16" stroke="#281E11" />
        </>
      )}

      {/* Eyes (render behind book) */}
      {showBase && (
        <>
          <g style={eyeBlinkStyle}>
            <g ref={leftIrisGroupRef} style={{ transition: 'transform 100ms linear' }}>
              <ellipse cx="43.8956" cy="64.1551" rx="6.07785" ry="7.42849" fill="#271711" />
              <circle ref={leftHighlightRef} cx="44.25" cy="62.25" r="2.25" fill="#D9D9D9" />
            </g>
          </g>
          <g style={eyeBlinkStyle}>
            <g ref={rightIrisGroupRef} style={{ transition: 'transform 100ms linear' }}>
              <ellipse cx="83.064" cy="64.1551" rx="6.07785" ry="7.42849" fill="#271711" />
              <circle ref={rightHighlightRef} cx="83.25" cy="62.25" r="2.25" fill="#D9D9D9" />
            </g>
          </g>
        </>
      )}

      {/* Book (only mount when it should appear inside the white circle) */}
      {shouldRenderBook && (
        <g
          aria-hidden="true"
          clipPath={`url(#bearCircleMaskReading${idSuffix})`}
          transform={getBookTransformAttr()}
          style={{
            transform: getBookTransform(),
            transition: 'transform 420ms cubic-bezier(0.4, 0, 0.2, 1)',
            transformOrigin: 'center bottom',
            pointerEvents: 'none',
          }}
        >
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
      )}
    </svg>
  );
});

BearIconReading.displayName = 'BearIconReading';
export default BearIconReading;
