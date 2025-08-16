// Bear with MacBook (trapezoid lid in front, Figma gradients, Apple logo)
// - Laptop fully in front
// - Trapezoid shape (top wider than bottom)
// - No white outline, no center pill, no bottom gray bar
// - Subtle drop shadow toward the middle using feDropShadow + inner vignette
// - Animated laptop positioning based on route transitions
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useBearState } from './useBearState';

const MAX_HIGHLIGHT_MOVEMENT = 1.5; // highlight wobble inside pupils
const BLINK_DURATION_MS = 120;

// subtle, slow reading scan
const EYE_SCAN_AMPLITUDE_PX = 2.0;
const EYE_SCAN_DOWN_BIAS_PX = 1.2;
const EYE_SCAN_PERIOD_MS = 3200; // slow sweep
const SACCADE_THRESHOLD = 0.85;  // snap back near end

const BearIconProjects = React.memo(({ className = '' }) => {
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
    // Incoming from home
    if (bearState.pendingType === 'projects') {
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

    // Active/current projects page
    if (bearState.currentType === 'projects') {
      if (bearState.itemPosition === 'hidden') return 'translateY(60px)';
      return 'translateY(0px)';
    }

    // Outgoing: if we were projects and are transitioning down, slide it away
    if (bearState.previousType === 'projects' && bearState.itemPosition === 'transitioning-down') {
      return 'translateY(60px)';
    }

    return 'translateY(60px)';
  };

  const getLaptopTransformAttr = () => {
    const tx = getLaptopTransform();
    if (tx.startsWith('translateY')) {
      const num = tx.replace(/translateY\(|px\)/g, '');
      return `translate(0 ${num})`;
    }
    return 'translate(0 0)';
  };

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
    const delay = Math.random() * 5000 + 2000; // calmer blink cadence while "reading"
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
      const p = (elapsed % EYE_SCAN_PERIOD_MS) / EYE_SCAN_PERIOD_MS; // 0..1
      const isSaccade = p > SACCADE_THRESHOLD;
      const progress = isSaccade ? 0 : p / SACCADE_THRESHOLD; // normalize 0..1 before saccade
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

  // Autonomous random eye-look behavior
  const scheduleRandomLook = useCallback(() => {
    if (lookTimeoutRef.current) clearTimeout(lookTimeoutRef.current);
    const delay = Math.random() * (LOOK_MAX_MS - LOOK_MIN_MS) + LOOK_MIN_MS;
    lookTimeoutRef.current = setTimeout(() => {
      const randomOffset = () => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * MAX_LOOK_PX;
        // Slightly squash Y so eyes mostly move horizontally
        return { x: Math.round(Math.cos(angle) * radius), y: Math.round(Math.sin(angle) * radius * 0.6) };
      };
      const off = randomOffset();
      setEyeOffset(off);

      // Small settle back to center after a short glance, then schedule next look
      const settleDelay = Math.random() * 500 + 200;
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = setTimeout(() => {
        setEyeOffset({ x: 0, y: 0 });
        scheduleRandomLook();
      }, settleDelay);
    }, delay);
  }, []);

  useEffect(() => {
    scheduleRandomLook();
    return () => {
      if (lookTimeoutRef.current) clearTimeout(lookTimeoutRef.current);
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    };
  }, [scheduleRandomLook]);

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
      aria-label="Bear with a MacBook"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <defs>
        <linearGradient id="lidLinear" x1="0" y1="72" x2="0" y2="116" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BEBFC3"/>
          <stop offset="100%" stopColor="#5A5B5D"/>
        </linearGradient>
        <linearGradient id="lidInnerTop" x1="0" y1="72" x2="0" y2="116" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(0,0,0,0.25)"/>
          <stop offset="35%" stopColor="rgba(0,0,0,0)"/>
        </linearGradient>
        <radialGradient id="lidCenterLight" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.16)"/>
          <stop offset="70%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        {/* Apple logo */}
        <linearGradient id="appleGrad" x1="0" y1="-12" x2="0" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D8D9DD"/>
          <stop offset="100%" stopColor="#BDBEC2"/>
        </linearGradient>
        {/* Drop shadow under lid */}
        <filter id="lidShadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.28"/>
        </filter>
        {/* Clipping mask to contain laptop within bear circle */}
        <clipPath id="bearCircleMask">
          <circle cx="63.8175" cy="63.8175" r="63.8175"/>
        </clipPath>
      </defs>

      {/* Bear */}
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

      {/* blinking eyes */}
      <g style={eyeBlinkStyle}>
        <g ref={leftIrisGroupRef} style={{ transition: 'transform 100ms linear' }}>
          <ellipse cx="43.8956" cy="64.1551" rx="6.07785" ry="7.42849" fill="#271711"/>
          {/* Pupil/highlight group — translated to simulate looking around */}
          <g
            style={{
              transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
              transition: 'transform 280ms cubic-bezier(.2,.9,.3,1)',
              transformBox: 'fill-box',
              transformOrigin: 'center',
            }}
          >
            <circle cx="44.25" cy="62.25" r="2.25" fill="#D9D9D9"/>
          </g>
        </g>
      </g>
      <g style={eyeBlinkStyle}>
        <g ref={rightIrisGroupRef} style={{ transition: 'transform 100ms linear' }}>
          <ellipse cx="83.064" cy="64.1551" rx="6.07785" ry="7.42849" fill="#271711"/>
          <g
            style={{
              transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
              transition: 'transform 280ms cubic-bezier(.2,.9,.3,1)',
              transformBox: 'fill-box',
              transformOrigin: 'center',
            }}
          >
            <circle cx="83.25" cy="62.25" r="2.25" fill="#D9D9D9"/>
          </g>
        </g>
      </g>

      {/* macbook - animated positioning */}
      <g 
        filter="url(#lidShadow)"
        clipPath="url(#bearCircleMask)"
        transform={getLaptopTransformAttr()}
        style={{
          transform: getLaptopTransform(),
          transition: 'transform 420ms cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: 'center bottom'
        }}
      >
        <g aria-hidden="true">
          <path id="lidShape" d="M24 72 L104 72 Q106 72 105.73 73.98 L100.27 114.02 Q100 116 98 116 L30 116 Q28 116 27.73 114.02 L22.27 73.98 Q22 72 24 72 Z" fill="url(#lidLinear)"/>
          {/* Inner top shadow + center light overlays reuse same rounded shape */}
          <path d="M24 72 L104 72 Q106 72 105.73 73.98 L100.27 114.02 Q100 116 98 116 L30 116 Q28 116 27.73 114.02 L22.27 73.98 Q22 72 24 72 Z" fill="url(#lidInnerTop)"/>
          <path d="M24 72 L104 72 Q106 72 105.73 73.98 L100.27 114.02 Q100 116 98 116 L30 116 Q28 116 27.73 114.02 L22.27 73.98 Q22 72 24 72 Z" fill="url(#lidCenterLight)"/>
          {/* Apple logo (provided path) centered, smaller scale */}
          <g transform="translate(64 94) scale(0.75) translate(-12 -12)">
            <path fill="url(#appleGrad)" d="M17.05 20.28c-.98.95-2.05.8-3.08.35c-1.09-.46-2.09-.48-3.24 0c-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8c1.18-.24 2.31-.93 3.57-.84c1.51.12 2.65.72 3.4 1.8c-3.12 1.87-2.38 5.98.48 7.13c-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25c.29 2.58-2.34 4.5-3.74 4.25"/>
          </g>
        </g>
      </g>
    </svg>
  );
});

BearIconProjects.displayName = 'BearIconProjects';
export default BearIconProjects;
