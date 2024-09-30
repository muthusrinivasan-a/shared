// Avoiding Anonymous Functions in JSX
// Purpose: Avoid creating new function instances on every render by declaring functions outside of the JSX.

// Without Optimization:
<button onClick={() => handleClick()}>Click Me</button>; // Creates a new function on every render.

// With Optimization:
const handleClick = () => {
  // Handle click
};

<button onClick={handleClick}>Click Me</button>; // Reuses the same function on every render.

// Using anonymous functions inside JSX creates a new function on every render, potentially causing unnecessary re-renders, especially when passing the function as a prop to child components.
