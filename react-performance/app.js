// src/App.js

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';

const OptimizedComponent = lazy(() => import('./components/OptimizedComponent/OptimizedComponent'));
const UnoptimizedComponent = lazy(() => import('./components/UnoptimizedComponent/UnoptimizedComponent'));

function App() {
  return (
    <Router>
      <header className="app-header">
        <h1>React Performance Optimization</h1>
        <nav>
          <NavLink to="/" className="nav-link" activeClassName="active">Optimized</NavLink>
          <NavLink to="/unoptimized" className="nav-link" activeClassName="active">Unoptimized</NavLink>
        </nav>
      </header>
      <main className="app-content">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<OptimizedComponent />} />
            <Route path="/unoptimized" element={<UnoptimizedComponent />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
