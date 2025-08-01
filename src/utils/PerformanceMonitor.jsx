// Performance monitoring utility to track render counts and timing
import { useEffect, useRef } from 'react';

export const useRenderCount = (componentName) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    console.log(`${componentName} rendered ${renderCount.current} times`);
  });
  
  return renderCount.current;
};

export const usePerformanceTimer = (componentName) => {
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
    startTime.current = performance.now();
  });
};

export const withPerformanceMonitoring = (Component, componentName) => {
  return function PerformanceMonitoredComponent(props) {
    useRenderCount(componentName);
    usePerformanceTimer(componentName);
    return <Component {...props} />;
  };
};
