import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
  constructor(props) {
    super(props);
    //类的构建函数中唯一可以给this.state直接赋值 的地方
    this.state = { number: 0, name: 'counter' };
  }
  //需求 为了提高性能，减少更新的次数，我们可以把一个事件函数函数中的更新进行合并
  handleClick = (event) => {
    this.setState((state) => ({ number: state.number + 1 }));
    console.log(this.state.number);//0
    this.setState((state) => ({ number: state.number + 1 }));
    console.log(this.state.number);//0
    /*  setTimeout(() => {
       //console.log(this.state.number);//1
       this.setState({ number: this.state.number + 1 });
       console.log(this.state.number);//2
       this.setState({ number: this.state.number + 1 });
       console.log(this.state.number);//3
     }); */
  }
  render() {
    return (
      <div>
        <p>{this.state.name}</p>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}
ReactDOM.render(<Counter title="定时器" />, document.getElementById('root'));
//只有原生组件才有真实DOM，类组件和函数组件是没有，