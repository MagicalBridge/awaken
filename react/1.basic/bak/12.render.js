
import React from 'react';
import ReactDOM from 'react-dom';

function withMouseTracker(OldComponent) {
  return class MouseTracker extends React.Component {
    constructor(props) {
      super(props);
      this.state = { x: 0, y: 0 };
    }
    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY
      });
    }
    render() {
      return (
        <div onMouseMove={this.handleMouseMove}>
          <OldComponent {...this.state} />
        </div>
      )
    }
  }
}
function Show(props) {
  return (
    <React.Fragment>
      <h1>移动鼠标</h1>
      <p>当前的鼠标位置{props.x}: {props.y}</p>
    </React.Fragment>
  )
}
const MouseTrackerShow = withMouseTracker(Show);

ReactDOM.render(<MouseTrackerShow />, document.getElementById('root'));
