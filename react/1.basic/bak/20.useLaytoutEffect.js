
import React from './react';
import ReactDOM from './react-dom';
function Animation() {
  const ref = React.useRef();//{current:null} useRef会在多次渲染的时候保持同一个对象，而createRef每次都会返回新对象
  React.useEffect(() => {
    ref.current.style.transform = `translate(500px)`;
    ref.current.style.transition = 'all 500ms';
  });
  let style = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'red'
  }
  return (
    <div style={style} ref={ref}></div>
  )
}
ReactDOM.render(<Animation />, document.getElementById('root'));
