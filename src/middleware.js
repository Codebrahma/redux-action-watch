import defer from 'lodash.defer';
import { isImmutable } from './util';

const watcherMiddleware = reducerName => store => next => (action) => {
  const appState = store.getState();
  // check for immutable store
  const watcher = isImmutable(appState) ? appState.get(reducerName) : appState[reducerName];
  // check whether reducer has been setup or not.
  if (!watcher) {
    throw Error('Reducer has not configured');
  }
  const listeners = watcher[action.type] || [];
  // only call listner if it is function
  listeners.forEach(listener => (typeof listener === 'function' ? defer(listener, action) : null));
  return next(action);
};

// takes state/reducer name in redux store
export default (reducerName = 'watcher') => watcherMiddleware(reducerName);
