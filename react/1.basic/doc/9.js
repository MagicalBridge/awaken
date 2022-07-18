let hookStates = [];
let hookIndex = 0;
let scheduleUpdate;

function uState(initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initialState;
  const currentIndex = hookIndex;
  function setState(newState) {
    hookStates[currentIndex] = newState;
    scheduleUpdate();
  }
  return [hookStates[hookIndex++], setState];
}
uState('A');
let [state, setState] = uState('B');
uState('C');
setState('B1');
