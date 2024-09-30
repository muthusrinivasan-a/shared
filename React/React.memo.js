// React.memo for Component Memoization
// Purpose: Prevents unnecessary re-renders when a component’s props do not change.

// Without Optimization //
function MyComponent({ name }) {
    console.log('Rendering MyComponent');
    return <div>Hello, {name}!</div>;
  }
  
  function App() {
    const [count, setCount] = useState(0);
    return (
      <div>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <MyComponent name="John" />
      </div>
    );
  }

  // With Optimization //
  // Now, MyComponent will only re-render when its name prop changes, saving unnecessary renders. //
  const MyComponent = React.memo(({ name }) => {
    console.log('Rendering MyComponent');
    return <div>Hello, {name}!</div>;
  });
  
  function App() {
    const [count, setCount] = useState(0);
    return (
      <div>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <MyComponent name="John" />
      </div>
    );
  }

