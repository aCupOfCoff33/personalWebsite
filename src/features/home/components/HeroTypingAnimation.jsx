/* HeroTypingAnimation.jsx */
import React, { useEffect, useRef } from "react";
import AnimatedCursor from "../../../components/common/AnimatedCursor";
import { motion, useMotionValue } from "framer-motion";
import useHeroAnimation from "../hooks/useHeroAnimation";

/* ── constants ─────────────────────────────────────────────── */
const HEADLINE = "Hey there! I'm Aaryan!";
const HERO_INTRO_SESSION_KEY = "heroIntroSeen";

// Track whether the hero intro has already played in this SPA session
let heroIntroHasPlayed = false;
let sessionStorageStatus = null;

const isSessionStorageReady = () => {
  if (sessionStorageStatus !== null) return sessionStorageStatus;
  if (typeof window === "undefined" || !window.sessionStorage) return false;
  try {
    const testKey = "__hero_intro_test__";
    window.sessionStorage.setItem(testKey, "1");
    window.sessionStorage.removeItem(testKey);
    sessionStorageStatus = true;
  } catch (error) {
    sessionStorageStatus = false;
  }
  return sessionStorageStatus;
};

const detectNavigationType = () => {
  if (typeof window === "undefined" || typeof performance === "undefined")
    return "navigate";
  if (typeof performance.getEntriesByType === "function") {
    const [navEntry] = performance.getEntriesByType("navigation");
    if (navEntry && navEntry.type) return navEntry.type;
  }
  if (
    performance.navigation &&
    typeof performance.navigation.type === "number"
  ) {
    const { TYPE_RELOAD, TYPE_BACK_FORWARD, TYPE_NAVIGATE } =
      performance.navigation;
    switch (performance.navigation.type) {
      case TYPE_RELOAD:
        return "reload";
      case TYPE_BACK_FORWARD:
        return "back_forward";
      case TYPE_NAVIGATE:
        return "navigate";
      default:
        return "navigate";
    }
  }
  return "navigate";
};

const getHeroIntroSeen = () => {
  if (isSessionStorageReady()) {
    const seen =
      window.sessionStorage.getItem(HERO_INTRO_SESSION_KEY) === "true";
    if (seen) heroIntroHasPlayed = true;
    return seen;
  }
  return heroIntroHasPlayed;
};

const markHeroIntroSeen = () => {
  heroIntroHasPlayed = true;
  if (isSessionStorageReady()) {
    window.sessionStorage.setItem(HERO_INTRO_SESSION_KEY, "true");
  }
};

