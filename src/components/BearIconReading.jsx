// Reading bear component that syncs page flips with note sections
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNotesTOC } from './notes/NotesContext';

const MAX_HIGHLIGHT_MOVEMENT = 1.5; // highlight wobble (inside the iris)
const BLINK_DURATION_MS = 120;

// reading motion tuning - slowed down as requested
const EYE_SCAN_AMPLITUDE_PX = 2.0;   // horizontal sweep (reduced from 2.6)
const EYE_SCAN_DOWN_BIAS_PX = 1.4;   // eyes look slightly down toward the book
const EYE_SCAN_PERIOD_MS = 3200;     // time to scan left -> right (increased from 1800)
const SACCADE_THRESHOLD = 0.85;      // when to snap back left (reduced from 0.9)

const PAGE_FLIP_DURATION_MS = 320;
const PAGE_FLIP_DEG = -12;

const BearIconReading = React.memo(({ className = '' }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const svgRef = useRef(null);

  // Eye highlight refs (tiny white dots)
  const leftHighlightRef = useRef(null);
  const rightHighlightRef = useRef(null);

  // Whole iris+pupil groups — we animate these for the reading motion
  const leftIrisGroupRef = useRef(null);
  const rightIrisGroupRef = useRef(null);

  // Page flip refs - separate from covers
  const pageRef = useRef(null);

  // timers/raf
  const blinkTimeoutRef = useRef(null);
  const periodicBlinkTimeoutRef = useRef(null);
  const scanStartRef = useRef(null);
  const pageFlipResetTimeoutRef = useRef(null);

  // Get TOC context to track section changes
  const { tocItems, readingProgress } = useNotesTOC();

  // --- Blinking ---
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
    const delay = Math.random() * 5000 + 2000; // slower blinks when reading
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

  // --- Eye tracking removed for reading focus ---

  // --- Reading scan motion for pupils (sawtooth: sweep L->R, snap left) ---
  useEffect(() => {
    const left = leftIrisGroupRef.current;
    const right = rightIrisGroupRef.current;
    if (!left || !right) return;

    let rafId;
    const tick = (t) => {
      if (scanStartRef.current == null) scanStartRef.current = t;
      const elapsed = t - scanStartRef.current;
      const p = (elapsed % EYE_SCAN_PERIOD_MS) / EYE_SCAN_PERIOD_MS; // 0..1
      const isSaccade = p > SACCADE_THRESHOLD;
      const progress = isSaccade ? 0 : p / SACCADE_THRESHOLD; // normalize 0..1 before saccade

      // map to -amp .. +amp then snap back
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

  // --- Track section changes for page flips ---
  useEffect(() => {
    if (!tocItems?.length) return;
    
    // Calculate which section we're currently in based on reading progress
    const newSectionIndex = Math.floor(readingProgress * tocItems.length);
    const clampedIndex = Math.max(0, Math.min(newSectionIndex, tocItems.length - 1));
    
    if (clampedIndex !== currentSectionIndex) {
      setCurrentSectionIndex(clampedIndex);
      
      // Trigger page flip animation (flip from left to right)
      const page = pageRef.current;
      if (page) {
        page.style.transition = `transform ${PAGE_FLIP_DURATION_MS}ms ease-in-out`;
        page.style.transformOrigin = '32px 110px'; // left spine edge
        page.style.transform = `rotateY(${PAGE_FLIP_DEG}deg)`;

        if (pageFlipResetTimeoutRef.current) {
          clearTimeout(pageFlipResetTimeoutRef.current);
        }
        
        pageFlipResetTimeoutRef.current = setTimeout(() => {
          if (page) {
            page.style.transform = 'rotateY(0deg)';
          }
        }, PAGE_FLIP_DURATION_MS);
      }
    }
  }, [tocItems, readingProgress, currentSectionIndex]);

  // Cleanup page flip timeouts
  useEffect(() => {
    return () => {
      if (pageFlipResetTimeoutRef.current) {
        clearTimeout(pageFlipResetTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    // click to blink; feels natural while "reading"
    triggerBlink();
  };

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
        {/* Reddish book gradients */}
        <linearGradient id="bookLeft" x1="39" y1="74" x2="64" y2="116" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C73B33" />
          <stop offset="1" stopColor="#9E2B26" />
        </linearGradient>
        <linearGradient id="bookRight" x1="88" y1="74" x2="64" y2="116" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D85C55" />
          <stop offset="1" stopColor="#A1332D" />
        </linearGradient>
      </defs>

      {/* Bear base */}
      <circle cx="63.8175" cy="63.8175" r="63.8175" fill="#E7E9E8"/>
      <ellipse cx="94.5444" cy="35.1165" rx="8.10381" ry="7.42849" fill="#8D4C16"/>
      <ellipse cx="33.0905" cy="35.7918" rx="8.10381" ry="7.42849" fill="#8D4C16"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M103.954 99.9468C107.008 93.2376 108.726 85.6695 108.726 77.6615C108.726 50.0619 88.3175 27.688 63.1422 27.688C37.9669 27.688 17.5583 50.0619 17.5583 77.6615C17.5583 85.6695 19.2764 93.2376 22.3306 99.9468H103.954ZM63.2227 127.635H63.0616C63.0885 127.635 63.1153 127.635 63.1422 127.635C63.169 127.635 63.1958 127.635 63.2227 127.635Z" fill="#A96229"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M79.1457 99.9468C80.3559 96.6003 81.0381 92.8139 81.0381 88.8039C81.0381 75.1906 73.177 64.1548 63.4798 64.1548C53.7827 64.1548 45.9216 75.1906 45.9216 88.8039C45.9216 92.8139 46.6037 96.6003 47.8139 99.9468H79.1457Z" fill="#C6843F"/>
      <path d="M57.0643 85.765C56.9517 85.765 56.389 85.4274 55.0383 84.0767C53.6877 82.7261 54.7007 82.1633 55.376 82.0508C55.4885 82.501 56.389 83.6715 59.0902 84.752C62.4668 86.1027 63.4798 82.7261 63.4798 84.0767C63.4798 85.4274 63.4798 85.765 62.1292 86.4403C61.0487 86.9806 59.4279 86.6654 58.7526 86.4403L57.0643 85.765Z" fill="#241E16" stroke="#281E11"/>
      <path d="M69.5672 85.765C69.6798 85.765 70.2426 85.4274 71.5932 84.0767C72.9438 82.7261 71.9309 82.1633 71.2555 82.0508C71.143 82.501 70.2426 83.6715 67.5413 84.752C64.1647 86.1027 63.1517 82.7261 63.1517 84.0767C63.1517 85.4274 63.1517 85.765 64.5024 86.4403C65.5829 86.9806 67.2036 86.6654 67.8789 86.4403L69.5672 85.765Z" fill="#241E16" stroke="#281E11"/>
      <rect x="63.1422" y="72.5964" width="0.675317" height="12.831" fill="#241E16" stroke="#281E11" strokeWidth="0.675317"/>
      <path d="M70.4083 72.9343C70.4083 74.0094 69.7226 75.0542 68.4641 75.8551C67.2116 76.6521 65.4507 77.1615 63.4798 77.1615C61.5089 77.1615 59.748 76.6521 58.4955 75.8551C57.2371 75.0542 56.5513 74.0094 56.5513 72.9343C56.5513 71.8591 57.2371 70.8143 58.4955 70.0134C59.748 69.2164 61.5089 68.707 63.4798 68.707C65.4507 68.707 67.2116 69.2164 68.4641 70.0134C69.7226 70.8143 70.4083 71.8591 70.4083 72.9343Z" fill="#241E16" stroke="#281E11"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M82.563 32.4375C83.5109 27.0524 88.2122 22.9609 93.8691 22.9609C100.21 22.9609 105.349 28.1009 105.349 34.4413C105.349 39.3937 102.214 43.6137 97.8192 45.2241C96.7101 43.8004 95.5293 42.4458 94.2829 41.1671C94.4802 41.1853 94.68 41.1947 94.8821 41.1947C98.4253 41.1947 101.298 38.3223 101.298 34.7791C101.298 31.236 98.4253 28.3636 94.8821 28.3636C91.3389 28.3636 88.4666 31.236 88.4666 34.7791C88.4666 35.2759 88.523 35.7595 88.6299 36.2239C86.707 34.7996 84.6796 33.5319 82.563 32.4375Z" fill="#9E5719"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M28.0651 45.7447C23.8816 44.0305 20.9348 39.9179 20.9348 35.1171C20.9348 28.7767 26.0748 23.6367 32.4152 23.6367C37.8562 23.6367 42.4132 27.4218 43.5966 32.5025C42.2969 33.1798 41.0312 33.9224 39.8029 34.7267C39.4414 31.5262 36.7252 29.0391 33.4282 29.0391C29.885 29.0391 27.0127 31.9115 27.0127 35.4546C27.0127 38.3567 28.9396 40.8088 31.5838 41.6011C30.3414 42.9082 29.1664 44.2917 28.0651 45.7447Z" fill="#9E5719"/>

      {/* --- Eyes rendered first (behind book) --- */}
      {/* Left Eye (iris group moves; highlight static for reading) */}
      <g style={eyeBlinkStyle}>
        <g ref={leftIrisGroupRef} style={{ transition: 'transform 100ms linear' }}>
          <ellipse cx="43.8956" cy="64.1551" rx="6.07785" ry="7.42849" fill="#271711"/>
          <circle ref={leftHighlightRef} cx="44.25" cy="62.25" r="2.25" fill="#D9D9D9"/>
        </g>
      </g>

      {/* Right Eye */}
      <g style={eyeBlinkStyle}>
        <g ref={rightIrisGroupRef} style={{ transition: 'transform 100ms linear' }}>
          <ellipse cx="83.064" cy="64.1551" rx="6.07785" ry="7.42849" fill="#271711"/>
          <circle ref={rightHighlightRef} cx="83.25" cy="62.25" r="2.25" fill="#D9D9D9"/>
        </g>
      </g>

      {/* --- BIGGER BOOK (rendered on top of eyes) --- */}
      <g aria-hidden="true">
        {/* Pages that flip (lower z-index, behind covers) */}
        <g ref={pageRef} style={{ transformOrigin: '32px 110px' }}>
          <path d="M64 80 L32 68 L32 116 L64 122 Z" fill="#F6ECEB" />
          {/* Page text lines */}
          <g stroke="#C4B5B3" strokeWidth="0.8">
            <line x1="36" y1="82" x2="60" y2="78" />
            <line x1="37" y1="88" x2="59" y2="84" />
            <line x1="37" y1="94" x2="59" y2="90" />
            <line x1="37" y1="100" x2="59" y2="96" />
            <line x1="37" y1="106" x2="59" y2="102" />
            <line x1="37" y1="112" x2="59" y2="108" />
          </g>
        </g>
        
        {/* Static book covers (higher z-index, on top) */}
        <path d="M64 78 L32 66 L32 118 L64 124 Z" fill="url(#bookLeft)" />
        <path d="M64 78 L96 66 L96 118 L64 124 Z" fill="url(#bookRight)" />
        
        {/* spine + fold (on top) */}
        <path d="M64 78 L64 124" stroke="#E6D3D1" strokeWidth="2"/>
        
        {/* Right page static text lines */}
        <g stroke="#EBD9D6" strokeWidth="0.8">
          <line x1="68" y1="84" x2="92" y2="78" />
          <line x1="69" y1="90" x2="91" y2="84" />
          <line x1="69" y1="96" x2="91" y2="90" />
          <line x1="69" y1="102" x2="91" y2="96" />
          <line x1="69" y1="108" x2="91" y2="102" />
        </g>
      </g>
    </svg>
  );
});

BearIconReading.displayName = 'BearIconReading';
export default BearIconReading;
