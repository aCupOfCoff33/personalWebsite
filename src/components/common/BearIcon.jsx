// Optimized: memoized interactive SVG to avoid unnecessary re-renders
import React, { useState, useRef, useEffect, useCallback } from 'react';

const MAX_HIGHLIGHT_MOVEMENT = 1.5; // Max pixels the highlight can move from center
const BLINK_DURATION_MS = 120;

const BearIconSVG_New = React.memo(({ className = '' }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const svgRef = useRef(null);
  // Refs for the white highlight circles in the NEW SVG
  const leftHighlightRef = useRef(null);
  const rightHighlightRef = useRef(null);
  const blinkTimeoutRef = useRef(null);
  const periodicBlinkTimeoutRef = useRef(null);
  const rafRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => { isMountedRef.current = true; return () => { isMountedRef.current = false; }; }, []);

  // --- Blinking Logic (Optimized to avoid double setState) ---
  const triggerBlink = useCallback(() => {
    if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    setIsBlinking(true);
    blinkTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) setIsBlinking(false);
      blinkTimeoutRef.current = null;
    }, BLINK_DURATION_MS);
  }, []);

  const schedulePeriodicBlink = useCallback(() => {
    if (periodicBlinkTimeoutRef.current) clearTimeout(periodicBlinkTimeoutRef.current);
    // Ensure correct operator precedence: (Math.random() * 4000) + 1000
    const delay = Math.random() * 4000 + 1000;
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
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      if (isMountedRef.current) setIsBlinking(false);
    };
  }, [schedulePeriodicBlink]);

  // --- Cursor Tracking Logic (Optimized with requestAnimationFrame throttling) ---
  useEffect(() => {
    const svgElement = svgRef.current;
    const leftHighlight = leftHighlightRef.current;
    const rightHighlight = rightHighlightRef.current;

    if (!svgElement || !leftHighlight || !rightHighlight) return;

    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (event) => {
      currentMouseX = event.clientX;
      currentMouseY = event.clientY;
      
      // Only update if there's no pending animation frame
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          updateHighlights(currentMouseX, currentMouseY);
          rafRef.current = null;
        });
      }
    };
    
    const updateHighlights = (clientX, clientY) => {
      const moveHighlight = (highlightRef) => {
        const el = highlightRef.current;
        if (!el) return;
    
        const bbox = el.getBoundingClientRect();
        const centerX = bbox.left + bbox.width / 2;
        const centerY = bbox.top + bbox.height / 2;
    
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
    
        // Normalize direction vector
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const normX = distance === 0 ? 0 : deltaX / distance;
        const normY = distance === 0 ? 0 : deltaY / distance;
    
        const translateX = normX * MAX_HIGHLIGHT_MOVEMENT;
        const translateY = normY * MAX_HIGHLIGHT_MOVEMENT;
    
        el.style.transform = `translate(${translateX}px, ${translateY}px)`;
      };
    
      moveHighlight(leftHighlightRef);
      moveHighlight(rightHighlightRef);
    };

    const handleMouseLeave = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (leftHighlightRef.current) leftHighlightRef.current.style.transform = `translate(0px, 0px)`;
      if (rightHighlightRef.current) rightHighlightRef.current.style.transform = `translate(0px, 0px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // --- Click Handler ---
  const handleClick = () => {
    triggerBlink();
  };

  // --- Styles (Identical) ---
  const trackingTransitionStyle = {
    transition: `transform 0.1s ease-out`,
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
      viewBox="0 0 68 68" // New viewBox for updated design
      fill="none"
      className={className} // Apply external size/margin
      role="img"
      aria-hidden="true"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <circle cx="34" cy="34" r="34" fill="#E7E9E8"/>
      
      {/* Ears */}
      <ellipse cx="50.3702" cy="18.7096" rx="4.31746" ry="3.95767" fill="#93501C"/>
      <ellipse cx="17.63" cy="19.067" rx="4.31746" ry="3.95767" fill="#93501C"/>
      <path d="M50.0107 12.2363C53.3887 12.2363 56.127 14.9745 56.127 18.3525C56.1269 20.9913 54.4559 23.239 52.1143 24.0967C51.5227 23.3373 50.8924 22.6156 50.2275 21.9336C50.334 21.9436 50.4418 21.9492 50.5508 21.9492C52.4384 21.9492 53.9686 20.4188 53.9688 18.5312C53.9688 16.6435 52.4385 15.1133 50.5508 15.1133C48.6631 15.1133 47.1328 16.6436 47.1328 18.5312C47.1328 18.7959 47.1637 19.0534 47.2207 19.3008C46.1965 18.542 45.1157 17.8682 43.9883 17.2852C44.4932 14.4161 46.997 12.2365 50.0107 12.2363Z" fill="#AB6225"/>
      <path d="M17.2695 12.5938C20.1682 12.5938 22.594 14.6107 23.2246 17.3174C22.5325 17.6782 21.8583 18.0735 21.2041 18.502C21.0118 16.7966 19.5653 15.4707 17.8086 15.4707C15.9212 15.4708 14.3909 17.0013 14.3906 18.8887C14.3906 20.4347 15.4175 21.7409 16.8262 22.1631C16.1645 22.8593 15.5387 23.5962 14.9521 24.3701C12.7237 23.4567 11.1533 21.2674 11.1533 18.71C11.1534 15.3321 13.8917 12.5939 17.2695 12.5938Z" fill="#AB6225"/>
      
      {/* Head */}
      <path d="M33.6406 14.75C47.1716 14.75 58.1406 24.6557 58.1406 36.875C58.1406 49.0943 47.1716 59 33.6406 59C20.1096 59 9.14062 49.0943 9.14062 36.875C9.14062 24.6557 20.1096 14.75 33.6406 14.75Z" fill="#B56A2B"/>
      
      {/* Muzzle */}
      <path d="M34 34C40.9229 34 42.9999 40.7853 43 44.5322C43 51.6425 38.9076 53 34.0645 53C29.2215 52.9999 25 50.9637 25 44.5322C25.0001 40.7853 27.0771 34 34 34Z" fill="#CD853F"/>
      
      {/* Mouth details */}
      <path d="M30.4018 45.6937C30.3419 45.6937 30.042 45.5138 29.3225 44.7942C28.6029 44.0746 29.1426 43.7748 29.5024 43.7148C29.5623 43.9547 30.042 44.5783 31.4812 45.154C33.2801 45.8736 33.8198 44.0746 33.8198 44.7942C33.8198 45.5138 33.8198 45.6937 33.1002 46.0535C32.5246 46.3413 31.6611 46.1734 31.3013 46.0535L30.4018 45.6937Z" fill="#241E16" stroke="#281E11"/>
      <path d="M37.063 45.6937C37.123 45.6937 37.4228 45.5138 38.1424 44.7942C38.862 44.0746 38.3223 43.7748 37.9625 43.7148C37.9025 43.9547 37.4228 44.5783 35.9836 45.154C34.1847 45.8736 33.645 44.0746 33.645 44.7942C33.645 45.5138 33.645 45.6937 34.3646 46.0535C34.9403 46.3413 35.8038 46.1734 36.1635 46.0535L37.063 45.6937Z" fill="#241E16" stroke="#281E11"/>
      <rect x="33.6399" y="38.676" width="0.359788" height="6.83598" fill="#241E16" stroke="#281E11" strokeWidth="0.359788"/>
      <path d="M33.8203 36.8379C34.8324 36.8379 35.7253 37.0999 36.3496 37.4971C36.98 37.8982 37.2773 38.3912 37.2773 38.8564C37.2773 39.3217 36.9799 39.8147 36.3496 40.2158C35.7253 40.613 34.8324 40.8749 33.8203 40.875C32.808 40.875 31.9144 40.6131 31.29 40.2158C30.6597 39.8147 30.3623 39.3217 30.3623 38.8564C30.3623 38.3912 30.6597 37.8982 31.29 37.4971C31.9144 37.0998 32.808 36.8379 33.8203 36.8379Z" fill="#241E16" stroke="#281E11"/>

      {/* --- Animated Eyes (Applied to NEW SVG structure) --- */}
      {/* Left Eye Group (for blinking) */}
      <g style={eyeBlinkStyle}>
          {/* Pupil Ellipse (static relative to blink group) */}
          <ellipse cx="23.3865" cy="34.1803" rx="3.2381" ry="3.95767" fill="#271711"/>
          {/* Highlight Circle (gets ref and tracking style) */}
          <circle ref={leftHighlightRef} cx="23.5757" cy="33.1655" r="1.19873" fill="#D9D9D9" style={trackingTransitionStyle}/>
      </g>

      {/* Right Eye Group (for blinking) */}
      <g style={eyeBlinkStyle}>
          {/* Pupil Ellipse (static relative to blink group) */}
          <ellipse cx="44.2381" cy="33.9577" rx="3.2381" ry="3.95767" fill="#271711"/>
          {/* Highlight Circle (gets ref and tracking style) */}
          <circle ref={rightHighlightRef} cx="44.354" cy="33.1655" r="1.19873" fill="#D9D9D9" style={trackingTransitionStyle}/>
      </g>
    </svg>
  );
});

BearIconSVG_New.displayName = 'BearIconSVG_New';

export default BearIconSVG_New; // Optimized for performance by wrapping with React.memo
