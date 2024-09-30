// State Management with useReducer
// Purpose: Use useReducer when managing complex state logic or when state updates depend on previous state, providing better performance than multiple useState calls.

// Without Optimization:
const [count, setCount] = useState(0);
const [name, setName] = useState('John');

// Many states that are interdependent are hard to manage.


// With Optimization (useReducer):
const initialState = { count: 0, name: 'John' };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'changeName':
      return { ...state, name: action.name };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialState);

// useReducer improves performance by bundling complex state updates into a single reducer function, especially when states are interrelated.
