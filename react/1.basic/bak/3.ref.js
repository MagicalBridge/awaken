/* eslint-disable no-unused-vars */
/* eslint-disable no-unreachable */
import React from './react';
import ReactDOM from './react-dom';
class Counter extends React.Component {
  render() { return <div>Counter</div> }
}
function Func(props, forwardRef) {
  return <div ref={forwardRef}>Func</div>
}
const ForwardFunc = React.forwardRef(Func);
console.log(ForwardFunc);
let lastCounter;
class Sum extends React.Component {
  constructor(props) {
    super(props)
    this.a = React.createRef();//{current:null}
    this.b = { current: null };
    this.counter = React.createRef();
    this.result = React.createRef();
    this.any = React.createRef();
    this.func = React.createRef();
    this.state = { number: 0 };
  }
  handleClick = () => {
    let valueA = this.a.current.value;
    let valueB = this.b.current.value;
    this.result.current.value = valueA + valueB;
  }
  onClick = () => {
    console.log('this.func.current', this.func.current);
    lastCounter = this.counter.current
    this.setState(state => ({ number: state.number + 1 }), function () {
      console.log(this.counter.current === lastCounter);
    });
  }
  render() {
    this.any.current = {};
    return (
      <div>
        <Counter ref={this.counter} />
        <ForwardFunc ref={this.func} />
        <button onClick={this.onClick}>{this.state.number}</button>
        <input ref={this.a} />+<input ref={this.b} /><button onClick={this.handleClick}>=</button><input ref={this.result} />
      </div>
    )
  }

}
ReactDOM.render(<Sum />, document.getElementById('root'));

/**
 * Warning: Function components cannot be given refs. 
 * Attempts to access this ref will fail.
 *  Did you mean to use React.forwardRef()?
 */