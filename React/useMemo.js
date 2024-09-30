// useMemo to Memoize Expensive Calculations
// Purpose: Prevents expensive calculations from running on every render.

// Without Optimization:

function App() {
  const [count, setCount] = useState(0);
  const expensiveCalculation = expensiveFunction(count); // This runs on every render

  return <div>{expensiveCalculation}</div>;
}

// The expensiveFunction is called every time the component re-renders, even if the count has not changed.

// With Optimization (useMemo):
const expensiveCalculation = useMemo(() => expensiveFunction(count), [count]); // Only runs when `count` changes

