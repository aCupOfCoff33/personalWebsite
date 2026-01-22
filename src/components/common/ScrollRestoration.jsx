import { useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import PropTypes from "prop-types";
import { shouldForceTop } from "../../utils/scrollUtils";

const STORAGE_KEY = "app:scroll-positions";
const VISITED_PAGES_KEY = "app:visited-pages";

// Read/write helpers for sessionStorage
function readStoredPositions() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
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

function readVisitedPages() {
  try {
    const raw = sessionStorage.getItem(VISITED_PAGES_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function writeVisitedPages(set) {
  try {
    sessionStorage.setItem(VISITED_PAGES_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore storage errors
  }
}

function getScroll(el) {
  if (!el) {
    return {
      top: window.scrollY || window.pageYOffset || 0,
      left: window.scrollX || 0,
    };
  }
  return { top: el.scrollTop || 0, left: el.scrollLeft || 0 };
}

function setScroll(el, { top = 0, left = 0 } = {}) {
  if (!el) {
    window.scrollTo({ top, left, behavior: "auto" });
    return;
  }
  // Force instant scroll by setting scrollTop directly (bypasses CSS scroll-behavior: smooth)
  el.scrollTop = top;
  el.scrollLeft = left;
}

export default function ScrollRestoration({ containerRef }) {
  const location = useLocation();
  const navigationType = useNavigationType();

  // Refs for storing positions and tracking state
  const positionsRef = useRef(new Map());
  const prevPageIdRef = useRef(null);
  const visitedPagesRef = useRef(new Set());
  const isHydratedRef = useRef(false);
  const pendingScrollRef = useRef(null);

  // Hydrate from sessionStorage on mount (synchronous before first render effect)
  useLayoutEffect(() => {
    if (isHydratedRef.current) return;

    const stored = readStoredPositions();
    Object.keys(stored).forEach((k) => {
      const value = stored[k];
      if (value && typeof value.top === "number") {
        positionsRef.current.set(k, value);
      }
    });

    const visited = readVisitedPages();
    visitedPagesRef.current = visited;
    isHydratedRef.current = true;
  }, []);

  // Persist positions on beforeunload
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

  // Function to apply scroll position with retry logic for lazy-loaded content
  const applyScrollPosition = useCallback((el, targetPos, maxRetries = 10) => {
    let retries = 0;

    const attemptScroll = () => {
      if (!el) return;

      // Set the scroll position
      setScroll(el, targetPos);

      // Verify it was applied (content might not be tall enough yet)
      const currentPos = getScroll(el);
      const targetTop = targetPos.top || 0;

      // If we're trying to scroll to 0, or the scroll was successful, we're done
      if (targetTop === 0 || Math.abs(currentPos.top - targetTop) < 5) {
        pendingScrollRef.current = null;
        return;
      }

      // Content might not be ready, retry
      retries++;
      if (retries < maxRetries) {
        requestAnimationFrame(attemptScroll);
      } else {
        pendingScrollRef.current = null;
      }
    };

    // Use double RAF to wait for paint
    requestAnimationFrame(() => {
      requestAnimationFrame(attemptScroll);
    });
  }, []);

  // Immediately scroll to top when location changes (before lazy content loads)
  // Using useLayoutEffect to run synchronously before paint
  useLayoutEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    const pageId = `${location.pathname}${location.search}${location.hash || ""}`;
    const forceTop = shouldForceTop();
    const isFirstVisit = !visitedPagesRef.current.has(pageId);

    // Determine what scroll position we want
    let targetPos = { top: 0, left: 0 };

    if (forceTop || isFirstVisit) {
      // Force scroll to top
      targetPos = { top: 0, left: 0 };
    } else if (navigationType === "POP") {
      // Browser back/forward - try to restore saved position
      const saved = positionsRef.current.get(pageId);
      if (saved) {
        targetPos = saved;
      }
    } else {
      // Regular navigation to previously visited page - scroll to top
      // This is the expected behavior for clicking links
      targetPos = { top: 0, left: 0 };
    }

    // Apply scroll immediately (synchronously) to prevent flash of wrong position
    setScroll(el, targetPos);

    // Store pending scroll for retry after lazy content loads
    pendingScrollRef.current = targetPos;
  }, [
    location.pathname,
    location.search,
    location.hash,
    containerRef,
    navigationType,
  ]);

  // After render, retry scroll application to handle lazy-loaded content
  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    const pageId = `${location.pathname}${location.search}${location.hash || ""}`;
    const prevPageId = prevPageIdRef.current;

    // Save scroll position for the previous page
    if (prevPageId != null && prevPageId !== pageId) {
      try {
        const pos = getScroll(el);
        positionsRef.current.set(prevPageId, pos);
      } catch {
        // swallow
      }
    }

    // Mark current page as visited
    if (!visitedPagesRef.current.has(pageId)) {
      visitedPagesRef.current.add(pageId);
      writeVisitedPages(visitedPagesRef.current);
    }

    // Update prev page ref
    prevPageIdRef.current = pageId;

    // Apply pending scroll with retry logic (handles lazy content)
    if (pendingScrollRef.current) {
      applyScrollPosition(el, pendingScrollRef.current);
    }

    // Persist positions
    const obj = {};
    positionsRef.current.forEach((value, k) => {
      obj[k] = value;
    });
    writeStoredPositions(obj);
  }, [
    location.pathname,
    location.search,
    location.hash,
    containerRef,
    applyScrollPosition,
  ]);

  // Track scroll position live
  useEffect(() => {
    const pageId = `${location.pathname}${location.search}${location.hash || ""}`;
    let ticking = false;

    const eventTarget = containerRef?.current ?? window;
    const positionsMap = positionsRef.current;

    const handler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        try {
          const targetEl = containerRef?.current ?? null;
          const pos = getScroll(targetEl);
          positionsMap.set(pageId, pos);
        } finally {
          ticking = false;
        }
      });
    };

    eventTarget.addEventListener("scroll", handler, { passive: true });

    return () => {
      eventTarget.removeEventListener("scroll", handler);
      try {
        const finalPos = getScroll(eventTarget === window ? null : eventTarget);
        positionsMap.set(pageId, finalPos);
      } catch {
        // swallow
      }
    };
  }, [containerRef, location.pathname, location.search, location.hash]);

  return null;
}

ScrollRestoration.propTypes = {
  containerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};