// Allow a hard refresh on the home route to replay the intro sequence
if (detectNavigationType() === "reload" && isSessionStorageReady()) {
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

  /* motion values for drag / snap */
  const frameRef = useRef(null);

  // Calculate proper initial position based on screen size and text width
  const getInitialX = () => {
    if (typeof window !== "undefined") {
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

  const {
    state,
    dispatch,
    cursorKey,
    pendingSnapBack,
    snapBack,
    handleCursorDragComplete,
    handleCursorReadyToDragSnap,
  } = useHeroAnimation({ frameRef, bodyRef, x, y, markIntroSeen });

  // Dynamic safe margins that respect the new layout:
  // - desktop: reserve space for the fixed left sidebar (16rem) + padding
  // - mobile: reserve space for the top bar height
  const getSafeMargin = React.useCallback(() => {
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1024;
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
    if (!frameRef.current)
      return {
        minX: -Infinity,
        maxX: Infinity,
        minY: -Infinity,
        maxY: Infinity,
      };
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
    const maxX = viewportWidth - SAFE_MARGIN.right - rect.width - originX;
    const minY = SAFE_MARGIN.top - originY;
    const maxY = viewportHeight - SAFE_MARGIN.bottom - rect.height - originY;

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
      dispatch({ type: "SET_CENTRE_X", value: finalX });
      x.set(finalX);
      dispatch({ type: "SET_FRAME_FROZEN", value: false });
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
      dispatch({ type: "SET_SHOW_FRAME", value: true });
      dispatch({ type: "SET_PHASE", value: "typing" });
      // Typing animation: update textContent directly for performance
      // Only dispatch once to set phase, then use ref for all text updates
      if (headlineRef.current) headlineRef.current.textContent = "";
      for (let i = 0; i <= HEADLINE.length; i++) {
        if (headlineRef.current)
          headlineRef.current.textContent = HEADLINE.slice(0, i);
        // REMOVED: dispatch call that was causing 23 re-renders per typing sequence
        await new Promise((r) => setTimeout(r, 65));
      }
      setTimeout(
        () => dispatch({ type: "SET_SHOW_CURSOR", value: false }),
        200,
      );
      await new Promise((r) => setTimeout(r, 300));
      dispatch({ type: "SET_SHOW_BODY", value: true });
      dispatch({ type: "SET_FRAME_FROZEN", value: true });
    })();
  }, [shouldRunIntro, x, markIntroSeen]);

  // Skip intro: immediately show final state when returning to Home without a hard refresh
  useEffect(() => {
    if (shouldRunIntro) return;
    dispatch({ type: "SET_SHOW_FRAME", value: true });
    dispatch({ type: "SET_PHASE", value: "frameMoved" });
    dispatch({ type: "SET_SHOW_BODY", value: true });
    dispatch({ type: "SET_FRAME_FROZEN", value: false });
    dispatch({ type: "SET_CURSOR_TRIGGERED", value: true });
    dispatch({ type: "SET_DRAG_OK", value: true });
    dispatch({ type: "SET_FRAME_ALIGNED", value: true });
    dispatch({ type: "SET_SHOW_CURSOR", value: false });
    dispatch({ type: "SET_SHOW_ANIMATED_CURSOR", value: false });
    dispatch({ type: "SET_CURSOR_SHOULD_EXIT", value: true });
    markIntroSeen();
    const rafId = requestAnimationFrame(() => {
      if (headlineRef.current) headlineRef.current.textContent = HEADLINE;
    });
    return () => cancelAnimationFrame(rafId);
  }, [shouldRunIntro, markIntroSeen]);

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
            dispatch({ type: "SET_FRAME_THICK", value: false });
            snapBack();
          }
        }}
        onMouseEnter={() =>
          dispatch({ type: "SET_POINTER_HOVER", value: true })
        }
        onMouseLeave={() =>
          dispatch({ type: "SET_POINTER_HOVER", value: false })
        }
        dragConstraints={false}
        style={{
          x: state.frameFrozen && !state.frameAligned ? getInitialX() : x,
          y,
        }}
        className={`relative inline-block px-4 py-6 md:px-10 ${
          state.dragOK && !state.isAnimatingBack
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-default"
        } max-w-full`}
      >
        {state.showFrame && (
          <>
            {/* outline - dynamic thickness on hover and during animations */}
            <motion.div
              className="absolute inset-0 border-solid"
              style={{ borderColor: "#198ce7" }}
              initial={{ opacity: 0, borderWidth: 2 }}
              animate={{
                opacity: 1,
                borderWidth: state.frameThick || state.pointerHover ? 6 : 2,
              }}
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
            A Software Engineering&nbsp;&amp;&nbsp;Business student at Ivey
            Business School based near Toronto, building tools that{" "}
            <em>(ideally)</em> make life easier — or at least break things in
            more interesting ways.
          </p>

          {/* "currently / driven by" grid */}
          <div className="grid gap-y-10 gap-x-24 sm:grid-cols-2 text-xl">
            <div>
              <p className="italic text-2xl mb-2">currently</p>
              <p className="text-[#9b9cbe] font-semibold leading-snug">
                data analytics &amp; strategy intern
                <br />@ american global
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

HeroTypingAnimation.displayName = "HeroTypingAnimation";

export default HeroTypingAnimation;
