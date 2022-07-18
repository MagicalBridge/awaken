
import React from './react';
import ReactDOM from './react-dom';
const ADD = 'ADD';
const MINUS = 'MINUS';
function reducer(state, action) {
  switch (action.type) {
    case ADD:
      return { number: state.number + 1 };
    case MINUS:
      return { number: state.number - 1 };
    default:
      return state;
  }
}
function Counter() {
  const [state, dispatch] = React.useReducer(reducer, { number: 0 });
  return (
    <div>
      <p>{state.number}</p>
      <button onClick={() => dispatch({ type: ADD })}>+</button>
      <button onClick={() => dispatch({ type: MINUS })}>-</button>
    </div>
  )
}
ReactDOM.render(<Counter />, document.getElementById('root'));
