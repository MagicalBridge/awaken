import {
  REACT_ELEMENT, REACT_FORWARD_REF, REACT_FRAGMENT,
  REACT_PROVIDER, REACT_CONTEXT, REACT_MEMO
} from './constants';
import { toVdom, shallowEqual } from './utils';
import { Component } from './Component'
//import { useState, useMemo, useCallback } from './react-dom'
import * as hooks from './react-dom';
/**
 * 创建一个元素，也就是所谓的虚拟DOM
 * @param {*} type 
 * @param {*} config 
 * @param {*} children 
 */
function createElement(type, config, children) {
  let ref;
  let key;

  if (config) {
    ref = config.ref;//通过它可以获取此真实DOM元素
    key = config.key;//后面会用于DOMDIFF移动元素的处理
    delete config.__source;
    delete config.__self;
    delete config.ref;
    delete config.key;
  }
  let props = {
    ...config
  };
  /* if (children.length === 1) {
    props.children = toVdom(children[0]);
  } else if (children.length > 1) {
    props.children = children.map(toVdom)
  } */
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(toVdom);
  } else if (arguments.length === 3) {
    props.children = toVdom(children);
  }
  return {
    $$typeof: REACT_ELEMENT,
    type,
    props,
    ref,
    key
  }
}
function createRef() {
  return { current: null };
}
function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render
  }
}
function createContext() {
  const context = {
    $$typeof: REACT_CONTEXT,
    _currentValue: undefined
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context
  }
  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context
  }
  return context;
}
function cloneElement(element, newProps, ...newChildren) {
  let oldChildren = element.props && element.props.children;
  let children = [...(Array.isArray(oldChildren) ? oldChildren : [oldChildren]), ...newChildren]
    .filter(item => item !== undefined && item !== null).map(toVdom)
  if (children.length === 1) children = children[0];
  let props = { ...element.props, ...newProps, children };
  return {
    ...element, props
  };
}
//shallowEqual
class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
  }
}
function memo(functionComponent, compare = null) {
  return {
    $$typeof: REACT_MEMO,
    compare,
    functionComponent
  }
}
const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  Fragment: REACT_FRAGMENT,
  createContext,
  cloneElement,
  PureComponent,
  memo,
  ...hooks
}
export default React;