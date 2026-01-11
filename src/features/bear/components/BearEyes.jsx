import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import { BEAR_MODES } from "../../../constants/bearModes";

// Unified animated eyes that adapt behavior by mode
// mode: BEAR_MODES.DEFAULT | BEAR_MODES.PROJECTS | BEAR_MODES.STORIES | BEAR_MODES.ABOUT
const BearEyes = forwardRef(function BearEyes(
  { mode = BEAR_MODES.DEFAULT },
  ref,
) {
  const leftHighlightRef = useRef(null);
  const rightHighlightRef = useRef(null);
  const leftIrisGroupRef = useRef(null);
  const rightIrisGroupRef = useRef(null);
  const eyesRootRef = useRef(null);

  const [isBlinking, setIsBlinking] = useState(false);
  const blinkTimeoutRef = useRef(null);
  const periodicBlinkTimeoutRef = useRef(null);
  const rafRef = useRef(null);
  const scanStartRef = useRef(null);
  const lookTimeoutRef = useRef(null);
  const settleTimeoutRef = useRef(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isInView, setIsInView] = useState(true);
  // Track mounted state to avoid stale timeouts causing UI to remain in blink state
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const node = eyesRootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setIsInView(entry.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const cfg = useMemo(() => {
    if (mode === BEAR_MODES.PROJECTS || mode === BEAR_MODES.STORIES) {
      return {
        BLINK_MS: 120,
        BLINK_MIN_DELAY: 2000,
        BLINK_JITTER: 5000,
        SCAN_AMPLITUDE: 2.0,
        SCAN_DOWN_BIAS: mode === BEAR_MODES.STORIES ? 1.4 : 1.2,
        SCAN_PERIOD_MS: 3200,
        SACCADE_THRESHOLD: 0.85,
        RANDOM_LOOK_MAX_PX: 3,
        RANDOM_LOOK_MIN_MS: 1200,
        RANDOM_LOOK_MAX_MS: 4500,
      };
    }
    if (mode === BEAR_MODES.ABOUT) {
      return {
        BLINK_MS: 120,
        BLINK_MIN_DELAY: 1800,
        BLINK_JITTER: 4000,
        HIGHLIGHT_MOVE: 1.5,
      };
    }
    // default
    return {
      BLINK_MS: 120,
      BLINK_MIN_DELAY: 1000,
      BLINK_JITTER: 4000,
      HIGHLIGHT_MOVE: 1.5,
    };
  }, [mode]);

  // Expose triggerBlink to parent components via ref
  useImperativeHandle(
    ref,
    () => ({
      triggerBlink: () => {
        if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
        setIsBlinking(true);
        blinkTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) setIsBlinking(false);
          blinkTimeoutRef.current = null;
        }, cfg.BLINK_MS);
      },
    }),
    [cfg.BLINK_MS],
  );

  const triggerBlink = useCallback(() => {
    if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    setIsBlinking(true);
    blinkTimeoutRef.current = setTimeout(() => {
      // Only update state if component is still mounted
      if (isMountedRef.current) setIsBlinking(false);
      blinkTimeoutRef.current = null;
    }, cfg.BLINK_MS);
  }, [cfg.BLINK_MS]);

  const schedulePeriodicBlink = useCallback(() => {
    if (periodicBlinkTimeoutRef.current)
      clearTimeout(periodicBlinkTimeoutRef.current);
    // Don't schedule blinks when not in view to save CPU
    if (!isInView) return;
    const delay = Math.random() * cfg.BLINK_JITTER + cfg.BLINK_MIN_DELAY;
    periodicBlinkTimeoutRef.current = setTimeout(() => {
      triggerBlink();
      schedulePeriodicBlink();
    }, delay);
  }, [cfg.BLINK_JITTER, cfg.BLINK_MIN_DELAY, triggerBlink, isInView]);

  useEffect(() => {
    if (!isInView) return;
    schedulePeriodicBlink();
    return () => {
      // Clear timers/rafs and make sure blink state is reset when effect re-runs
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
        blinkTimeoutRef.current = null;
      }
      if (periodicBlinkTimeoutRef.current) {
        clearTimeout(periodicBlinkTimeoutRef.current);
        periodicBlinkTimeoutRef.current = null;
      }
      // Reset visible blink state when effect cleans up (e.g. mode change)
      if (isMountedRef.current) setIsBlinking(false);
    };
  }, [schedulePeriodicBlink, isInView]);

  useEffect(() => {
    if (
      !isInView ||
      !(mode === BEAR_MODES.DEFAULT || mode === BEAR_MODES.ABOUT)
    )
      return undefined;
    const leftEl = leftHighlightRef.current;
    const rightEl = rightHighlightRef.current;
    if (!leftEl || !rightEl) return undefined;

    let mouseX = 0;
    let mouseY = 0;
    let leftBbox = null;
    let rightBbox = null;

    const updateBboxes = () => {
      if (leftEl) leftBbox = leftEl.getBoundingClientRect();
      if (rightEl) rightBbox = rightEl.getBoundingClientRect();
    };

    const updateHighlights = () => {
      if (!leftBbox || !rightBbox) updateBboxes();

      const move = (el, bbox) => {
        if (!el || !bbox) return;
        const cx = bbox.left + bbox.width / 2;
        const cy = bbox.top + bbox.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const nx = dx / dist;
        const ny = dy / dist;
        // Limit movement to stay within iris boundaries
        const maxMove = 1.0;
        const tx = nx * maxMove;
        const ty = ny * maxMove;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      };
      move(leftEl, leftBbox);
      move(rightEl, rightBbox);
      rafRef.current = null;
    };

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafRef.current)
        rafRef.current = requestAnimationFrame(updateHighlights);
    };
    const onLeave = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      [leftEl, rightEl].forEach((el) => {
        if (el) el.style.transform = "translate(0px, 0px)";
      });
    };

    const onVisibilityChange = () => {
      if (document.hidden) onLeave();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("resize", updateBboxes);
    window.addEventListener("scroll", updateBboxes, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Initial bbox calculation
    updateBboxes();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("resize", updateBboxes);
      window.removeEventListener("scroll", updateBboxes);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [mode, isInView]);

  // Projects/Stories: scanning + random looks
  // Only run animation loop when in view to save CPU/battery
  useEffect(() => {
    if (!(mode === BEAR_MODES.PROJECTS || mode === BEAR_MODES.STORIES))
      return undefined;
    // Stop animation when not in view
    if (!isInView) return undefined;
    const left = leftIrisGroupRef.current;
    const right = rightIrisGroupRef.current;
    if (!left || !right) return undefined;
    let rafId;
    const tick = (t) => {
      if (scanStartRef.current == null) scanStartRef.current = t;
      const elapsed = t - scanStartRef.current;
      const p = (elapsed % cfg.SCAN_PERIOD_MS) / cfg.SCAN_PERIOD_MS;
      const isSaccade = p > cfg.SACCADE_THRESHOLD;
      const progress = isSaccade ? 0 : p / cfg.SACCADE_THRESHOLD;
      const x = -cfg.SCAN_AMPLITUDE + 2 * cfg.SCAN_AMPLITUDE * progress;
      const y = cfg.SCAN_DOWN_BIAS;
      const tr = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      left.style.transform = tr;
      right.style.transform = tr;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [
    mode,
    isInView,
    cfg.SCAN_PERIOD_MS,
    cfg.SACCADE_THRESHOLD,
    cfg.SCAN_AMPLITUDE,
    cfg.SCAN_DOWN_BIAS,
  ]);

  // Random micro-looks for projects/stories
  // Only schedule when in view to save CPU
  const scheduleRandomLook = useCallback(() => {
    if (!(mode === BEAR_MODES.PROJECTS || mode === BEAR_MODES.STORIES)) return;
    if (!isInView) return;
    if (lookTimeoutRef.current) clearTimeout(lookTimeoutRef.current);
    const delay =
      Math.random() * (cfg.RANDOM_LOOK_MAX_MS - cfg.RANDOM_LOOK_MIN_MS) +
      cfg.RANDOM_LOOK_MIN_MS;
    lookTimeoutRef.current = setTimeout(() => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * cfg.RANDOM_LOOK_MAX_PX;
      const ox = Math.round(Math.cos(angle) * radius);
      const oy = Math.round(Math.sin(angle) * radius * 0.6);
      setEyeOffset({ x: ox, y: oy });
      const settleDelay = Math.random() * 500 + 200;
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = setTimeout(() => {
        setEyeOffset({ x: 0, y: 0 });
        scheduleRandomLook();
      }, settleDelay);
    }, delay);
  }, [
    mode,
    isInView,
    cfg.RANDOM_LOOK_MIN_MS,
    cfg.RANDOM_LOOK_MAX_MS,
    cfg.RANDOM_LOOK_MAX_PX,
  ]);

  useEffect(() => {
    scheduleRandomLook();
    return () => {
      if (lookTimeoutRef.current) clearTimeout(lookTimeoutRef.current);
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    };
  }, [scheduleRandomLook]);

  const eyeBlinkStyle = {
    transform: isBlinking ? "scaleY(0.1)" : "scaleY(1)",
    transformOrigin: "center center",
    transition: `transform ${cfg.BLINK_MS}ms ease-in-out`,
  };

  const eyeOffsetStyle = {
    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
    transition:
      mode === BEAR_MODES.PROJECTS || mode === BEAR_MODES.STORIES
        ? "transform 280ms cubic-bezier(.2,.9,.3,1)"
        : undefined,
    transformBox: "fill-box",
    transformOrigin: "center",
  };

  const trackingTransitionStyle = { transition: "transform 0.1s ease-out" };

  return (
    <g ref={eyesRootRef}>
      {/* Left eye */}
      <g style={eyeBlinkStyle}>
        <g
          ref={leftIrisGroupRef}
          style={{ transition: "transform 100ms linear" }}
        >
          <ellipse
            cx="23.3865"
            cy="34.1803"
            rx="3.2381"
            ry="3.95767"
            fill="#271711"
          />
          <g style={eyeOffsetStyle}>
            <circle
              ref={leftHighlightRef}
              cx="23.5757"
              cy="33.1655"
              r="1.19873"
              fill="#D9D9D9"
              style={
                mode === BEAR_MODES.DEFAULT
                  ? trackingTransitionStyle
                  : undefined
              }
            />
          </g>
        </g>
      </g>
      {/* Right eye */}
      <g style={eyeBlinkStyle}>
        <g
          ref={rightIrisGroupRef}
          style={{ transition: "transform 100ms linear" }}
        >
          <ellipse
            cx="44.2381"
            cy="33.9577"
            rx="3.2381"
            ry="3.95767"
            fill="#271711"
          />
          <g style={eyeOffsetStyle}>
            <circle
              ref={rightHighlightRef}
              cx="44.354"
              cy="33.1655"
              r="1.19873"
              fill="#D9D9D9"
              style={
                mode === BEAR_MODES.DEFAULT
                  ? trackingTransitionStyle
                  : undefined
              }
            />
          </g>
        </g>
      </g>
    </g>
  );
});

BearEyes.displayName = "BearEyes";
export default BearEyes;
