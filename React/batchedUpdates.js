// Purpose: Batch multiple state updates into one render, reducing unnecessary re-renders.

// Without Optimization

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John");

  function handleClick() {
    setCount(count + 1); // Causes a render
    setName("Doe");
  }

  return <button onClick={handleClick}>Click me</button>;
}

// With Optimization

import { unstable_batchedUpdates } from "react-dom";

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John");

  function handleClick() {
    unstable_batchedUpdates(() => {
      setCount(count + 1); // Both updates are batched into a single render
      setName("Doe");
    });
  }

  return <button onClick={handleClick}>Click me</button>;
}

// In React 18 and beyond, automatic batching will take care of this problem without needing these manual optimizations.