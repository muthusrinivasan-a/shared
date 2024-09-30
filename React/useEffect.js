// Optimize Side Effects with useEffect
// Purpose: Avoid unnecessary side effects (like API calls, subscriptions, etc.) by correctly handling dependencies in useEffect.

// Without Optimization:
useEffect(() => {
  fetchData();
}); // This runs on every render because there are no dependencies.

// With Optimization
useEffect(() => {
  fetchData();
}, []); // This runs only on the initial mount, avoiding unnecessary API calls.



// Avoid Unnecessary useEffect Dependencies
// Purpose: Avoid adding unnecessary dependencies to useEffect that trigger re-renders, leading to performance issues.

// Without Optimization:
useEffect(() => {
  // Function that depends on many variables
}, [count, name, age, otherState]); // Adding many dependencies unnecessarily.


// With Optimization:
useEffect(() => {
  // Function that only depends on count
}, [count]); // Limit dependencies to only what's needed.


