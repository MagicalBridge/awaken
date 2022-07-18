import React from './react';
import ReactDOM from './react-dom';
/* //核心原因是因为class是关键字
function FunctionComponent(props) {
  let renderVdom = <h1 className="title" style={{ color: 'red', backgroundColor: 'green' }}>
    {props.msg} < span > world</span >
  </h1 >
  return renderVdom;
}
FunctionComponent.isReactComponent=Symbol('react.component';
// span  Func
let element = <FunctionComponent msg="消息" age={12} />; 
//babel也会把这个JSX编译 成React.createElement(FunctionComponent,{msg:'消息',age:12});
*/
//以react hooks出现以前，要想实现类组件中内容的变化，是做不到的，要想定义状态并改变状态只能使用类组件
class ClassComponent extends React.Component {
  render() {
    let renderVdom = <h1 className="title" style={{ color: 'red', backgroundColor: 'green' }}>
      {this.props.msg} < span > world</span >
    </h1 >
    return renderVdom;
  }
}
let element = <ClassComponent msg="消息" age={12} />;
//babel也会把这个JSX编译 成React.createElement(ClassComponent,{msg:'消息',age:12});
console.log(element);
ReactDOM.render(element, document.getElementById('root'));