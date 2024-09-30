// Lazy Loading Components with React.lazy and Suspense
// Purpose: Load components only when they are needed, reducing the initial load time.

// Without Optimization:
import HeavyComponent from './HeavyComponent';

function App() {
  return <HeavyComponent />;
}

// HeavyComponent is loaded with the initial bundle, increasing the load time even if it’s not used immediately.

//With Optimization:
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
