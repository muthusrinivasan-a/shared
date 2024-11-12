import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import captureWebVitals from './reportWebVitals';
import OptimizedComponent from './components/OptimizedComponent/OptimizedComponent';
import UnoptimizedComponent from './components/UnoptimizedComponent/UnoptimizedComponent';

function App() {
  return (
    <Router>
      <PageChangeHandler />
      <header className="app-header">
        <h1>React Performance Optimization</h1>
        <nav>
          <NavLink to="/" className="nav-link" activeClassName="active">Optimized</NavLink>
          <NavLink to="/unoptimized" className="nav-link" activeClassName="active">Unoptimized</NavLink>
        </nav>
      </header>
      <main className="app-content">
        <Routes>
          <Route path="/" element={<OptimizedComponent />} />
          <Route path="/unoptimized" element={<UnoptimizedComponent />} />
        </Routes>
      </main>
    </Router>
  );
}

// Component to handle page changes and capture Web Vitals
function PageChangeHandler() {
  const location = useLocation();

  useEffect(() => {
    // Callback function to handle each metric
    const handleMetric = (metric) => {
      console.log(metric);
      // Optionally send the metric to an analytics endpoint
      // fetch('/analytics', {
      //   method: 'POST',
      //   body: JSON.stringify(metric),
      //   headers: { 'Content-Type': 'application/json' },
      // });
    };

    // Capture Web Vitals on page load and every route change
    captureWebVitals(handleMetric);
  }, [location]); // Runs every time the location (route) changes

  return null;
}

export default App;



import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function App() {
    const location = useLocation();

    const reportWebVitals = () => {
        const sendToGoogleAnalytics = ({ name, delta, id }) => {
            window.gtag('event', name, {
                event_category: 'Web Vitals',
                event_label: id,
                value: Math.round(name === 'CLS' ? delta * 1000 : delta),
                non_interaction: true,
            });
        };

        getCLS(sendToGoogleAnalytics);
        getFID(sendToGoogleAnalytics);
        getFCP(sendToGoogleAnalytics);
        getLCP(sendToGoogleAnalytics);
        getTTFB(sendToGoogleAnalytics);
    };

    useEffect(() => {
        // Report Web Vitals each time the route changes
        reportWebVitals();
    }, [location.pathname]); // Depend on location.pathname to trigger on every route change

    return (
        <div>
            {/* Your main app components and routing setup */}
        </div>
    );
}

export default App;

