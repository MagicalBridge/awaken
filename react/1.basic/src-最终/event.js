import { updateQueue } from './Component';
/**
 * 给DOM元素绑定合成事件，在合成事件处理函数中调用我们用户自己写的处理函数
 * @param {*} dom 真实DOM
 * @param {*} eventType 事件类型 onclick
 * @param {*} handler  用户自定义的处理函数
 */
export function addEvent(dom, eventType, handler) {
  //读取dom._store_,一般来说肯定 是没有用
  let store = dom._store_ || (dom._store_ = {});
  //store.onclick= handleClick
  store[eventType] = handler;
  if (!document[eventType]) {
    //document.onclick = dispatchEvent
    document[eventType] = dispatchEvent;
  }
}
/**
 * 委托给document文档对象的处理函数
 * @param {*} event 原生的事件对象
 */
function dispatchEvent(event) {
  //事件名称 click 和事件源，就是你点的谁
  const { type, target } = event;
  const eventType = `on${type}`;//onclick
  //在方法执行前把这个isBatchingUpdate设置为true
  updateQueue.isBatchingUpdate = true;
  let syntheticEvent = createSyntheticEvent(event);
  let currentTarget = target;
  //模拟的事件冒泡的过程
  while (currentTarget) {
    //分清楚 target 和 currentTarget
    syntheticEvent.currentTarget = currentTarget;
    let { _store_ } = currentTarget;
    let handler = _store_ && _store_[eventType];
    //handler拿 到的事件对象不是原生的事件而是React提供的合成事件对象1.可以处理兼容性
    handler && handler(syntheticEvent);
    if (syntheticEvent.isPropagationStopped) {
      break;
    }
    currentTarget = currentTarget.parentNode;
  }
  //在方法结束后进行批量更新
  updateQueue.batchUpdate();
}
function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {};
  for (let key in nativeEvent) {
    let value = nativeEvent[key];
    if (typeof value === 'function')
      value = value.bind(nativeEvent);
    syntheticEvent[key] = value;
  }
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.isPropagationStopped = false;//是否已经阻止了冒泡
  syntheticEvent.isDefaultPrevented = false;//是否已经阻止了默认事件
  syntheticEvent.preventDefault = preventDefault;
  syntheticEvent.stopPropagation = stopPropagation;
  return syntheticEvent;
}
function preventDefault() {
  this.isDefaultPrevented = true;
  let event = this.nativeEvent;
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}
function stopPropagation() {
  this.isPropagationStopped = true;
  let event = this.nativeEvent;
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = false;
  }
}