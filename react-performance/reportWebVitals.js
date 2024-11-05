// src/reportWebVitals.js

import { onCLS, onFID, onLCP, onFCP, onINP, onTTFB } from 'web-vitals';

/**
 * Captures and reports Web Vitals metrics for a given callback.
 * This function can be called whenever needed, such as on initial load or on page changes.
 *
 * @param {Function} callback - Function to handle each Web Vitals metric.
 */
export const captureWebVitals = (callback) => {
  onCLS(callback);
  onFID(callback);
  onLCP(callback);
  onFCP(callback);
  onINP(callback);
  onTTFB(callback);
};
