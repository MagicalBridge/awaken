
import React from './react';
import ReactDOM from './react-dom';
function Counter() {
  const [number, setNumber] = React.useState(0);
  //useEffect需要要传递一个函数，此函数会在DOM渲染完成后执行
  React.useEffect(() => {
    console.log('开启一个新的定时器');
    const timer = setInterval(() => {
      setNumber(number => number + 1);
    }, 1000);
    return () => {
      console.log('销毁上一个定时器');
      clearInterval(timer);
    }
  }, []);//useEffect里的函数只有在依赖的数组的值发生改变的话才会重新执行，因为它是空数组，所以永远不可能改变，所以只会执行一次
  return (
    <p>{number}</p>
  )
}
ReactDOM.render(<Counter />, document.getElementById('root'));
