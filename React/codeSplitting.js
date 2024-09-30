// Code Splitting with Dynamic Import
// Purpose: Split code into smaller bundles that are loaded dynamically.

// Without Optimization:

import { BigModule } from "./BigModule";

function App() {
  return <BigModule />;
}

// BigModule is part of the initial bundle, which can bloat the bundle size and increase the load time.

// With Optimization

function App() {
  const [module, setModule] = useState(null);

  useEffect(() => {
    import("./BigModule").then((mod) => setModule(mod.BigModule));
  }, []);

  return module ? <module /> : <div>Loading...</div>;
}

// BigModule is loaded dynamically, only when needed, reducing the initial bundle size.