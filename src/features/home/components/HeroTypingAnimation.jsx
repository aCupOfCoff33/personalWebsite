/* HeroTypingAnimation.jsx */
import React, { useEffect, useReducer, useRef } from "react";
import AnimatedCursor from "../../../components/common/AnimatedCursor";
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, animate } from "framer-motion";


/* ── constants ─────────────────────────────────────────────── */
const HEADLINE = "Hey there! I'm Aaryan!";
const HERO_INTRO_SESSION_KEY = 'heroIntroSeen';

// Track whether the hero intro has already played in this SPA session
let heroIntroHasPlayed = false;
let sessionStorageStatus = null;

const isSessionStorageReady = () => {
  if (sessionStorageStatus !== null) return sessionStorageStatus;
  if (typeof window === 'undefined' || !window.sessionStorage) return false;
  try {
    const testKey = '__hero_intro_test__';
    window.sessionStorage.setItem(testKey, '1');
    window.sessionStorage.removeItem(testKey);
    sessionStorageStatus = true;
  } catch (error) {
    sessionStorageStatus = false;
  }
  return sessionStorageStatus;
};

const detectNavigationType = () => {
  if (typeof window === 'undefined' || typeof performance === 'undefined') return 'navigate';
  if (typeof performance.getEntriesByType === 'function') {
    const [navEntry] = performance.getEntriesByType('navigation');
    if (navEntry && navEntry.type) return navEntry.type;
  }
  if (performance.navigation && typeof performance.navigation.type === 'number') {
    const { TYPE_RELOAD, TYPE_BACK_FORWARD, TYPE_NAVIGATE } = performance.navigation;
    switch (performance.navigation.type) {
      case TYPE_RELOAD: return 'reload';
      case TYPE_BACK_FORWARD: return 'back_forward';
      case TYPE_NAVIGATE: return 'navigate';
      default: return 'navigate';
    }
  }
  return 'navigate';
};

const getHeroIntroSeen = () => {
  if (isSessionStorageReady()) {
    const seen = window.sessionStorage.getItem(HERO_INTRO_SESSION_KEY) === 'true';
    if (seen) heroIntroHasPlayed = true;
    return seen;
  }
  return heroIntroHasPlayed;
};

const markHeroIntroSeen = () => {
  heroIntroHasPlayed = true;
  if (isSessionStorageReady()) {
    window.sessionStorage.setItem(HERO_INTRO_SESSION_KEY, 'true');
  }
};

// Allow a hard refresh on the home route to replay the intro sequence
if (detectNavigationType() === 'reload' && isSessionStorageReady()) {
  window.sessionStorage.removeItem(HERO_INTRO_SESSION_KEY);
  heroIntroHasPlayed = false;
}

