
import React from './react';
import ReactDOM from './react-dom';
//对话框 它不应该直接渲染到root 里
class Dialog extends React.Component {
  constructor() {
    super();
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  }
  componentWillUnmount() {
    this.container.remove();
  }
  render() {
    return ReactDOM.createPortal(<div>Dialog</div>, this.container)
  }

}
class App extends React.Component {
  render() {
    return (
      <div>
        <Dialog />
      </div>
    )
  }
}
ReactDOM.render(<App />, document.getElementById('root'));
