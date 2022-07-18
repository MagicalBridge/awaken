
import React from './react';
import ReactDOM from './react-dom';

function Child(props, ref) {
  const inputRef = React.useRef();
  React.useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} />
}
const ForwardChild = React.forwardRef(Child);

function Parent() {
  const [number, setNumber] = React.useState(0);
  const inputRef = React.useRef();
  const getFocus = () => {
    inputRef.current.focus();
    //父组件获取子组件的ref之后不但可以获得焦点，可以为所欲为
    //子组件我想自定义暴露给父组件的内容
    //inputRef.current.remove();
  }
  return (
    <div>
      <ForwardChild ref={inputRef} />
      <button onClick={getFocus}>获取焦点</button>
      <p>{number}</p>
      <button onClick={() => setNumber(number + 1)}>+</button>
    </div>
  )
}
ReactDOM.render(<Parent />, document.getElementById('root'));
