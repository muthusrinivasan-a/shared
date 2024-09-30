// Using useRef for Persistent Values
// Purpose: Use useRef to persist values across renders without causing re-renders (e.g., timers, DOM references, or previous state values).

// Without Optimization
const [timer, setTimer] = useState(null); // Updating this triggers re-renders unnecessarily.

// With Optimization
const timer = useRef(null); // Updating this does not cause re-renders.

// useRef is ideal for storing mutable values that don’t need to trigger re-renders, like DOM references or timers.