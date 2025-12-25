// Reading bear component that syncs page flips with note sections
// - Animated book positioning based on route transitions
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNotesTOC, useNotesScroll } from "../notes/NotesContext";
import { useBearState } from "../../hooks/useBearState";
import BearEars from "./BearEars";

const MAX_HIGHLIGHT_MOVEMENT = 1.5; // highlight wobble (inside the iris)
const BLINK_DURATION_MS = 120;

// reading motion tuning
const EYE_SCAN_AMPLITUDE_PX = 2.0;
const EYE_SCAN_DOWN_BIAS_PX = 1.4;
const EYE_SCAN_PERIOD_MS = 3200;
const SACCADE_THRESHOLD = 0.85;

const PAGE_FLIP_DURATION_MS = 320;
const PAGE_FLIP_DEG = -12;

const BearIconReading = React.memo(
  ({ className = "", showBase = true, idSuffix = "" }) => {
    const [isBlinking, setIsBlinking] = useState(false);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const svgRef = useRef(null);
    const { bearState } = useBearState();

    const leftHighlightRef = useRef(null);
    const rightHighlightRef = useRef(null);
    const leftIrisGroupRef = useRef(null);
    const rightIrisGroupRef = useRef(null);
    const pageRef = useRef(null);

    const blinkTimeoutRef = useRef(null);
    const periodicBlinkTimeoutRef = useRef(null);
    const scanStartRef = useRef(null);
    const pageFlipResetTimeoutRef = useRef(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    const { tocItems } = useNotesTOC();
    const { readingProgress } = useNotesScroll();

    const getBookTransform = () => {
      // Outgoing: if we were stories and are transitioning down, slide it away (check this first)
      if (
        bearState.previousType === "stories" &&
        bearState.itemPosition === "transitioning-down"
      ) {
        return "translateY(60px)";
      }

      if (bearState.pendingType === "stories") {
        switch (bearState.itemPosition) {
          case "hidden":
            return "translateY(60px)";
          case "transitioning-up":
          case "visible":
            return "translateY(0px)";
          default:
            return "translateY(60px)";
        }
      }

      if (bearState.currentType === "stories") {
        if (bearState.itemPosition === "hidden") return "translateY(60px)";
        return "translateY(0px)";
      }

      return "translateY(60px)";
    };

    const getBookTransformAttr = () => {
      const tx = getBookTransform();
      if (tx.startsWith("translateY")) {
        const num = tx.replace(/translateY\(|px\)/g, "");
        return `translate(0 ${num})`;
      }
      return "translate(0 0)";
    };

    // Decide whether to mount/render the book group. Keep it mounted during exit animations.
    const shouldRenderBook = (() => {
      const pos = bearState?.itemPosition;
      if (bearState?.pendingType === "stories") return pos !== "hidden";
      if (bearState?.currentType === "stories") return true;
      // outgoing: keep rendering during transitioning-down to animate out
      if (bearState?.previousType === "stories" && pos === "transitioning-down")
        return true;
      return false;
    })();

    const triggerBlink = useCallback(() => {
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
      setIsBlinking(true);
      blinkTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) setIsBlinking(false);
        blinkTimeoutRef.current = null;
      }, BLINK_DURATION_MS);
    }, []);

    const schedulePeriodicBlink = useCallback(() => {
      if (periodicBlinkTimeoutRef.current)
        clearTimeout(periodicBlinkTimeoutRef.current);
      const delay = Math.random() * 5000 + 2000;
      periodicBlinkTimeoutRef.current = setTimeout(() => {
        triggerBlink();
        schedulePeriodicBlink();
      }, delay);
    }, [triggerBlink]);

    useEffect(() => {
      schedulePeriodicBlink();
      return () => {
        if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
        if (periodicBlinkTimeoutRef.current)
          clearTimeout(periodicBlinkTimeoutRef.current);
        if (isMountedRef.current) setIsBlinking(false);
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
        const p = (elapsed % EYE_SCAN_PERIOD_MS) / EYE_SCAN_PERIOD_MS;
        const isSaccade = p > SACCADE_THRESHOLD;
        const progress = isSaccade ? 0 : p / SACCADE_THRESHOLD;
        const x = -EYE_SCAN_AMPLITUDE_PX + 2 * EYE_SCAN_AMPLITUDE_PX * progress;
        const y = EYE_SCAN_DOWN_BIAS_PX;
        const tStr = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
        left.style.transform = tStr;
        right.style.transform = tStr;
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
    }, []);

    useEffect(() => {
      if (!tocItems?.length) return;
      const newSectionIndex = Math.floor(readingProgress * tocItems.length);
      const clampedIndex = Math.max(
        0,
        Math.min(newSectionIndex, tocItems.length - 1),
      );
      if (clampedIndex !== currentSectionIndex) {
        setCurrentSectionIndex(clampedIndex);
        const page = pageRef.current;
        if (page) {
          page.style.transition = `transform ${PAGE_FLIP_DURATION_MS}ms ease-in-out`;
          page.style.transformOrigin = "32px 110px";
          page.style.transform = `rotateY(${PAGE_FLIP_DEG}deg)`;
          if (pageFlipResetTimeoutRef.current)
            clearTimeout(pageFlipResetTimeoutRef.current);
          pageFlipResetTimeoutRef.current = setTimeout(() => {
            if (page) page.style.transform = "rotateY(0deg)";
          }, PAGE_FLIP_DURATION_MS);
        }
      }
    }, [tocItems, readingProgress, currentSectionIndex]);

    useEffect(() => {
      return () => {
        if (pageFlipResetTimeoutRef.current)
          clearTimeout(pageFlipResetTimeoutRef.current);
      };
    }, []);

    const handleClick = () => triggerBlink();

    const eyeBlinkStyle = {
      transform: isBlinking ? "scaleY(0.1)" : "scaleY(1)",
      transformOrigin: "center center",
      transition: `transform ${BLINK_DURATION_MS}ms ease-in-out`,
    };

    return (
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 68 68"
        fill="none"
        className={className}
        role="img"
        aria-label="Bear reading a book"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <defs>
          <linearGradient
            id={`bookLeft${idSuffix}`}
            x1="20.7"
            y1="39.3"
            x2="34"
            y2="61.6"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#C73B33" />
            <stop offset="1" stopColor="#9E2B26" />
          </linearGradient>
          <linearGradient
            id={`bookRight${idSuffix}`}
            x1="46.7"
            y1="39.3"
            x2="34"
            y2="61.6"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D85C55" />
            <stop offset="1" stopColor="#A1332D" />
          </linearGradient>
          <clipPath id={`bearCircleMaskReading${idSuffix}`}>
            <circle cx="34" cy="34" r="34" />
          </clipPath>
        </defs>

        {showBase && (
          <>
            <circle cx="34" cy="34" r="34" fill="#E7E9E8" />
            <BearEars />
            <path
              d="M33.6406 14.75C47.1716 14.75 58.1406 24.6557 58.1406 36.875C58.1406 49.0943 47.1716 59 33.6406 59C20.1096 59 9.14062 49.0943 9.14062 36.875C9.14062 24.6557 20.1096 14.75 33.6406 14.75Z"
              fill="#B56A2B"
            />
            <path
              d="M34 34C40.9229 34 42.9999 40.7853 43 44.5322C43 51.6425 38.9076 53 34.0645 53C29.2215 52.9999 25 50.9637 25 44.5322C25.0001 40.7853 27.0771 34 34 34Z"
              fill="#CD853F"
            />
            <path
              d="M30.4018 45.6937C30.3419 45.6937 30.042 45.5138 29.3225 44.7942C28.6029 44.0746 29.1426 43.7748 29.5024 43.7148C29.5623 43.9547 30.042 44.5783 31.4812 45.154C33.2801 45.8736 33.8198 44.0746 33.8198 44.7942C33.8198 45.5138 33.8198 45.6937 33.1002 46.0535C32.5246 46.3413 31.6611 46.1734 31.3013 46.0535L30.4018 45.6937Z"
              fill="#241E16"
              stroke="#281E11"
            />
            <path
              d="M37.063 45.6937C37.123 45.6937 37.4228 45.5138 38.1424 44.7942C38.862 44.0746 38.3223 43.7748 37.9625 43.7148C37.9025 43.9547 37.4228 44.5783 35.9836 45.154C34.1847 45.8736 33.645 44.0746 33.645 44.7942C33.645 45.5138 33.645 45.6937 34.3646 46.0535C34.9403 46.3413 35.8038 46.1734 36.1635 46.0535L37.063 45.6937Z"
              fill="#241E16"
              stroke="#281E11"
            />
          </>
        )}

        {/* Eyes (render behind book) */}
        {showBase && (
          <>
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
                <circle
                  ref={leftHighlightRef}
                  cx="23.5757"
                  cy="33.1655"
                  r="1.19873"
                  fill="#D9D9D9"
                />
              </g>
            </g>
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
                <circle
                  ref={rightHighlightRef}
                  cx="44.354"
                  cy="33.1655"
                  r="1.19873"
                  fill="#D9D9D9"
                />
              </g>
            </g>
          </>
        )}

        {/* Book (only mount when it should appear inside the white circle) */}
        {shouldRenderBook && (
          <g
            aria-hidden="true"
            clipPath={`url(#bearCircleMaskReading${idSuffix})`}
            transform={getBookTransformAttr()}
            style={{
              transform: getBookTransform(),
              transition: "transform 420ms cubic-bezier(0.4, 0, 0.2, 1)",
              transformOrigin: "center bottom",
              pointerEvents: "none",
            }}
          >
            <g ref={pageRef} style={{ transformOrigin: "17px 58.5px" }}>
              <path d="M34 42.5 L17 36.1 L17 61.6 L34 64.8 Z" fill="#F6ECEB" />
              <g stroke="#C4B5B3" strokeWidth="0.42">
                <line x1="19.1" y1="43.5" x2="31.9" y2="41.4" />
                <line x1="19.6" y1="46.7" x2="31.3" y2="44.6" />
                <line x1="19.6" y1="49.9" x2="31.3" y2="47.8" />
                <line x1="19.6" y1="53.1" x2="31.3" y2="51" />
                <line x1="19.6" y1="56.3" x2="31.3" y2="54.2" />
                <line x1="19.6" y1="59.5" x2="31.3" y2="57.4" />
              </g>
            </g>

            <path
              d="M34 41.4 L17 35 L17 62.7 L34 65.9 Z"
              fill={`url(#bookLeft${idSuffix})`}
            />
            <path
              d="M34 41.4 L51 35 L51 62.7 L34 65.9 Z"
              fill={`url(#bookRight${idSuffix})`}
            />
            <path d="M34 41.4 L34 65.9" stroke="#E6D3D1" strokeWidth="1.06" />
            <g stroke="#EBD9D6" strokeWidth="0.42">
              <line x1="36.1" y1="44.6" x2="48.9" y2="41.4" />
              <line x1="36.6" y1="47.8" x2="48.3" y2="44.6" />
              <line x1="36.6" y1="51" x2="48.3" y2="47.8" />
              <line x1="36.6" y1="54.2" x2="48.3" y2="51" />
              <line x1="36.6" y1="57.4" x2="48.3" y2="54.2" />
            </g>
          </g>
        )}
      </svg>
    );
  },
);

BearIconReading.displayName = "BearIconReading";
export default BearIconReading;
