
import React from 'react';
import ReactDOM from 'react-dom';
const loading = message => OldComponent => {
  return class extends React.Component {
    render() {
      const state = {
        show: () => {
          console.log('show', message);
        },
        hide: () => {
          console.log('hide', message);
        }
      }
      return (
        <OldComponent {...this.props} {...state} />
      )
    }
  }
}

@loading('正在加载')
class Hello extends React.Component {
  render() {
    return (
      <div>
        Hello
        <button onClick={this.props.show}>show</button>
        <button onClick={this.props.hide}>hide</button>
      </div>
    )
  }
}
//const LoadingHello = loading('正在加载')(Hello);

ReactDOM.render(<Hello />, document.getElementById('root'));
