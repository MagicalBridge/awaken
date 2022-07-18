
import React from './react';
import ReactDOM from './react-dom';
//PureComponent非常单纯的组件 属性或状态如果变化就重新更新，如果属性和状态没有改变就不更新
class ClassCounter extends React.PureComponent {
  render() {
    console.log('ClassCounter render');
    return <div>ClassCounter:{this.props.count}</div>
  }
}
function FunctionCounter(props) {
  console.log('FunctionCounter render');
  return <div>FunctionCounter:{props.count}</div>
}
const MemoFunctionCounter = React.memo(FunctionCounter);
console.log(MemoFunctionCounter);
class App extends React.Component {
  state = { number: 0 }
  amountRef = React.createRef()
  handleClick = () => {
    let nextNumber = this.state.number + parseInt(this.amountRef.current.value);
    this.setState({ number: nextNumber });
  }
  render() {
    return (
      <div>
        <ClassCounter count={this.state.number} />
        <MemoFunctionCounter count={this.state.number} />
        <input ref={this.amountRef} defaultValue={1}></input>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}
ReactDOM.render(<App />, document.getElementById('root'));
/**
 * 
let MemoFunctionCounter = {
  $$typeof: Symbol(react.memo)
  compare: shallowEqual
  type: ƒ FunctionCounter(props)
}
 */