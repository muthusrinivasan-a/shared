
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { captureWebVitals } from './reportWebVitals';

ReactDOM.render(<App />, document.getElementById('root'));

// Capture Web Vitals on initial page load
captureWebVitals((metric) => {
  console.log(metric);
  // Optionally send metric to an analytics endpoint
  // fetch('/analytics', {
  //   method: 'POST',
  //   body: JSON.stringify(metric),
  //   headers: { 'Content-Type': 'application/json' },
  // });
});
