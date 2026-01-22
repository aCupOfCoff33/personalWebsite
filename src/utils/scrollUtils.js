const FORCE_TOP_KEY = "app:force-scroll-top";

/**
 * Check if we should force scroll to top (set by navigation actions)
 * @returns {boolean}
 */
export function shouldForceTop() {
  try {
    const val = sessionStorage.getItem(FORCE_TOP_KEY);
    if (val === "true") {
      sessionStorage.removeItem(FORCE_TOP_KEY);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Mark next navigation as "force scroll to top"
 * Call this before navigate() to ensure the destination page scrolls to top
 */
export function markForceScrollTop() {
  try {
    sessionStorage.setItem(FORCE_TOP_KEY, "true");
  } catch {
    // ignore storage errors
  }
}
