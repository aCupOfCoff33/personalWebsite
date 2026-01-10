import React, { createContext, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Create context in separate file to avoid fast refresh issues
const BearContext = createContext();

const ANIM = {
  DURATION: 420, // ms for transform/opacity animation
  HALF: 210,
  ENTRY_DELAY: 120, // increase to allow layout/paint before animating in
};

const BearProvider = ({ children }) => {
  const location = useLocation();

  const getLocationKey = (loc) => `${loc.pathname}${loc.hash || ""}`;

  const detectType = (loc) => {
    // Be resilient to nested base paths and hash routing by checking segments from pathname + hash
    const rawSegments = []
      .concat(loc.pathname || "")
      .concat(loc.hash || "")
      .join("/")
      .split("/")
      .filter(Boolean)
      .map((seg) => seg.replace(/^#/, ""));

    const segments = rawSegments.filter(Boolean);

    if (segments.includes("projects")) return "projects"; // macbook
    if (segments.includes("notes") || segments.includes("stories"))
      return "stories"; // reading/book
    if (segments.includes("resume")) return "resume";
    if (segments.includes("about")) return "about"; // green quarter zip
    return "default";
  };

  const getInitialState = () => {
    const t = detectType(location);

    // If the app loads on a non-default route, start with default as current and
    // make the real route a pendingType so it can animate in (hidden -> transitioning-up -> visible).
    if (t === "default") {
      return {
        currentType: "default",
        previousType: null,
        pendingType: null,
        isTransitioning: false,
        itemPosition: "visible",
      };
    }

    return {
      currentType: "default", // remain default so we can animate the incoming item
      previousType: null,
      pendingType: t,
      isTransitioning: true,
      itemPosition: "hidden", // incoming starts hidden and will transition-up
    };
  };

  const [bearState, setBearState] = useState(getInitialState());

  // Track pending timeouts and navigation intent to handle rapid navigation
  const timeoutRefsRef = useRef([]);
  const navigationIntentRef = useRef(null);
  const isMountedRef = useRef(true);
  const currentPathnameRef = useRef(getLocationKey(location));

  // Update pathname ref whenever location changes
  useEffect(() => {
    currentPathnameRef.current = getLocationKey(location);
  }, [location.pathname, location.hash]);

  // Helper to schedule state updates that respect navigation intent
  const scheduleStateUpdate = (delayMs, updateFn) => {
    const timeoutId = setTimeout(() => {
      // Only apply update if this navigation intent is still current and component is mounted
      if (
        isMountedRef.current &&
        navigationIntentRef.current === currentPathnameRef.current
      ) {
        updateFn();
      }
    }, delayMs);

    timeoutRefsRef.current.push(timeoutId);
  };

  // Cleanup function to clear all pending timeouts
  const clearPendingTimeouts = () => {
    timeoutRefsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutRefsRef.current = [];
  };

  // If the app boots with a pendingType (non-default initial route), animate it up
  useEffect(() => {
    // Only run once after mount
    if (bearState.pendingType && bearState.itemPosition === "hidden") {
      // Update navigation intent
      navigationIntentRef.current = getLocationKey(location);

      // small delay to ensure DOM painted
      scheduleStateUpdate(ANIM.ENTRY_DELAY, () => {
        setBearState((cur) => ({ ...cur, itemPosition: "transitioning-up" }));
      });

      scheduleStateUpdate(ANIM.ENTRY_DELAY + ANIM.DURATION, () => {
        setBearState((cur) => ({
          ...cur,
          currentType: cur.pendingType,
          previousType: null,
          pendingType: null,
          itemPosition: "visible",
          isTransitioning: false,
        }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newType = detectType(location);

    setBearState((prev) => {
      if (newType === prev.currentType) return prev;

      // Clear any pending timeouts from previous navigation
      clearPendingTimeouts();

      // Update navigation intent to current path
      navigationIntentRef.current = getLocationKey(location);

      // Case: navigating to home (default) -> snap back to plain bear immediately
      if (newType === "default") {
        return {
          ...prev,
          currentType: "default",
          previousType: null,
          pendingType: null,
          itemPosition: "visible",
          isTransitioning: false,
        };
      }

      // Start a transition. We'll keep currentType as the currently visible item
      // and set pendingType to the target so both can be rendered during animation.
      const startState = {
        ...prev,
        previousType: prev.currentType, // Track the type we're transitioning away from
        pendingType: newType,
        isTransitioning: true,
      };

      // Case: coming from home -> entering projects/stories
      if (prev.currentType === "default") {
        // small delay to mount incoming element, then animate it up
        startState.itemPosition = "hidden";

        scheduleStateUpdate(ANIM.ENTRY_DELAY, () => {
          setBearState((cur) => ({ ...cur, itemPosition: "transitioning-up" }));
        });

        scheduleStateUpdate(ANIM.ENTRY_DELAY + ANIM.DURATION, () => {
          setBearState((cur) => ({
            ...cur,
            currentType: newType,
            previousType: null, // Clear previousType
            pendingType: null,
            itemPosition: "visible",
            isTransitioning: false,
          }));
        });

        return startState;
      }

      // Case: switching between two non-defaults (projects <-> stories)
      // Slide current down, then slide incoming up
      startState.itemPosition = "transitioning-down";

      scheduleStateUpdate(ANIM.HALF + 40, () => {
        setBearState((cur) => ({ ...cur, itemPosition: "transitioning-up" }));
      });

      scheduleStateUpdate(ANIM.DURATION + 100, () => {
        setBearState((cur) => ({
          ...cur,
          currentType: newType,
          previousType: null, // Clear previousType
          pendingType: null,
          itemPosition: "visible",
          isTransitioning: false,
        }));
      });

      return startState;
    });
  }, [location.pathname, location.hash]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clear any remaining timeouts
      timeoutRefsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutRefsRef.current = [];
    };
  }, []);

  return (
    <BearContext.Provider value={{ bearState, setBearState }}>
      {children}
    </BearContext.Provider>
  );
};

export { BearContext };
export default BearProvider;
