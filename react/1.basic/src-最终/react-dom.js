import {
  REACT_TEXT, REACT_COMPONENT, REACT_FORWARD_REF,
  REACT_FRAGMENT, MOVE, PLACEMENT, REACT_CONTEXT, REACT_PROVIDER, REACT_MEMO
} from "./constants";
import { addEvent } from './event';
import { shallowEqual } from "./utils";
let hookStates = [];
let hookIndex = 0;
let scheduleUpdate;
/**
 * 把虚拟DOM变成真实DOM
 * 并且插入到父节点容器中
 * @param {*} vdom 
 * @param {*} container 
 */
function render(vdom, container) {
  mount(vdom, container)
  //调用它会从根节点重新进行DOM-DIFF
  //1.
  scheduleUpdate = () => {
    hookIndex = 0
    compareTwoVdom(container, vdom, vdom);
  }
}
export function useReducer(reducer, initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initialState;
  const currentIndex = hookIndex;
  function dispatch(action) {
    let oldState = hookStates[currentIndex];
    if (reducer) {
      let newState = reducer(oldState, action);
      hookStates[currentIndex] = newState
    } else {
      let newState = typeof action === 'function' ? action(oldState) : action
      hookStates[currentIndex] = newState
    }
    scheduleUpdate();
  }
  return [hookStates[hookIndex++], dispatch];
}
export function useState(initialState) {
  return useReducer(null, initialState);
}
export function useContext(context) {
  return context._currentValue;
}
export function useEffect(callback, deps) {
  const currentIndex = hookIndex;
  if (hookStates[hookIndex]) {
    let [destroy, lastDeps] = hookStates[hookIndex];
    let same = deps && deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++
    } else {
      destroy && destroy();
      setTimeout(() => {
        const destroy = callback();
        hookStates[currentIndex] = [destroy, deps]
      });
      hookIndex++;
    }
  } else {
    //开启一个新的宏任务
    setTimeout(() => {
      const destroy = callback();
      hookStates[currentIndex] = [destroy, deps]
    });
    hookIndex++;
  }
}
export function useLayoutEffect(callback, deps) {
  const currentIndex = hookIndex;
  if (hookStates[hookIndex]) {
    let [destroy, lastDeps] = hookStates[hookIndex];
    let same = deps && deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++
    } else {
      destroy && destroy();
      queueMicrotask(() => {
        const destroy = callback();
        hookStates[currentIndex] = [destroy, deps]
      });
      hookIndex++;
    }
  } else {
    //开启一个新的宏任务
    queueMicrotask(() => {
      const destroy = callback();
      hookStates[currentIndex] = [destroy, deps]
    });
    hookIndex++;
  }
}
export function useRef() {
  hookStates[hookIndex] = hookStates[hookIndex] || { current: null };
  return hookStates[hookIndex++]
}
export function useImperativeHandle(ref, factory) {
  ref.current = factory();
}
/* export function useState(initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initialState;
  const currentIndex = hookIndex;
  function setState(newState) {
    hookStates[currentIndex] = newState;
    scheduleUpdate();
  }
  return [hookStates[hookIndex++], setState];
} */
export function useMemo(factory, deps) {
  if (hookStates[hookIndex]) {
    let [lastMemoObj, lastDeps] = hookStates[hookIndex];
    let same = deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
      return lastMemoObj;
    } else {
      let newMemoObj = factory();
      hookStates[hookIndex++] = [newMemoObj, deps];
      return newMemoObj;
    }
  } else {
    let newMemoObj = factory();
    hookStates[hookIndex++] = [newMemoObj, deps];
    return newMemoObj;
  }
}
export function useCallback(callback, deps) {
  if (hookStates[hookIndex]) {
    let [lastCallback, lastDeps] = hookStates[hookIndex];
    let same = deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
      return lastCallback;
    } else {
      hookStates[hookIndex++] = [callback, deps];
      return callback;
    }
  } else {
    hookStates[hookIndex++] = [callback, deps];
    return callback;
  }
}
function mount(vdom, container) {
  //把虚拟DOM变成真实DOM
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
  if (newDOM.componentDidMount) {
    newDOM.componentDidMount();
  }
}
function createDOM(vdom) {
  let { type, props, ref } = vdom;
  //根据不同的虚拟DOM的类型创建真实的DOM
  let dom;
  if (type && type.$$typeof === REACT_MEMO) {
    return mountMemoComponent(vdom);
  } else if (type && type.$$typeof === REACT_PROVIDER) {
    return mountProviderComponent(vdom);
  } else if (type && type.$$typeof === REACT_CONTEXT) {
    return mountContextComponent(vdom);
  } else if (type && type.$$typeof === REACT_FORWARD_REF) {
    return mountForwardComponent(vdom);
  } else if (type === REACT_TEXT) {
    dom = document.createTextNode(props);
  } else if (type === REACT_FRAGMENT) {
    dom = document.createDocumentFragment();
  } else if (typeof type === 'function') {
    if (type.isReactComponent === REACT_COMPONENT) {
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {
    dom = document.createElement(type);
  }
  if (typeof props === 'object') {
    updateProps(dom, {}, props);
    if (props.children && typeof props.children === 'object' && props.children.$$typeof) {
      props.children.mountIndex = 0;
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }
  //当我们根据虚拟DOM创建好真实DOM之后,vdom.dom = dom
  vdom.dom = dom;
  if (ref) ref.current = dom;
  return dom;
}
function mountMemoComponent(vdom) {
  //vdom = <MemoFunctionCounter count={this.state.number} />
  //vdom= {type:MemoFunctionCounter}={type:{ $$typeof: REACT_MEMO,type}}
  let { type: { functionComponent }, props } = vdom;
  vdom.prevProps = props;
  let renderVdom = functionComponent(props);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}
/**
 * 1.把属性中的值存放到context._currentValue上
 * 2.渲染它的子节点
 * @param {*} vdom 
 */
function mountProviderComponent(vdom) {
  let { type, props } = vdom;
  let context = type._context;//Provider._context
  context._currentValue = props.value;//Provider是赋值
  let renderVdom = props.children;
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

function mountContextComponent(vdom) {
  let { type, props } = vdom;
  let context = type._context;//Consumer._context
  let renderVdom = props.children(context._currentValue);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}
function mountForwardComponent(vdom) {
  let { type, props, ref } = vdom;
  let renderVdom = type.render(props, ref);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}
function mountClassComponent(vdom) {
  let { type: ClassComponent, props, ref } = vdom;
  //创建类组件的实例
  let classInstance = new ClassComponent(props);
  if (ClassComponent.contextType) {
    classInstance.context = ClassComponent.contextType._currentValue;
  }
  vdom.classInstance = classInstance;
  //组件将要挂载 
  if (classInstance.UNSAFE_componentWillMount) {
    classInstance.UNSAFE_componentWillMount();
  }
  if (ref) ref.current = classInstance;
  let renderVdom = classInstance.render();
  //把类组件渲染的虚拟DOM放到类的实例上
  classInstance.oldRenderVdom = renderVdom;
  let dom = createDOM(renderVdom);
  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
  }
  return dom;
}
function mountFunctionComponent(vdom) {
  let { type: FunctionComponent, props } = vdom;
  let renderVdom = FunctionComponent(props);
  //把函数组件渲染的虚拟DOM放在了函数组件自己的虚拟DOM上
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}
function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    childrenVdom[i].mountIndex = i;
    mount(childrenVdom[i], parentDOM);
  }
}
/**
 * 根据虚拟DOM获取真实DOM
 * @param {*} vdom 虚拟DOM
 */
export function findDOM(vdom) {
  if (!vdom) return null;
  if (vdom.dom) {//指的是原生组件的情况
    return vdom.dom;
  } else {
    if (vdom.classInstance) {//说明是类组件
      vdom = vdom.classInstance.oldRenderVdom;
    } else {//说明函数组件
      vdom = vdom.oldRenderVdom;
    }
    return findDOM(vdom);
  }
}
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
  if (!oldVdom && !newVdom) {
    return;
    //如果老节点存在，新节点不存在，需要直接 删除老节点就可以了
  } else if (oldVdom && !newVdom) {
    unMountVdom(oldVdom);
  } else if (!oldVdom && newVdom) {
    let newDOM = createDOM(newVdom);
    if (nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM);//BUG
    }
    if (newDOM.componentDidMount) {
      newDOM.componentDidMount();
    }
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    unMountVdom(oldVdom);
    let newDOM = createDOM(newVdom);
    if (nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM);//BUG
    }
    if (newDOM.componentDidMount) {
      newDOM.componentDidMount();
    }
  } else {
    //如果老节点有值，并且新节点有值，并且类型相同
    updateElement(parentDOM, oldVdom, newVdom);
  }
}
/**
 * 对新老虚拟DOM节点进行深度对比
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateElement(parentDOM, oldVdom, newVdom) {
  if (oldVdom.type.$$typeof === REACT_MEMO) {
    updateMemoComponent(oldVdom, newVdom);
  } else if (oldVdom.type.$$typeof === REACT_CONTEXT) {
    updateContextComponent(oldVdom, newVdom);
  } else if (oldVdom.type.$$typeof === REACT_PROVIDER) {
    updateProviderComponent(oldVdom, newVdom);
  } else if (oldVdom.type === REACT_TEXT) {
    let currentDOM = newVdom.dom = findDOM(oldVdom);
    if (oldVdom.props !== newVdom.props) {
      currentDOM.textContent = newVdom.props;
    }
  } else if (typeof oldVdom.type === 'string') {//div
    let currentDOM = newVdom.dom = findDOM(oldVdom);
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (oldVdom.type === REACT_FRAGMENT) {
    let currentDOM = newVdom.dom = findDOM(oldVdom);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === 'function') {//类组件和函数组件
    if (oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom);
    } else {
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}
function updateMemoComponent(oldVdom, newVdom) {
  let { type: { compare }, prevProps } = oldVdom;
  compare = compare || shallowEqual
  //属性相等，不用更新了
  if (compare(prevProps, newVdom.props)) {
    newVdom.prevProps = prevProps;
    newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
    //属性不等，就得更新了   
  } else {
    let oldDOM = findDOM(oldVdom);
    let { type: { functionComponent }, props } = newVdom;
    let renderVdom = functionComponent(props);
    compareTwoVdom(oldDOM.parentNode, oldVdom.oldRenderVdom, renderVdom)
    newVdom.prevProps = props;
    newVdom.oldRenderVdom = renderVdom;
  }
}
function updateProviderComponent(oldVdom, newVdom) {
  let currentDOM = findDOM(oldVdom);
  let parentDOM = currentDOM.parentNode;
  let { type, props } = newVdom;
  let context = type._context;
  context._currentValue = props.value;
  let renderVdom = props.children;
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}
function updateContextComponent(oldVdom, newVdom) {
  let currentDOM = findDOM(oldVdom);
  let parentDOM = currentDOM.parentNode;
  let { type, props } = newVdom;
  let context = type._context;
  let newRenderVdom = props.children(context._currentValue);
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
  newVdom.oldRenderVdom = newRenderVdom;
}
function updateFunctionComponent(oldVdom, newVdom) {
  let currentDOM = findDOM(oldVdom);
  if (!currentDOM) return;
  let { type, props } = newVdom;
  let newRenderVdom = type(props);
  compareTwoVdom(currentDOM.parentNode, oldVdom.oldRenderVdom, newRenderVdom);
  newVdom.oldRenderVdom = newRenderVdom;
}
function updateClassComponent(oldVdom, newVdom) {
  const classInstance = newVdom.classInstance = oldVdom.classInstance;
  if (classInstance.UNSAFE_componentWillReceiveProps) {
    classInstance.UNSAFE_componentWillReceiveProps();
  }
  classInstance.updater.emitUpdate(newVdom.props);
}
/**
 * 更新子节点
 * @param {*} parentDOM 父真实DOM
 * @param {*} oldVChildren 老儿子虚拟DOM数组
 * @param {*} newVChildren 新儿子虚拟DOM数组
 */