// Optimized for performance by wrapping with React.memo
const HeroTypingAnimation = React.memo(() => {
  const bodyRef = useRef(null);
  const headlineRef = useRef(null);
  const shouldRunIntro = React.useRef(!getHeroIntroSeen()).current;
  const markIntroSeen = React.useCallback(() => {
    markHeroIntroSeen();
  }, []);
  
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
    pointerHover: false,
    showAnimatedCursor: false,
    cursorShouldExit: false,
    cursorTriggered: false,
    isAnimatingBack: false, // NEW: tracks when snap-back animation is in progress
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
      case 'SET_POINTER_HOVER': return { ...state, pointerHover: action.value };
      case 'SET_SHOW_ANIMATED_CURSOR': return { ...state, showAnimatedCursor: action.value };
      case 'SET_CURSOR_SHOULD_EXIT': return { ...state, cursorShouldExit: action.value };
      case 'SET_CURSOR_TRIGGERED': return { ...state, cursorTriggered: action.value };
      case 'SET_IS_ANIMATING_BACK': return { ...state, isAnimatingBack: action.value };
      default: return state;
    }
  }
  
  const [state, dispatch] = useReducer(reducer, initialState);

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

  // Dynamic safe margins that respect the new layout:
  // - desktop: reserve space for the fixed left sidebar (16rem) + padding
  // - mobile: reserve space for the top bar height
  const getSafeMargin = React.useCallback(() => {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const isDesktop = viewportWidth >= 768; // md breakpoint
    const SIDEBAR_WIDTH_PX = 240; // md:ml-60 (15rem)
    const MOBILE_TOPBAR_PX = 64; // pt-16 on main
    return {
      left: isDesktop ? SIDEBAR_WIDTH_PX + 24 : 24,
      right: 24,
      top: isDesktop ? 24 : 24 + MOBILE_TOPBAR_PX,
      bottom: 24,
    };
  }, []);

  // Calculate viewport bounds for clamping - returns {minX, maxX, minY, maxY} as delta limits
  const getViewportBounds = React.useCallback(() => {
    if (!frameRef.current) return { minX: -Infinity, maxX: Infinity, minY: -Infinity, maxY: Infinity };
    const rect = frameRef.current.getBoundingClientRect();
    const SAFE_MARGIN = getSafeMargin();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Current position in motion values
    const currentX = x.get();
    const currentY = y.get();

    // Calculate the absolute position limits, then convert to motion value limits
    // rect.left = some_origin + currentX, so some_origin = rect.left - currentX
    const originX = rect.left - currentX;
    const originY = rect.top - currentY;

    const minX = SAFE_MARGIN.left - originX;
    const maxX = (viewportWidth - SAFE_MARGIN.right) - rect.width - originX;
    const minY = SAFE_MARGIN.top - originY;
    const maxY = (viewportHeight - SAFE_MARGIN.bottom) - rect.height - originY;

    return { minX, maxX, minY, maxY };
  }, [getSafeMargin, x, y]);

  const clampIntoViewport = React.useCallback(() => {
    const bounds = getViewportBounds();
    const currentX = x.get();
    const currentY = y.get();
    
    const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, currentX));
    const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, currentY));

    if (clampedX !== currentX) x.set(clampedX);
    if (clampedY !== currentY) y.set(clampedY);
  }, [getViewportBounds, x, y]);

  // Proactive drag handler that prevents going out of bounds entirely
  const handleDrag = React.useCallback(() => {
    if (!frameRef.current) return;
    
    // Get bounds based on current frame position
    const bounds = getViewportBounds();
    
    // Get the current motion values (already updated by framer)
    const currentX = x.get();
    const currentY = y.get();
    
    // Clamp to bounds - this creates a "hard stop" effect
    const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, currentX));
    const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, currentY));
    
    // Apply correction if needed
    if (clampedX !== currentX) x.set(clampedX);
    if (clampedY !== currentY) y.set(clampedY);
  }, [x, y, getViewportBounds]);
  
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
    if (!shouldRunIntro) return;
    markIntroSeen();
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
  }, [shouldRunIntro, x, markIntroSeen]);

  // Skip intro: immediately show final state when returning to Home without a hard refresh
  useEffect(() => {
    if (shouldRunIntro) return;
    dispatch({ type: 'SET_SHOW_FRAME', value: true });
    dispatch({ type: 'SET_PHASE', value: 'frameMoved' });
    dispatch({ type: 'SET_SHOW_BODY', value: true });
    dispatch({ type: 'SET_FRAME_FROZEN', value: false });
    dispatch({ type: 'SET_CURSOR_TRIGGERED', value: true });
    dispatch({ type: 'SET_DRAG_OK', value: true });
    dispatch({ type: 'SET_FRAME_ALIGNED', value: true });
    dispatch({ type: 'SET_SHOW_CURSOR', value: false });
    dispatch({ type: 'SET_SHOW_ANIMATED_CURSOR', value: false });
    dispatch({ type: 'SET_CURSOR_SHOULD_EXIT', value: true });
    markIntroSeen();
    const rafId = requestAnimationFrame(() => {
      if (headlineRef.current) headlineRef.current.textContent = HEADLINE;
    });
    return () => cancelAnimationFrame(rafId);
  }, [shouldRunIntro, markIntroSeen]);

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
    dispatch({ type: 'SET_IS_ANIMATING_BACK', value: false });
    dispatch({ type: 'SET_DRAG_OK', value: true });
    markIntroSeen();
  }, [markIntroSeen]);

  // Show cursor only after typing and frame is ready
  // Only trigger cursor animation once
  const cursorTriggered = state.cursorTriggered;
  useEffect(() => {
    if (state.showFrame && state.showBody && state.frameFrozen && !state.showAnimatedCursor && !cursorTriggered) {
      dispatch({ type: 'SET_CURSOR_TRIGGERED', value: true });
      // Show paddington cursor on both mobile and desktop
      setTimeout(() => dispatch({ type: 'SET_SHOW_ANIMATED_CURSOR', value: true }), 100);
    }
  }, [state.showFrame, state.showBody, state.showAnimatedCursor, cursorTriggered, state.frameFrozen]);

  /* snap the frame back after dragging */
  // Snap the frame back after dragging, with Paddington cursor sequence
  const [pendingSnapBack, setPendingSnapBack] = React.useState(false);
  // Counter to force fresh cursor instance on each show (fixes stale state issues)
  const [cursorKey, setCursorKey] = React.useState(0);
  
  const snapBack = React.useCallback(() => {
    // Immediately disable dragging to prevent race conditions
    dispatch({ type: 'SET_DRAG_OK', value: false });
    dispatch({ type: 'SET_IS_ANIMATING_BACK', value: true });
    setPendingSnapBack(true);
    // Show paddington cursor on both mobile and desktop for snap-back
    dispatch({ type: 'SET_CURSOR_SHOULD_EXIT', value: false });
    setCursorKey(k => k + 1); // Force new cursor instance
    dispatch({ type: 'SET_SHOW_ANIMATED_CURSOR', value: true });
  }, []);

  // Mobile-only snap-back effect is no longer needed since we now show cursor on mobile too
  // The handleCursorReadyToDragSnap will handle the animation for both platforms

  // When the cursor reaches the box (after user drag), snap the box back in sync
  const handleCursorReadyToDragSnap = React.useCallback(async () => {
    if (pendingSnapBack) {
      // Thicken border while the frame animates back
      dispatch({ type: 'SET_FRAME_THICK', value: true });
      // Store animation controls for potential cancellation
      try {
        // Animate both x and y simultaneously for diagonal movement
        await Promise.all([
          animate(x, state.centreX, { type: "spring", stiffness: 65, damping: 18 }),
          animate(y, 0, { type: "spring", stiffness: 65, damping: 18 })
        ]);
      } catch (e) {
        // Animation was cancelled, don't proceed with state changes
        return;
      }
      // Return border to thin after reaching target
      dispatch({ type: 'SET_FRAME_THICK', value: false });
      dispatch({ type: 'SET_IS_ANIMATING_BACK', value: false });
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
    <section className="relative w-full max-w-screen-xl mx-auto px-4 pt-8 md:px-6 md:pt-64 text-white font-adamant overflow-visible">
      {/* Animated cursor overlay - shown on both mobile and desktop */}
      {state.showAnimatedCursor && (
        <AnimatedCursor
          key={cursorKey}
          targetRef={frameRef}
          onDragComplete={handleCursorDragComplete}
          onCursorReadyToDrag={handleCursorReadyToDragSnap}
          shouldExit={state.cursorShouldExit}
        />
      )}
      {/* ── headline & draggable blue frame ── */}
      <motion.div
        ref={frameRef}
        drag={state.dragOK && !state.isAnimatingBack}
        dragMomentum={false}
        dragElastic={0}
        onDragStart={(event, info) => {
          // Double-check: abort if animation is running (defensive)
          if (state.isAnimatingBack || pendingSnapBack) {
            return false;
          }
        }}
        onDrag={handleDrag}
        onDragEnd={() => { 
          // Only trigger snap-back if not already animating
          if (!state.isAnimatingBack && !pendingSnapBack) {
            clampIntoViewport(); 
            // Ensure thin border right after user drops
            dispatch({ type: 'SET_FRAME_THICK', value: false });
            snapBack(); 
          }
        }}
        onMouseEnter={() => dispatch({ type: 'SET_POINTER_HOVER', value: true })}
        onMouseLeave={() => dispatch({ type: 'SET_POINTER_HOVER', value: false })}
        dragConstraints={false}
        style={{ x: state.frameFrozen && !state.frameAligned ? getInitialX() : x, y }}
        className={`relative inline-block px-4 py-6 md:px-10 ${
          state.dragOK && !state.isAnimatingBack ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        } max-w-full`}
      >
        {state.showFrame && (
          <>
            {/* outline - dynamic thickness on hover and during animations */}
            <motion.div
              className="absolute inset-0 border-solid"
              style={{ borderColor: '#198ce7' }}
              initial={{ opacity: 0, borderWidth: 2 }}
              animate={{ opacity: 1, borderWidth: (state.frameThick || state.pointerHover) ? 6 : 2 }}
              transition={{ duration: 0.2 }}
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
          initial={false} // Avoid animating LCP content on mount
          className="mt-8 md:mt-12 space-y-10 md:space-y-12 max-w-[72rem] pb-20"
        >
          {/* tagline */}
          <p className="text-2xl md:text-3xl leading-relaxed">
            A Software Engineering&nbsp;&amp;&nbsp;Business student at Ivey Business School
            based near Toronto, building tools that <em>(ideally)</em> make life
            easier — or at least break things in more interesting ways.
          </p>

          {/* "currently / driven by" grid */}
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
