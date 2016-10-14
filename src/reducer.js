import forEach from 'lodash.foreach';
import { actionNamespace, SUBSCRIBE_ACTIONS, UNSUBSCRIBE_ACTIONS } from './actionCreators';

// helper function to convert listners object to acceptable object
export const formatListenerObj = (listenersObj) => {
  const formated = {};
  forEach(listenersObj, (listener, action) => (formated[action] = (listener instanceof Array ? listener : [listener])));

  return formated;
};

export default (state = {}, { type, listenersObj }) => {
  // ignore if action object is not relievent.
  if (!(new RegExp(actionNamespace)).test(type) || typeof listenersObj !== 'object') {
    return state;
  }

  // clone the state
  const newState = Object.assign({}, state);
  // parse the listenersObj
  const formattedListenerObj = formatListenerObj(listenersObj);
  // Check for subcribe or un-subscribe action
  switch (type) {
    case SUBSCRIBE_ACTIONS: {
      // Add listners
      forEach(formattedListenerObj, (listeners, actionType) => {
        newState[actionType] = newState[actionType] ? newState[actionType].concat(listeners) : listeners;
      });
      return newState;
    }
    case UNSUBSCRIBE_ACTIONS: {
      // remove listeners
      forEach(formattedListenerObj, (listeners, actionType) => {
        if (!newState[actionType]) {
          return;
        }
        forEach(listeners, (listener) => {
          const index = newState[actionType].indexOf(listener);
          newState[actionType].splice(index, 1);
        });
      });
      return newState;
    }
    default: {
      return state;
    }
  }
};