function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = (Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren]).filter(item => typeof item !== 'undefined' && item !== null);
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren].filter(item => typeof item !== 'undefined' && item !== null);
  //1.构建一个map
  const keyedOldMap = {};
  let lastPlacedIndex = 0;
  oldVChildren.forEach((oldVChild, index) => {
    let oldKey = oldVChild.key ? oldVChild.key : index;
    keyedOldMap[oldKey] = oldVChild;
  });
  //创建一个DOM补丁包，收集DOM操作
  const patch = [];

  newVChildren.forEach((newVChild, index) => {
    newVChild.mountIndex = index;
    const newKey = newVChild.key ? newVChild.key : index;
    let oldVChild = keyedOldMap[newKey];
    if (oldVChild) {
      updateElement(findDOM(oldVChild).parentNode, oldVChild, newVChild);
      if (oldVChild.mountIndex < lastPlacedIndex) {
        patch.push({
          type: MOVE,
          oldVChild,
          newVChild,
          mountIndex: index
        });
      }
      //如果一个老节点被复用了，就可以从map中删除
      delete keyedOldMap[newKey];
      lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild.mountIndex);
    } else {
      patch.push({
        type: PLACEMENT,
        newVChild,
        mountIndex: index
      });
    }
  });
  //过滤出来补丁包里需要移动的老节点
  let moveVChildren = patch.filter(action => action.type === MOVE).map(action => action.oldVChild);
  //先把那些要移动的和要删除节点先全部删除
  Object.values(keyedOldMap).concat(moveVChildren).forEach(oldVChild => {
    let currentDOM = findDOM(oldVChild);
    currentDOM.remove();//老的真实DOM B
  });
  patch.forEach(action => {
    let { type, oldVChild, newVChild, mountIndex } = action;
    //老的真实子DOM节点集合
    let childNodes = parentDOM.childNodes;
    if (type === PLACEMENT) {
      let newDOM = createDOM(newVChild);
      let childNode = childNodes[mountIndex];
      if (childNode) {
        parentDOM.insertBefore(newDOM, childNode);
      } else {
        parentDOM.appendChild(newDOM);
      }
    } else if (type === MOVE) {
      let oldDOM = findDOM(oldVChild);
      let childNode = childNodes[mountIndex];
      if (childNode) {
        parentDOM.insertBefore(oldDOM, childNode);
      } else {
        parentDOM.appendChild(oldDOM);
      }
    }

  });
  /*  const maxLength = Math.max(oldVChildren.length, newVChildren.length);
   for (let i = 0; i < maxLength; i++) {
     let nextVdom = oldVChildren.find((item, index) => index > i && item && findDOM(item))
     compareTwoVdom( parentDOM, oldVChildren[i], newVChildren[i], findDOM(nextVdom));
   } */
}
/**
 * 删除或者说卸载老节点
 * @param {*} vdom 
 */
