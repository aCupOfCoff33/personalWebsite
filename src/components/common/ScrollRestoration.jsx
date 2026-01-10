import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const STORAGE_KEY = "app:scroll-positions";

function readStoredPositions() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    // If parsing fails, ignore and start fresh
    return {};
  }
}

function writeStoredPositions(obj) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // ignore storage errors (private mode etc.)
  }
}

function getScroll(el) {
  if (!el) {
    return {
      top: window.scrollY || window.pageYOffset || 0,
      left: window.scrollX || 0,
    };
  }
  // DOM element with scrollTop/scrollLeft
  return { top: el.scrollTop || 0, left: el.scrollLeft || 0 };
}

function setScroll(el, { top = 0, left = 0 } = {}) {
  if (!el) {
    window.scrollTo({ top, left });
    return;
  }
  el.scrollTo?.({ top, left, behavior: "auto" }) ??
    ((el.scrollTop = top), (el.scrollLeft = left));
}

export default function ScrollRestoration({ containerRef }) {
  const location = useLocation();
  // positionsRef stores scroll positions keyed by location.key (or pathname fallback)
  const positionsRef = useRef(new Map());
  const prevKeyRef = useRef(null);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    const stored = readStoredPositions();
    // stored is an object mapping keys -> {top,left}
    Object.keys(stored).forEach((k) => {
      const value = stored[k];
      if (value && typeof value.top === "number") {
        positionsRef.current.set(k, value);
      }
    });
  }, []);

  // Persist to sessionStorage whenever positionsRef changes (on unmount or before unload)
  useEffect(() => {
    const onBeforeUnload = () => {
      const obj = {};
      positionsRef.current.forEach((value, key) => {
        obj[key] = value;
      });
      writeStoredPositions(obj);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      onBeforeUnload();
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  // Save previous position and restore new one when location.key changes
  useEffect(() => {
    const key = location.key || location.pathname; // location.key can be undefined in some setups; fallback to pathname
    const prevKey = prevKeyRef.current;

    // Save current scroll for the previous key
    if (prevKey != null) {
      try {
        const el = containerRef?.current ?? null;
        const pos = getScroll(el);
        positionsRef.current.set(prevKey, pos);
      } catch {
        // swallow
      }
    }

    // Restore scroll for the new location (if exists)
    const saved = positionsRef.current.get(key);
    if (saved) {
      // Use requestAnimationFrame to ensure DOM/layout is ready
      requestAnimationFrame(() => {
        try {
          const el = containerRef?.current ?? null;
          setScroll(el, saved);
        } catch {
          // swallow
        }
      });
    }

    prevKeyRef.current = key;

    // Whenever location changes, also persist a snapshot to sessionStorage (cheap)
    const obj = {};
    positionsRef.current.forEach((value, k) => {
      obj[k] = value;
    });
    writeStoredPositions(obj);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, location.pathname]);

  // Optionally track scroll events and update the stored position live for the active route key.
  // This reduces chance of losing position if user navigates away quickly.
  useEffect(() => {
    const key = location.key || location.pathname;
    let ticking = false;

    // Capture the event target and positions map so cleanup doesn't reference changing refs
    const eventTarget = containerRef?.current ?? window;
    const positionsMap = positionsRef.current;

    const handler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        try {
          const targetEl = containerRef?.current ?? null;
          const pos = getScroll(targetEl);
          positionsMap.set(key, pos);
        } finally {
          ticking = false;
        }
      });
    };

    // Use the captured event target for add/remove
    eventTarget.addEventListener("scroll", handler, { passive: true });

    return () => {
      eventTarget.removeEventListener("scroll", handler);
      // store final position for this key on detach using captured values
      try {
        const finalPos = getScroll(eventTarget === window ? null : eventTarget);
        positionsMap.set(key, finalPos);
      } catch {
        // swallow
      }
    };
  }, [containerRef, location.key, location.pathname]);

  return null;
}

ScrollRestoration.propTypes = {
  // A React ref object pointing at the scrollable container element.
  // If omitted or null, the component falls back to window scroll.
  containerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};
