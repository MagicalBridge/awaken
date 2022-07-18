
import React from 'react';
import ReactDOM from 'react-dom';
function Counter() {
  let valueRef = React.useRef();
  const [state, setState] = React.useState(0)
  const handleClick = () => {
    let newValue = state + 1;
    valueRef.current = newValue;
    setState(newValue)
    otherFun();
  }
  function otherFun() {
    console.log('state', valueRef.current);
  }
  return (
    <div>
      <p>state:{state}</p>
      <button onClick={handleClick}>+</button>
    </div>
  )
}
ReactDOM.render(<Counter />, document.getElementById('root'));
