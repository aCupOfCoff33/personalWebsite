
// AnimatedCursor.jsx
// This component simulates a cursor moving, dragging, and exiting for onboarding/animation.
// If cursor animation logic is reused elsewhere, consider extracting it into a custom hook.
import React, { useEffect, useRef, useState } from 'react';
import CursorSVG from './CursorSVG';

/**
 * AnimatedCursor simulates a cursor moving in from the left, clicking and dragging a target,
 * and then moving out, with a label underneath. The cursor image and label style are based on the user's screenshot.
 *
 * Props:
 * - targetRef: ref to the element to drag
 * - onDragComplete: callback when drag animation finishes
 */
const CURSOR_SIZE = 40;
const LABEL = 'paddington';
const CURSOR_COLOR = '#9B7CF6'; // Match label background
const ENTRANCE_DURATION = 1200; // slower entrance
const DRAG_DURATION = 600; // match frame drag speed
const EXIT_DURATION = 1200; // slower exit

const AnimatedCursor = ({ targetRef, onDragComplete, onCursorReadyToDrag, shouldExit }) => {
  // phase: 'enter' (move in), 'drag' (attached to target), 'exit' (move out)
  const cursorRef = useRef(null);
  const [phase, setPhase] = useState('enter'); // enter, drag, exit
  const [cursorPos, setCursorPos] = useState({ x: -CURSOR_SIZE, y: 200 });

  // Track frame position during drag phase (optimized with requestAnimationFrame)
  useEffect(() => {
    let animationFrameId;
    if (phase === 'drag' && targetRef.current) {
      const updateCursorPosition = () => {
        if (!targetRef.current) return;
        const rect = targetRef.current.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2 - CURSOR_SIZE / 2;
        const targetY = rect.bottom - 10;
        // Only update state if position actually changes
        setCursorPos((prev) => {
          if (prev.x !== targetX || prev.y !== targetY) {
            return { x: targetX, y: targetY };
          }
          return prev;
        });
        animationFrameId = requestAnimationFrame(updateCursorPosition);
      };
      animationFrameId = requestAnimationFrame(updateCursorPosition);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [phase, targetRef]);

  // Exit when parent signals
  useEffect(() => {
    if (shouldExit && phase === 'drag') {
      setPhase('exit');
    }
  }, [shouldExit, phase]);

  // Animate cursor in, drag, and out (orchestrates the full sequence)
  useEffect(() => {
    let timeout1, pauseTimeout;
    if (phase === 'enter') {
      // Move cursor to bottom center of frame (for both mobile and desktop)
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        // Position cursor at bottom center of the frame
        const targetX = rect.left + rect.width / 2 - CURSOR_SIZE / 2;
        const targetY = rect.bottom - 10; // Slightly above the bottom edge
        setCursorPos({ x: targetX, y: targetY });
        // Pause for 1s after arrival before drag
        timeout1 = setTimeout(() => {
          pauseTimeout = setTimeout(() => {
            if (onCursorReadyToDrag) onCursorReadyToDrag();
            setPhase('drag');
          }, 300);
        }, ENTRANCE_DURATION);
      }
    } else if (phase === 'drag') {
      // Stay attached to frame during movement - no timeout, wait for shouldExit signal
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        // Keep cursor at bottom center during drag
        const targetX = rect.left + rect.width / 2 - CURSOR_SIZE / 2;
        const targetY = rect.bottom - 10;
        setCursorPos({ x: targetX, y: targetY });
      }
    } else if (phase === 'exit') {
      // Move cursor out to left from current position
      setCursorPos({ x: -CURSOR_SIZE, y: cursorPos.y });
      setTimeout(() => {
        if (onDragComplete) onDragComplete();
      }, EXIT_DURATION);
    }
    return () => {
      clearTimeout(timeout1);
      clearTimeout(pauseTimeout);
    };
  }, [phase, targetRef, onDragComplete, onCursorReadyToDrag, cursorPos.y]);

  // Cursor style (positioned absolutely, follows animation state)
  const cursorStyle = {
    position: 'fixed',
    left: cursorPos.x,
    top: cursorPos.y,
    width: CURSOR_SIZE,
    height: CURSOR_SIZE,
    zIndex: 9999,
    pointerEvents: 'none',
    transition:
      phase === 'enter'
        ? `left ${ENTRANCE_DURATION}ms cubic-bezier(0.4,0,0.2,1), top ${ENTRANCE_DURATION}ms cubic-bezier(0.4,0,0.2,1)`
        : phase === 'exit'
        ? `left ${EXIT_DURATION}ms cubic-bezier(0.4,0,0.2,1), top ${EXIT_DURATION}ms cubic-bezier(0.4,0,0.2,1)`
        : 'none', // No transition during drag so it follows smoothly
    background: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Label style (styled to match design)
  const labelStyle = {
    position: 'absolute',
    left: '50%',
    top: CURSOR_SIZE + 8,
    transform: 'translateX(-50%)',
    background: CURSOR_COLOR,
    color: 'white',
    borderRadius: 20,
    padding: '2px 12px',
    fontSize: 16,
    fontFamily: 'Adamant_BG, sans-serif',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  };

  return (
    // If you need to reuse this cursor animation, extract the logic above into a custom hook.
    <div ref={cursorRef} style={cursorStyle}>
      <CursorSVG color={CURSOR_COLOR} size={CURSOR_SIZE} />
      <div style={labelStyle}>{LABEL}</div>
    </div>
  );
};

export default AnimatedCursor;
