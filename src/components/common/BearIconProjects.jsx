// Bear with MacBook (trapezoid lid in front, Figma gradients, Apple logo)
// - Laptop fully in front
// - Trapezoid shape (top wider than bottom)
// - No white outline, no center pill, no bottom gray bar
// - Subtle drop shadow toward the middle using feDropShadow + inner vignette
// - Animated laptop positioning based on route transitions
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useBearState } from '../../hooks/useBearState';
import BearEars from './BearEars';

const MAX_HIGHLIGHT_MOVEMENT = 1.5; // highlight wobble inside pupils
const BLINK_DURATION_MS = 120;

// subtle, slow reading scan
const EYE_SCAN_AMPLITUDE_PX = 2.0;
const EYE_SCAN_DOWN_BIAS_PX = 1.2;
const EYE_SCAN_PERIOD_MS = 3200; // slow sweep
const SACCADE_THRESHOLD = 0.85;  // snap back near end

const BearIconProjects = React.memo(({ className = '', showBase = true, idSuffix = '' }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const svgRef = useRef(null);
  const { bearState } = useBearState();

  // Eyes
  const leftIrisGroupRef = useRef(null);
  const rightIrisGroupRef = useRef(null);

  // timers
  const blinkTimeoutRef = useRef(null);
  const periodicBlinkTimeoutRef = useRef(null);
  const scanStartRef = useRef(null);

  // Eye-look state and timers (autonomous random looks, both eyes look together)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const lookTimeoutRef = useRef(null);
  const settleTimeoutRef = useRef(null);

  const MAX_LOOK_PX = 3; // maximum pupil offset in px
  const LOOK_MIN_MS = 1200;
  const LOOK_MAX_MS = 4500;

  // Calculate laptop position based on bear state. Honor previousType so the laptop can animate out.
  const getLaptopTransform = () => {
    // Outgoing: if we were projects and are transitioning down, slide it away (check this first)
    if (bearState.previousType === 'projects' && bearState.itemPosition === 'transitioning-down') {
      return 'translateY(60px)';
    }

    // Incoming from home
    if (bearState.pendingType === 'projects') {
      if (bearState.itemPosition === 'hidden') return 'translateY(60px)';
      if (bearState.itemPosition === 'transitioning-up') return 'translateY(0px)';
    }

    // Current state is projects
    if (bearState.currentType === 'projects') {
      return 'translateY(0px)';
    }

    return 'translateY(60px)';
  };

  const getLaptopTransformAttr = () => {
    return 'translate(0, -8)'; // slight upward bias
  };

  const shouldRenderLaptop = bearState?.currentType === 'projects' || bearState?.pendingType === 'projects' || bearState?.previousType === 'projects';

  const isMountedRef = useRef(true);
  useEffect(() => { isMountedRef.current = true; return () => { isMountedRef.current = false; }; }, []);

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
    const delay = Math.random() * 4000 + 1000;
    periodicBlinkTimeoutRef.current = setTimeout(() => {
      triggerBlink();
      schedulePeriodicBlink();
    }, delay);
  }, [triggerBlink]);

  // Eye scanning with saccade snap back
  const startEyeScan = useCallback(() => {
    if (scanStartRef.current) return;
    scanStartRef.current = Date.now();

    const animate = () => {
      if (!scanStartRef.current || !isMountedRef.current) return;
      const elapsed = Date.now() - scanStartRef.current;
      const progress = (elapsed % EYE_SCAN_PERIOD_MS) / EYE_SCAN_PERIOD_MS;

      if (progress > SACCADE_THRESHOLD) {
        setEyeOffset({ x: 0, y: 0 });
      } else {
        const theta = progress * 2 * Math.PI;
        const amplitude = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.5;
        setEyeOffset({
          x: Math.sin(theta) * EYE_SCAN_AMPLITUDE_PX * amplitude,
          y: EYE_SCAN_DOWN_BIAS_PX + Math.cos(theta) * EYE_SCAN_AMPLITUDE_PX * amplitude * 0.7,
        });
      }

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  const lookRandomly = useCallback(() => {
    if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    const x = (Math.random() - 0.5) * 2 * MAX_LOOK_PX;
    const y = (Math.random() - 0.5) * 2 * MAX_LOOK_PX;
    setEyeOffset({ x, y });

    settleTimeoutRef.current = setTimeout(() => {
      setEyeOffset({ x: 0, y: 0 });
    }, 800 + Math.random() * 400);

    const nextDelay = LOOK_MIN_MS + Math.random() * (LOOK_MAX_MS - LOOK_MIN_MS);
    lookTimeoutRef.current = setTimeout(lookRandomly, nextDelay);
  }, []);

  useEffect(() => {
    schedulePeriodicBlink();
    startEyeScan();
    lookRandomly();

    return () => {
      [blinkTimeoutRef, periodicBlinkTimeoutRef, lookTimeoutRef, settleTimeoutRef].forEach(ref => {
        if (ref.current) clearTimeout(ref.current);
      });
      scanStartRef.current = null;
      if (isMountedRef.current) setIsBlinking(false);
    };
  }, [schedulePeriodicBlink, startEyeScan, lookRandomly]);

  const handleClick = () => {
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
      viewBox="0 0 68 68"
      fill="none"
      className={className}
      role="img"
      aria-hidden="true"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <defs>
        <filter id={`lidShadow${idSuffix}`} x="0%" y="0%" width="100%" height="100%">
          <feDropShadow dx="0" dy="2.12" stdDeviation="3.18" floodColor="#1a1a1a" floodOpacity="0.4"/>
        </filter>
        <clipPath id={`bearCircleMask${idSuffix}`}>
          <circle cx="34" cy="34" r="34"/>
        </clipPath>
        <linearGradient id={`lidLinear${idSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8E8E8"/>
          <stop offset="100%" stopColor="#C0C0C0"/>
        </linearGradient>
        <linearGradient id={`lidInnerTop${idSuffix}`} x1="0%" y1="0%" x2="0%" y2="25%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
        </linearGradient>
        <radialGradient id={`lidCenterLight${idSuffix}`} cx="50%" cy="25%" r="40%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id={`appleGrad${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#666666"/>
          <stop offset="100%" stopColor="#333333"/>
        </linearGradient>
      </defs>

      {showBase && (
        <>
          <circle cx="34" cy="34" r="34" fill="#E7E9E8"/>
          <BearEars />
          <path d="M33.6406 14.75C47.1716 14.75 58.1406 24.6557 58.1406 36.875C58.1406 49.0943 47.1716 59 33.6406 59C20.1096 59 9.14062 49.0943 9.14062 36.875C9.14062 24.6557 20.1096 14.75 33.6406 14.75Z" fill="#B56A2B"/>
          <path d="M34 34C40.9229 34 42.9999 40.7853 43 44.5322C43 51.6425 38.9076 53 34.0645 53C29.2215 52.9999 25 50.9637 25 44.5322C25.0001 40.7853 27.0771 34 34 34Z" fill="#CD853F"/>
          <path d="M30.4018 45.6937C30.3419 45.6937 30.042 45.5138 29.3225 44.7942C28.6029 44.0746 29.1426 43.7748 29.5024 43.7148C29.5623 43.9547 30.042 44.5783 31.4812 45.154C33.2801 45.8736 33.8198 44.0746 33.8198 44.7942C33.8198 45.5138 33.8198 45.6937 33.1002 46.0535C32.5246 46.3413 31.6611 46.1734 31.3013 46.0535L30.4018 45.6937Z" fill="#241E16" stroke="#281E11"/>
          <path d="M37.063 45.6937C37.123 45.6937 37.4228 45.5138 38.1424 44.7942C38.862 44.0746 38.3223 43.7748 37.9625 43.7148C37.9025 43.9547 37.4228 44.5783 35.9836 45.154C34.1847 45.8736 33.645 44.0746 33.645 44.7942C33.645 45.5138 33.645 45.6937 34.3646 46.0535C34.9403 46.3413 35.8038 46.1734 36.1635 46.0535L37.063 45.6937Z" fill="#241E16" stroke="#281E11"/>
          <rect x="33.6399" y="38.676" width="0.359788" height="6.83598" fill="#241E16" stroke="#281E11" strokeWidth="0.359788"/>
          <path d="M33.8203 36.8379C34.8324 36.8379 35.7253 37.0999 36.3496 37.4971C36.98 37.8982 37.2773 38.3912 37.2773 38.8564C37.2773 39.3217 36.9799 39.8147 36.3496 40.2158C35.7253 40.613 34.8324 40.8749 33.8203 40.875C32.808 40.875 31.9144 40.6131 31.29 40.2158C30.6597 39.8147 30.3623 39.3217 30.3623 38.8564C30.3623 38.3912 30.6597 37.8982 31.29 37.4971C31.9144 37.0998 32.808 36.8379 33.8203 36.8379Z" fill="#241E16" stroke="#281E11"/>

          <g style={eyeBlinkStyle}>
            <g ref={leftIrisGroupRef} style={{ transition: 'transform 100ms linear' }}>
              <ellipse cx="23.3865" cy="34.1803" rx="3.2381" ry="3.95767" fill="#271711"/>
              <g
                style={{
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  transition: 'transform 280ms cubic-bezier(.2,.9,.3,1)',
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                }}
              >
                <circle cx="23.5757" cy="33.1655" r="1.19873" fill="#D9D9D9"/>
              </g>
            </g>
          </g>
          <g style={eyeBlinkStyle}>
            <g ref={rightIrisGroupRef} style={{ transition: 'transform 100ms linear' }}>
              <ellipse cx="44.2381" cy="33.9577" rx="3.2381" ry="3.95767" fill="#271711"/>
              <g
                style={{
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  transition: 'transform 280ms cubic-bezier(.2,.9,.3,1)',
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                }}
              >
                <circle cx="44.354" cy="33.1655" r="1.19873" fill="#D9D9D9"/>
              </g>
            </g>
          </g>
        </>
      )}

      {/* macbook - animated positioning; only mount when it should appear inside the white circle */}
      {shouldRenderLaptop && (
        <g
          filter={`url(#lidShadow${idSuffix})`}
          clipPath={`url(#bearCircleMask${idSuffix})`}
          transform={getLaptopTransformAttr()}
          style={{
            transform: getLaptopTransform(),
            transition: 'transform 420ms cubic-bezier(0.4, 0, 0.2, 1)',
            transformOrigin: 'center bottom',
            pointerEvents: 'none', // avoid intercepting clicks when overlaid
          }}
        >
          <g aria-hidden="true">
            <path id={`lidShape${idSuffix}`} d="M24 72 L104 72 Q106 72 105.73 73.98 L100.27 114.02 Q100 116 98 116 L30 116 Q28 116 27.73 114.02 L22.27 73.98 Q22 72 24 72 Z" fill={`url(#lidLinear${idSuffix})`} />
            {/* Inner top shadow + center light overlays reuse same rounded shape */}
            <path d="M24 72 L104 72 Q106 72 105.73 73.98 L100.27 114.02 Q100 116 98 116 L30 116 Q28 116 27.73 114.02 L22.27 73.98 Q22 72 24 72 Z" fill={`url(#lidInnerTop${idSuffix})`} />
            <path d="M24 72 L104 72 Q106 72 105.73 73.98 L100.27 114.02 Q100 116 98 116 L30 116 Q28 116 27.73 114.02 L22.27 73.98 Q22 72 24 72 Z" fill={`url(#lidCenterLight${idSuffix})`} />
            {/* Apple logo (provided path) centered, smaller scale */}
            <g transform="translate(64 94) scale(0.75) translate(-12 -12)">
              <path fill={`url(#appleGrad${idSuffix})`} d="M17.05 20.28c-.98.95-2.05.8-3.08.35c-1.09-.46-2.09-.48-3.24 0c-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8c1.18-.24 2.31-.93 3.57-.84c1.51.12 2.65.72 3.4 1.8c-3.12 1.87-2.38 5.98.48 7.13c-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25c.29 2.58-2.34 4.5-3.74 4.25" />
            </g>
          </g>
        </g>
      )}
    </svg>
  );
});

BearIconProjects.displayName = 'BearIconProjects';
export default BearIconProjects;
