/* HeroTypingAnimation.jsx */
import React, { useEffect, useReducer, useRef } from "react";
import AnimatedCursor from "./AnimatedCursor";
import { motion, useMotionValue, animate } from "framer-motion";

// Custom hook for responsive mobile detection
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);
  return isMobile;
}


/* ── constants ─────────────────────────────────────────────── */
const HEADLINE = "Hey there! I’m Aaryan!";
const BORDER = 4; // 4-px outline from Figma
const CORNER_SIZE = 12; // 12-px blue squares (w-3 / h-3)

export default function HeroTypingAnimation() {
  // Animation state managed by useReducer for clarity
  const initialState = {
    frameAligned: false,
    typed: "",
    showCursor: false,
    showFrame: false,
    phase: 'initial',
    showBody: false,
    dragOK: false,
    centreX: 0,
    frameFrozen: true,
    frameThick: false,
    showAnimatedCursor: false,
    cursorShouldExit: false,
    cursorTriggered: false,
  };
  function reducer(state, action) {
    switch (action.type) {
      case 'SET_FRAME_ALIGNED': return { ...state, frameAligned: action.value };
      case 'SET_TYPED': return { ...state, typed: action.value };
      case 'SET_SHOW_CURSOR': return { ...state, showCursor: action.value };
      case 'SET_SHOW_FRAME': return { ...state, showFrame: action.value };
      case 'SET_PHASE': return { ...state, phase: action.value };
      case 'SET_SHOW_BODY': return { ...state, showBody: action.value };
      case 'SET_DRAG_OK': return { ...state, dragOK: action.value };
      case 'SET_CENTRE_X': return { ...state, centreX: action.value };
      case 'SET_FRAME_FROZEN': return { ...state, frameFrozen: action.value };
      case 'SET_FRAME_THICK': return { ...state, frameThick: action.value };
      case 'SET_SHOW_ANIMATED_CURSOR': return { ...state, showAnimatedCursor: action.value };
      case 'SET_CURSOR_SHOULD_EXIT': return { ...state, cursorShouldExit: action.value };
      case 'SET_CURSOR_TRIGGERED': return { ...state, cursorTriggered: action.value };
      default: return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const isMobile = useIsMobile();
  const bodyRef = useRef(null);
  const frameRef = useRef(null);

  // Calculate proper initial position based on screen size and text width
  const getInitialX = () => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      const mobile = screenWidth < 768;
      if (mobile) return 16;
      else return -120;
    }
    return -120;
  };
  const x = useMotionValue(getInitialX());
  const y = useMotionValue(0);

  // Update x position when screen size changes or frame aligns
  useEffect(() => {
    if (state.frameAligned && frameRef.current && bodyRef.current) {
      const frameRect = frameRef.current.getBoundingClientRect();
      const bodyRect = bodyRef.current.getBoundingClientRect();
      const targetLeft = bodyRect.left;
      const currentLeft = frameRect.left;
      const deltaNeeded = targetLeft - currentLeft;
      const finalX = x.get() + deltaNeeded;
      dispatch({ type: 'SET_CENTRE_X', value: finalX });
      x.set(finalX);
      dispatch({ type: 'SET_FRAME_FROZEN', value: false });
    } else {
      const newX = getInitialX();
      x.set(newX);
    }
  }, [isMobile, x, state.frameAligned]);

  // Orchestrate the animation sequence
  useEffect(() => {
    (async () => {
      await new Promise((r) => setTimeout(r, 100));
      dispatch({ type: 'SET_SHOW_FRAME', value: true });
      dispatch({ type: 'SET_PHASE', value: 'initial' });
      dispatch({ type: 'SET_SHOW_CURSOR', value: true });
      for (let i = 0; i <= HEADLINE.length; i++) {
        dispatch({ type: 'SET_TYPED', value: HEADLINE.slice(0, i) });
        dispatch({ type: 'SET_PHASE', value: 'typing' });
        await new Promise((r) => setTimeout(r, 65));
      }
      setTimeout(() => dispatch({ type: 'SET_SHOW_CURSOR', value: false }), 200);
      await new Promise((r) => setTimeout(r, 300));
      dispatch({ type: 'SET_SHOW_BODY', value: true });
      dispatch({ type: 'SET_FRAME_FROZEN', value: true });
    })();
  }, [x]);

  // AnimatedCursor orchestration
  const handleCursorReadyToDrag = async () => {
    if (frameRef.current && bodyRef.current) {
      const frameRect = frameRef.current.getBoundingClientRect();
      const bodyRect = bodyRef.current.getBoundingClientRect();
      const targetLeft = bodyRect.left;
      const currentLeft = frameRect.left;
      const deltaNeeded = targetLeft - currentLeft;
      const finalX = x.get() + deltaNeeded;
      dispatch({ type: 'SET_CENTRE_X', value: finalX });
      dispatch({ type: 'SET_FRAME_FROZEN', value: false });
      dispatch({ type: 'SET_FRAME_THICK', value: true });
      await animate(x, finalX, { type: "spring", stiffness: 55, damping: 18 });
      dispatch({ type: 'SET_FRAME_THICK', value: false });
      dispatch({ type: 'SET_PHASE', value: 'frameMoved' });
      dispatch({ type: 'SET_FRAME_ALIGNED', value: true });
      await new Promise((r) => setTimeout(r, 500));
      dispatch({ type: 'SET_CURSOR_SHOULD_EXIT', value: true });
    }
  };
  const handleCursorDragComplete = () => {
    dispatch({ type: 'SET_SHOW_ANIMATED_CURSOR', value: false });
    dispatch({ type: 'SET_DRAG_OK', value: true });
  };

  // Show cursor only after typing and frame is ready
  useEffect(() => {
    if (
      state.showFrame &&
      state.showBody &&
      state.frameFrozen &&
      !state.showAnimatedCursor &&
      !state.cursorTriggered
    ) {
      dispatch({ type: 'SET_CURSOR_TRIGGERED', value: true });
      setTimeout(() => dispatch({ type: 'SET_SHOW_ANIMATED_CURSOR', value: true }), 100);
    }
  }, [state.showFrame, state.showBody, state.showAnimatedCursor, state.cursorTriggered, state.frameFrozen]);

  // Snap the frame back after dragging
  const snapBack = () =>
    setTimeout(() => {
      animate(x, state.centreX, { type: "spring", stiffness: 65, damping: 18 });
      animate(y, 0, { type: "spring", stiffness: 65, damping: 18 });
    }, 800);

  // --- render ---
  return (
    <section className="relative w-full max-w-screen-xl mx-auto px-4 pt-0 md:px-6 md:pt-32 text-white font-adamant">
      {/* Animated cursor overlay */}
      {state.showAnimatedCursor && (
        <AnimatedCursor
          targetRef={frameRef}
          onDragComplete={handleCursorDragComplete}
          onCursorReadyToDrag={handleCursorReadyToDrag}
          shouldExit={state.cursorShouldExit}
        />
      )}
      {/* ── headline & draggable blue frame ── */}
      <motion.div
        ref={frameRef}
        drag={state.dragOK}
        dragMomentum={false}
        onDragEnd={snapBack}
        style={{ x: state.frameFrozen && !state.frameAligned ? getInitialX() : x, y }}
        className={`relative inline-block px-4 py-6 md:px-10 ${
          state.dragOK ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        } max-w-full`}
      >
        {state.showFrame && (
          <>
            {/* outline - thinner initially, thicker when cursor is over */}
            <motion.div
              className="absolute inset-0"
          style={{ border: `${state.frameThick ? 6 : 2}px solid #198ce7` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            />

            {/* Only 4 corner squares, white inside */}
            {/* top-left */}
            <div className="absolute w-3 h-3 bg-[#198ce7] -top-[4px] -left-[4px] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded" />
            </div>
            {/* top-right */}
            <div className="absolute w-3 h-3 bg-[#198ce7] -top-[4px] -right-[4px] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded" />
            </div>
            {/* bottom-left */}
            <div className="absolute w-3 h-3 bg-[#198ce7] -bottom-[4px] -left-[4px] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded" />
            </div>
            {/* bottom-right */}
            <div className="absolute w-3 h-3 bg-[#198ce7] -bottom-[4px] -right-[4px] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded" />
            </div>
          </>
        )}

        <h1
          className="text-4xl md:text-6xl font-bold leading-none break-words whitespace-pre-line"
        >
          {/* On mobile, split headline into two lines. On desktop, keep as one line. */}
          {(() => {
            if (isMobile) {
              // Mobile: force split after "Hey there!"
              if (state.typed.includes('!')) {
                return state.typed.replace('! ', '!\n');
              }
            }
            return state.typed;
          })()}
          {state.showCursor && <span className="animate-pulse">|</span>}
        </h1>
      </motion.div>

      {/* ── body: tagline + meta grid ── */}
      <motion.div
        ref={bodyRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: state.showBody ? 1 : 0 }}
        transition={{ duration: 0.55 }}
        className="mt-12 space-y-12 max-w-[72rem]"
      >
        {/* tagline */}
        <p className="text-2xl md:text-3xl leading-relaxed">
          A Software Engineering&nbsp;&amp;&nbsp;Business student at Western U
          based near Toronto, building tools that <em>(ideally)</em> make life
          easier — or at least break things in more interesting ways.
        </p>

        {/* “currently / driven by” grid */}
        <div className="grid gap-y-10 gap-x-24 sm:grid-cols-2 text-xl">
          <div>
            <p className="italic text-2xl mb-2">currently</p>
            <p className="text-[#9b9cbe] font-semibold leading-snug">
              data analytics &amp; strategy intern 
              <br />
              @ american global
            </p>
          </div>
          <div>
            <p className="italic text-2xl mb-2">driven by</p>
            <p className="text-[#9b9cbe] font-semibold leading-snug">
              curiosity, creative problem-solving &amp; an arguably unhealthy
              obsession with bears.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
