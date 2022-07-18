
import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
  static defaultProps = {
    name: '珠峰架构'
  }
  constructor(props) {
    super(props);
    this.state = { number: 0 };
    console.log('Counter 1.constructor');
  }
  UNSAFE_componentWillMount() {
    console.log('Counter 2.componentWillMount');
  }
  componentDidMount() {
    console.log('Counter 4.componentDidMount');
  }
  handleClick = () => {
    this.setState({ number: this.state.number + 1 })
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('Counter 5.shouldComponentUpdate');
    return nextState.number % 2 === 0;
  }
  UNSAFE_componentWillUpdate() {
    console.log('Counter 6.componentWillUpdate');
  }
  componentDidUpdate(newProps, newState) {
    console.log('Counter 7.componentDidUpdate');
  }
  render() {
    console.log('Counter 3.render');
    return (
      <div>
        <p>{this.state.number}</p>
        {this.state.number === 4 ? null : <ChildCounter count={this.state.number} />}
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}
class ChildCounter extends React.Component {
  UNSAFE_componentWillMount() {
    console.log('ChildCounter 1.componentWillMount');
  }
  componentDidMount() {
    console.log('ChildCounter 3.componentDidMount');
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    console.log('ChildCounter 4.UNSAFE_componentWillReceiveProps');
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('ChildCounter 5.shouldComponentUpdate');
    return nextProps.count % 3 === 0;
  }
  render() {
    console.log('ChildCounter 2.render ');
    return <div>{this.props.count}</div>
  }
  componentWillUnmount() {
    console.log('ChildCounter 6.componentWillUnmount ');
  }
}
ReactDOM.render(<Counter />, document.getElementById('root'));
/**
组件的生命周期
第一次
Counter 1.constructor
Counter 2.componentWillMount
Counter 3.render
ChildCounter 1.componentWillMount
ChildCounter 2.render 
ChildCounter 3.componentDidMount
Counter 4.componentDidMount

Counter 5.shouldComponentUpdate
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 4.UNSAFE_componentWillReceiveProps
ChildCounter 5.shouldComponentUpdate
Counter 7.componentDidUpdate
Counter 5.shouldComponentUpdate
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 6.componentWillUnmount 
Counter 7.componentDidUpdate
Counter 5.shouldComponentUpdate
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 1.componentWillMount
ChildCounter 2.render 
ChildCounter 3.componentDidMount
Counter 7.componentDidUpdate
 */