// package's action namespace
export const actionNamespace = '@ACTION_WATCHER';

// Actions
export const SUBSCRIBE_ACTIONS = `${actionNamespace}/ADD`;
export const UNSUBSCRIBE_ACTIONS = `${actionNamespace}/REMOVE`;

/**
 * Un-subscribes/remove listeners
 *
 * @example
 *        unsubscribeActions(dispatch)({
 *          ACTION_A: listenerFn1,
 *          ACTION_B: [listenerFn2, listenerFn3],
 *        })
 *
 * @param      {Function}  dispatch  Redux dispatch function
 * @return     {Function}    Action creator to dispatch subcribe action object to redux
 */
export const unsubscribeActions = dispatch => listenersObj => dispatch({ type: UNSUBSCRIBE_ACTIONS, listenersObj });
/**
 * Subscribes/add listener for redux action dispatch
 *
 * @example
 *        const unsubscribe = subscribeActions(dispatch)({
 *          ACTION_A: listenerFn1,
 *          ACTION_B: [listenerFn2, listenerFn3],
 *        })
 *
 *        unsubscribe();  // un-subscribe
 *
 * @param      {Function}  dispatch  Redux dispatch function
 * @return     {Function}    Action creator to dispatch un-subcribe action object to redux
 */
export const subscribeActions = dispatch => (listenersObj) => {
  dispatch({ type: SUBSCRIBE_ACTIONS, listenersObj });
  return () => unsubscribeActions(dispatch)(listenersObj);
};

/**
 * Alise of subscritionActions function, but accept one listner.
 *
 * @example
 *        const unsubscribe = onAction(dispatch)('ACTION_A', actionObj => {console.log(actionObj)})
 *
 *        unsubscribe();  // un-subscribe
 *
 * @param      {Function}  dispatch  Redux dispatch function
 * @return     {Function}  Action creator to dispatch subcribe action object to redux
 */
export const onAction = dispatch => (action, listener) => subscribeActions(dispatch)({ [action]: listener });

/**
 * Alise of subscritionActions function, but accept one listner at a time and automatically unsubcribe
 * after one call.
 *
 * @example
 *        onActionOnce(dispatch)('ACTION_A', actionObj => {console.log(actionObj)})
 *
 * @param      {Function}  dispatch  Redux dispatch function
 * @return     {Function}  Action creator to dispatch subcribe action object to redux
 */
export const onActionOnce = dispatch => (actionType, listener) => {
  let unsubscribe = null;
  const wrapListener = (actionMeta) => {
    if (unsubscribe) {
      // un-subscribe behalf of coder.
      unsubscribe();
    }
    listener(actionMeta);
  };
  unsubscribe = subscribeActions(dispatch)({ [actionType]: wrapListener });
  // return unsubscribe fn to support termination without any call.
  return unsubscribe;
};

export default {
  subscribeActions,
  unsubscribeActions,
  onAction,
  onActionOnce,
};
