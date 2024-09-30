// useCallback to Memoize Functions
// Purpose: Avoid function re-creations on every render, which is helpful when passing functions as props to child components.

// Without Optimization:
function App() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1); // This function is recreated every render

  return <ChildComponent increment={increment} />;
}


// With Optimization:
const increment = useCallback(() => setCount((c) => c + 1), []); // Function is memoized