function unMountVdom(vdom) {
  let { props, ref, classInstance } = vdom;
  let currentDOM = findDOM(vdom);
  if (classInstance && classInstance.UNSAFE_componentWillMount) {
    classInstance.UNSAFE_componentWillMount();
  }
  if (ref) {
    ref.current = null;
  }
  if (props.children) {
    let children = (Array.isArray(props.children) ? props.children : [props.children]).filter(item => typeof item !== 'undefined' && item !== null);
    children.forEach(unMountVdom);
  }
  if (currentDOM) currentDOM.remove();
}
/**
 * 把新的属性同步到真实DOM上
 * @param {*} dom 
 * @param {*} oldProps 
 * @param {*} newProps 
 */
function updateProps(dom, oldProps = {}, newProps = {}) {
  //处理新增和修改属性
  for (const key in newProps) {// style={} className id
    if (key === 'children') {
      continue;//儿子属性会单独处理，并不会在此处理
    } else if (key === 'style') {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (/^on[A-Z].*/.test(key)) {
      //dom[key.toLowerCase()] = newProps[key];
      addEvent(dom, key.toLowerCase(), newProps[key]);
    } else {
      //id className
      dom[key] = newProps[key]
    }
  }
  //处理删除属性
  for (const key in oldProps) {
    if (!newProps.hasOwnProperty(key)) {
      delete dom[key];
    }
  }
}
const ReactDOM = {
  render,
  createPortal: render
}
export default ReactDOM;