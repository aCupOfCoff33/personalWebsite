// AnimatedCursor.jsx
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
  const cursorRef = useRef(null);
  const [phase, setPhase] = useState('enter'); // enter, drag, exit
  const [cursorPos, setCursorPos] = useState({ x: -CURSOR_SIZE, y: 200 });
  const animationFrameRef = useRef(null);

  // Track frame position during drag phase with requestAnimationFrame for better performance
  useEffect(() => {
    if (phase === 'drag' && targetRef.current) {
      const updateCursorPosition = () => {
        if (targetRef.current) {
          const rect = targetRef.current.getBoundingClientRect();
          // Keep cursor at bottom center of the frame during drag
          const targetX = rect.left + rect.width / 2 - CURSOR_SIZE / 2;
          const targetY = rect.bottom - 10;
          setCursorPos({ x: targetX, y: targetY });
          
          // Continue animation loop
          animationFrameRef.current = requestAnimationFrame(updateCursorPosition);
        }
      };

      // Start the animation loop
      animationFrameRef.current = requestAnimationFrame(updateCursorPosition);
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [phase, targetRef]);

  // Exit when parent signals
  useEffect(() => {
    if (shouldExit && phase === 'drag') {
      setPhase('exit');
    }
  }, [shouldExit, phase]);

  // Animate cursor in, drag, and out
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

  // Cursor style (use user's image as background)
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

  // Label style
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
    <div ref={cursorRef} style={cursorStyle}>
      <CursorSVG color={CURSOR_COLOR} size={CURSOR_SIZE} />
      <div style={labelStyle}>{LABEL}</div>
    </div>
  );
};

export default AnimatedCursor;
