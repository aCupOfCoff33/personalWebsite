/* HeroTypingAnimation.jsx */
import React, { useEffect, useReducer, useRef } from "react";
import AnimatedCursor from "./AnimatedCursor";
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, animate } from "framer-motion";


/* ── constants ─────────────────────────────────────────────── */
const HEADLINE = "Hey there! I’m Aaryan!";
const BORDER = 4; // 4-px outline from Figma
const CORNER_SIZE = 12; // 12-px blue squares (w-3 / h-3)

const HeroTypingAnimation = React.memo(() => {
  const bodyRef = useRef(null);
  const headlineRef = useRef(null);
  
  // Initialize state first
  const initialState = {
    frameAligned: false,
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

  // Drag constraints for blue box: always within viewport (moved after useReducer)
  const [dragConstraints, setDragConstraints] = React.useState({ left: 0, right: 0, top: 0, bottom: 0 });
  
  const updateDragConstraints = React.useCallback(() => {
    if (!frameRef.current) return;
    const frame = frameRef.current.getBoundingClientRect();
    const width = window.innerWidth;
    const height = window.innerHeight;
    setDragConstraints({
      left: -frame.left,
      right: width - frame.right,
      top: -frame.top,
      bottom: height - frame.bottom,
    });
  }, []);
  
  // Debounce resize handler for better performance
  React.useEffect(() => {
    let timeoutId;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDragConstraints, 100);
    };
    
    updateDragConstraints();
    window.addEventListener('resize', debouncedUpdate);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedUpdate);
    };
  }, [state.showFrame, state.dragOK, updateDragConstraints]);

  /* motion values for drag / snap */
  const frameRef = useRef(null);
  
  // Calculate proper initial position based on screen size and text width
  const getInitialX = () => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        return 16;
      } else {
        return -120;
      }
    }
    return -120;
  };
  
  const x = useMotionValue(getInitialX());
  const y = useMotionValue(0);
  
  // Update x position when screen size changes
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
  }, [x, state.frameAligned]);

  /* ── orchestrate the sequence ───────────────────────────── */
  useEffect(() => {
    (async () => {
      await new Promise((r) => setTimeout(r, 100));
      dispatch({ type: 'SET_SHOW_FRAME', value: true });
      dispatch({ type: 'SET_PHASE', value: 'typing' });
      // Typing animation: update textContent directly for performance
      // Only dispatch once to set phase, then use ref for all text updates
      if (headlineRef.current) headlineRef.current.textContent = '';
      for (let i = 0; i <= HEADLINE.length; i++) {
        if (headlineRef.current) headlineRef.current.textContent = HEADLINE.slice(0, i);
        // REMOVED: dispatch call that was causing 23 re-renders per typing sequence
        await new Promise((r) => setTimeout(r, 65));
      }
      setTimeout(() => dispatch({ type: 'SET_SHOW_CURSOR', value: false }), 200);
      await new Promise((r) => setTimeout(r, 300));
      dispatch({ type: 'SET_SHOW_BODY', value: true });
      dispatch({ type: 'SET_FRAME_FROZEN', value: true });
    })();
  }, [x]);

  // AnimatedCursor orchestration
  const handleCursorReadyToDrag = React.useCallback(async () => {
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
  }, [x]);
  
  // Called by cursor after exit, hides cursor and enables drag
  const handleCursorDragComplete = React.useCallback(() => {
    dispatch({ type: 'SET_SHOW_ANIMATED_CURSOR', value: false });
    dispatch({ type: 'SET_DRAG_OK', value: true });
  }, []);

  // Show cursor only after typing and frame is ready
  // Only trigger cursor animation once
  const cursorTriggered = state.cursorTriggered;
  useEffect(() => {
    if (state.showFrame && state.showBody && state.frameFrozen && !state.showAnimatedCursor && !cursorTriggered) {
      dispatch({ type: 'SET_CURSOR_TRIGGERED', value: true });
      setTimeout(() => dispatch({ type: 'SET_SHOW_ANIMATED_CURSOR', value: true }), 100);
    }
  }, [state.showFrame, state.showBody, state.showAnimatedCursor, cursorTriggered, state.frameFrozen]);

  /* snap the frame back after dragging */
  // Snap the frame back after dragging, with Paddington cursor sequence
  const [pendingSnapBack, setPendingSnapBack] = React.useState(false);
  const snapBack = React.useCallback(() => {
    setPendingSnapBack(true);
    // Reset cursor exit state when showing cursor again
    dispatch({ type: 'SET_CURSOR_SHOULD_EXIT', value: false });
    dispatch({ type: 'SET_SHOW_ANIMATED_CURSOR', value: true });
  }, []);

  // When the cursor reaches the box (after user drag), snap the box back in sync
  const handleCursorReadyToDragSnap = React.useCallback(async () => {
    if (pendingSnapBack) {
      // Animate both x and y simultaneously for diagonal movement
      await Promise.all([
        animate(x, state.centreX, { type: "spring", stiffness: 65, damping: 18 }),
        animate(y, 0, { type: "spring", stiffness: 65, damping: 18 })
      ]);
      setPendingSnapBack(false);
      // Signal cursor to exit after the snap animation completes
      dispatch({ type: 'SET_CURSOR_SHOULD_EXIT', value: true });
    } else if (handleCursorReadyToDrag) {
      // Onboarding animation: call the original handler
      handleCursorReadyToDrag();
    }
  }, [pendingSnapBack, state.centreX, x, y, handleCursorReadyToDrag]);

  /* ── render ─────────────────────────────────────────────── */
  return (
    <section className="relative w-full max-w-screen-xl mx-auto px-4 pt-0 md:px-6 md:pt-32 text-white font-adamant">
      {/* Animated cursor overlay */}
      {state.showAnimatedCursor && (
        <AnimatedCursor
          targetRef={frameRef}
          onDragComplete={handleCursorDragComplete}
          onCursorReadyToDrag={handleCursorReadyToDragSnap}
          shouldExit={state.cursorShouldExit}
        />
      )}
      {/* ── headline & draggable blue frame ── */}
      <motion.div
        ref={frameRef}
        drag={state.dragOK}
        dragMomentum={false}
        onDragEnd={snapBack}
        dragConstraints={dragConstraints}
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
          ref={headlineRef}
          className="text-4xl md:text-6xl font-bold leading-none break-words whitespace-pre-line"
        >
          {/* The text is set via ref for performance. Only the cursor is rendered here. */}
          {state.showCursor && <span className="animate-pulse">|</span>}
        </h1>
      </motion.div>

      {/* ── body: tagline + meta grid ── */}
      {state.showBody && (
        <motion.div
          ref={bodyRef}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
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
      )}
    </section>
  );
});

HeroTypingAnimation.displayName = 'HeroTypingAnimation';

export default HeroTypingAnimation;
