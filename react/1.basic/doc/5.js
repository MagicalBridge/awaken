function Func(props, forwardRef) {
  return <div ref={forwardRef}>Func</div>
}
//const ForwardFunc = forwardRef(Func);

/* const ForwardFunc = {
  $$typeof: REACT_FORWARD_REF,
  render: Func
} */
this.func = { current: null }
//< ForwardFunc ref = { this.func } />
//let vdom = React.createElement(ForwardFunc, { ref: this.func });  
/* let vdom = {
  type: ForwardFunc,
  props: {},
  ref: this.func
} */
