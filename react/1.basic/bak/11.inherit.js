
import React from './react';
import ReactDOM from './react-dom';
//假如说个Button组件，是一个第三方的组件库里的组件
class Button extends React.Component {
  state = { name: '张三' }
  componentDidMount() {
    console.log(`Button componentDidMount`);
  }
  render() {
    console.log('Button render');
    return <button name={this.state.name} title={this.props.title}><span>Button:</span></button>
  }
}
const wrapper = OldComponent => {
  return class NewComponent extends OldComponent {
    state = { number: 0 }
    componentDidMount() {
      console.log(`wrapper componentDidMount`);
      super.componentDidMount();
    }
    handleClick = () => {
      this.setState({ number: this.state.number + 1 });
    }
    render() {
      console.log('wrapper render');
      let renderElement = super.render();
      let newProps = {
        ...renderElement.props,
        ...this.state,
        onClick: this.handleClick
      }
      return React.cloneElement(renderElement, newProps, this.state.number);
    }
  }
}
const WrappedButton = wrapper(Button);

ReactDOM.render(<WrappedButton />, document.getElementById('root'));
