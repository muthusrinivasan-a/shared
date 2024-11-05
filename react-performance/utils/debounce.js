// src/utils/debounce.js

/**
 * Debounce function to delay the execution of a function until
 * the specified wait time has passed since the last call.
 * 
 * Improves Web Vitals:
 * - **FID (First Input Delay)**: Reduces input processing overhead by limiting
 *   the frequency of state updates, leading to smoother input handling.
 * - **TBT (Total Blocking Time)**: Reduces CPU work by avoiding repetitive function calls,
 *   lowering the amount of main-thread blocking.
 */
export default function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}
