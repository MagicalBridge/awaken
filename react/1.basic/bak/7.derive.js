
import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
  static defaultProps = {
    name: '珠峰架构'
  }
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
  }
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <ChildCounter count={this.state.number} />
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}
class ChildCounter extends React.Component {
  state = { count: 0 }
  static getDerivedStateFromProps(nextProps, nextState) {
    return { count: nextProps.count * 2 }
  }
  render() {
    return <div>{this.state.count}</div>
  }
}
ReactDOM.render(<Counter />, document.getElementById('root'));
