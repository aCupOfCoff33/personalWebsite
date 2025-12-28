/* HeroTypingAnimation.jsx */
import React, { useEffect, useRef } from "react";
import AnimatedCursor from "../../../components/common/AnimatedCursor";
import { motion, useMotionValue } from "framer-motion";
import useHeroAnimation from "../hooks/useHeroAnimation";
import HeroFrame from "./HeroFrame";
import TypewriterText from "./TypewriterText";

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
      <HeroFrame
        frameRef={frameRef}
        state={state}
        pendingSnapBack={pendingSnapBack}
        snapBack={snapBack}
        dispatch={dispatch}
        x={x}
        y={y}
        getInitialX={getInitialX}
      >
        <TypewriterText
          headlineRef={headlineRef}
          showCursor={state.showCursor}
        />
      </HeroFrame>

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
