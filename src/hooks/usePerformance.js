import { useEffect, useRef } from "react";

// Custom hook for performance monitoring and optimization
export const usePerformanceMonitor = (componentName, enabled = false) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    if (!enabled || import.meta.env.PROD) return;

    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    console.log(`🔍 Performance Monitor - ${componentName}:`, {
      renderCount: renderCount.current,
      timeSinceLastRender,
      timestamp: new Date().toISOString(),
    });
  });

  return {
    renderCount: renderCount.current,
  };
};

// Hook for measuring component mount time
export const useMountTime = (componentName, enabled = false) => {
  const mountTime = useRef(null);

  useEffect(() => {
    if (!enabled || import.meta.env.PROD) return;

    const startTime = performance.now();
    mountTime.current = startTime;

    return () => {
      const endTime = performance.now();
      const mountDuration = endTime - startTime;
      console.log(
        `⏱️ Mount Time - ${componentName}: ${mountDuration.toFixed(2)}ms`,
      );
    };
  }, [componentName, enabled]);

  return mountTime.current;
};

// Hook for tracking when components re-render and why
export const useWhyDidYouUpdate = (name, props, enabled = false) => {
  const previousProps = useRef();

  useEffect(() => {
    if (!enabled || import.meta.env.PROD) return;

    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps = {};

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log(`🔄 Why did you update - ${name}:`, changedProps);
      }
    }

    previousProps.current = props;
  });
};

// Hook for throttling function calls to improve performance
export const useThrottle = (callback, delay = 16) => {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const throttledFunction = useRef((...args) => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    if (timeSinceLastRun >= delay) {
      lastRun.current = now;
      callback(...args);
    } else {
      // Schedule the call for later if not enough time has passed
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        lastRun.current = Date.now();
        callback(...args);
      }, delay - timeSinceLastRun);
    }
  }).current;

  return throttledFunction;
};
