// AnimatedCursor.jsx
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MousePointer2 } from "lucide-react";

/**
 * AnimatedCursor simulates a cursor moving in from the left, clicking and dragging a target,
 * and then moving out, with a label underneath. The cursor image and label style are based on the user's screenshot.
 *
 * Props:
 * - targetRef: ref to the element to drag
 * - onDragComplete: callback when drag animation finishes
 */
const CURSOR_SIZE = 40;
// Approximate tip position of the arrow pointer within the 40x40 viewbox
// Tune these to visually align the tip on the target edge
const CURSOR_TIP_OFFSET_X = 6;
const CURSOR_TIP_OFFSET_Y = 6;
const LABEL = "paddington";
const CURSOR_COLOR = "#9B7CF6"; // Match label background
const ENTRANCE_DURATION = 1200; // entrance duration
const DRAG_DURATION = 600; // match frame drag speed (kept for reference)
const EXIT_DURATION = 1200; // exit duration
// Off-screen position: far enough left to hide cursor + label completely
// Label is ~120px wide + 10px gap, so -200px ensures everything is hidden
const OFF_SCREEN_X = -200;

const AnimatedCursor = ({
  targetRef,
  onDragComplete,
  onCursorReadyToDrag,
  shouldExit,
}) => {
  const cursorRef = useRef(null);
  const [phase, setPhase] = useState("enter"); // enter, drag, exit
  const rafRef = useRef(null);
  const posRef = useRef({ x: OFF_SCREEN_X, y: 200 });
  const isMountedRef = useRef(false);

  // Compute a stable grab point on the target: middle edge so it looks like it "grabs" the box from the middle
  const computeGrabPosition = useCallback(() => {
    if (!targetRef.current) return { x: OFF_SCREEN_X, y: 200 };
    const rect = targetRef.current.getBoundingClientRect();
    const anchorX = rect.left + rect.width / 2; // middle edge
    const anchorY = rect.bottom - 10; // vertical center
    // Place the top-left of the cursor container so its tip sits on (anchorX, anchorY)
    const targetX = anchorX - CURSOR_TIP_OFFSET_X;
    const targetY = anchorY - CURSOR_TIP_OFFSET_Y;
    return { x: targetX, y: targetY };
  }, [targetRef]);

  const setCursorTransform = (x, y) => {
    if (!cursorRef.current) return;
    posRef.current = { x, y };
    // Use transform for better performance
    cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  // Track frame position during drag phase with requestAnimationFrame for better performance
  useEffect(() => {
    if (phase === "drag" && targetRef.current) {
      // Disable transition during drag to follow target precisely
      if (cursorRef.current)
        cursorRef.current.style.transition = "transform 0ms linear";
      const updateCursorPosition = () => {
        const { x, y } = computeGrabPosition();
        setCursorTransform(x, y);
        rafRef.current = requestAnimationFrame(updateCursorPosition);
      };

      rafRef.current = requestAnimationFrame(updateCursorPosition);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [phase, targetRef, computeGrabPosition]);

  // Exit when parent signals
  useEffect(() => {
    if (shouldExit && phase === "drag") {
      setPhase("exit");
    }
  }, [shouldExit, phase]);

  // Animate cursor in, drag, and out using transform to avoid re-renders
  useLayoutEffect(() => {
    isMountedRef.current = true;
    let enterTimeout;
    let readyTimeout;
    let scrollHandler;

    if (!cursorRef.current) return undefined;

    if (phase === "enter") {
      // Prepare styles
      const el = cursorRef.current;
      el.style.willChange = "transform";
      el.style.transition = `transform ${ENTRANCE_DURATION}ms cubic-bezier(0.4,0,0.2,1)`;

      // Start completely off-screen left (including label), aligned on Y with current target
      const { y } = computeGrabPosition();
      setCursorTransform(OFF_SCREEN_X, y);

      // Ensure we animate to live target (updates if user scrolls before arrival)
      const applyTarget = () => {
        const { x: tx, y: ty } = computeGrabPosition();
        setCursorTransform(tx, ty);
      };
      // Kick entrance
      requestAnimationFrame(applyTarget);

      // During entrance, keep adjusting on scroll to reduce mismatch
      scrollHandler = () => applyTarget();
      window.addEventListener("scroll", scrollHandler, { passive: true });

      // After arrival + slight pause, signal ready and switch to drag phase
      enterTimeout = setTimeout(() => {
        readyTimeout = setTimeout(() => {
          if (onCursorReadyToDrag) onCursorReadyToDrag();
          setPhase("drag");
        }, 200);
      }, ENTRANCE_DURATION);
    }

    if (phase === "exit") {
      const el = cursorRef.current;
      if (el)
        el.style.transition = `transform ${EXIT_DURATION}ms cubic-bezier(0.4,0,0.2,1)`;
      // Slide completely off-screen to the left (including label), keep current Y
      const { y } = posRef.current;
      setCursorTransform(OFF_SCREEN_X, y);
      enterTimeout = setTimeout(() => {
        if (onDragComplete) onDragComplete();
      }, EXIT_DURATION);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(enterTimeout);
      clearTimeout(readyTimeout);
      if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
      isMountedRef.current = false;
    };
  }, [phase, onCursorReadyToDrag, onDragComplete, computeGrabPosition]);

  // Cursor style (use user's image as background)
  const cursorStyle = {
    position: "fixed",
    left: 0,
    top: 0,
    width: CURSOR_SIZE,
    height: CURSOR_SIZE,
    zIndex: 9999,
    pointerEvents: "none",
    background: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`,
  };

  // Label style: positioned to the right of the cursor
  const labelStyle = {
    position: "absolute",
    left: `${CURSOR_SIZE + 10}px`,
    top: "50%",
    transform: "translateY(-50%)",
    background: CURSOR_COLOR,
    color: "white",
    borderRadius: 20,
    padding: "2px 12px",
    fontSize: 16,
    fontFamily: "Adamant_BG, sans-serif",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  };

  return (
    <div ref={cursorRef} style={cursorStyle} aria-hidden>
      <MousePointer2
        color={CURSOR_COLOR}
        size={CURSOR_SIZE}
        strokeWidth={1.5}
      />
      <div style={labelStyle}>{LABEL}</div>
    </div>
  );
};

export default AnimatedCursor;
