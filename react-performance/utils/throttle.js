// src/utils/throttle.js

/**
 * Throttle function to limit the execution of a function to once
 * every specified time interval. Useful for scroll events.
 * 
 * Improves Web Vitals:
 * - **CLS (Cumulative Layout Shift)**: Controls scroll event frequency, reducing layout shifts caused by excessive re-renders.
 * - **FID (First Input Delay)**: Prevents high-frequency scroll event handlers from affecting response times.
 * - **TBT (Total Blocking Time)**: Minimizes main-thread blocking by reducing the frequency of function executions.
 */
export default function throttle(func, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
