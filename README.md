# redux-action-watch

[![Build Status](https://travis-ci.org/Codebrahma/redux-action-watch.svg?branch=master)](https://travis-ci.org/Codebrahma/redux-action-watch)
[![Coverage Status](https://coveralls.io/repos/github/Codebrahma/redux-action-watch/badge.svg?branch=master)](https://coveralls.io/github/Codebrahma/redux-action-watch?branch=master)

**`redux-action-watch` provides feature to listen action dispatched to redux.**

  - You can watch for a redux action dispatch.
  - Provides some helpers to register you own function as watcher like, `onAction`, `onActionOnce`, `subscribeActions`.
  - It can act as IPC (inter-process communication) b/w components.

> I don't think, we should only dispatch action to make changes in flux/redux state. Action can either change state or acknowledge that something happen. 


### Installation

You should install it as dependency:

```sh
$ npm install --save redux-action-watch
```

### Setup with redux
app.js / index.js
```javascript
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk'; // optional
import reducers from './reducers';
import actionWatchMiddlewaregenerator from 'redux-action-watch/lib/middleware';
import actionWatchReducer from 'redux-action-watch/lib/reducer';
// import { middleware, reducer } from 'redux-action-watch';

const initialState = {};
// Important! name redux-action-watch reducer in your redux.
const actionWatcherStateName = 'watcher';
const reducersWithActionWatchReducer = Object.assign({}, reducers, {
    [actionWatcherStateName]: actionWatchReducer,
});

// generate middleware
const actionWatchMiddleware = actionWatchMiddlewaregenerator(actionWatcherStateName);

const store = createStore(
  combineReducers(reducersWithActionWatchReducer),
  initialState,
  compose(
    /** configure middlewares with redux */
    applyMiddleware(actionWatchMiddleware, thunk),
    /** optional, redux dev tool */
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)
```

### How to use
**Container**
```javascript
import { connect } from 'react-redux';
import {
    onAction,   // takes a action and a listener.
    onActionOnce,   // takes a action and a listener, will called only once.
    subscribeActions,   // takes multiple actions and listners.
} from 'redux-action-watch/lib/actionCreators';

const mapPropsToDispatch = dispatch => ({
    // bind dispatch function
    subscribeActions: subscribeActions(dispatch),
    unsubscribeActions: unsubscribeActions(dispatch),
    onActionOnce: onActionOnce(dispatch),
});

export default connect(null, mapPropsToDispatch)(Component);
```

**Component**

```javascript
import React from 'react';
import { LOGIN_SUCCEEDED, LOGIN_FAILED } from './../actions';
import Notifier from './notifier';

class LoginForm extends React.Component {

    componentDidMount() {
        this.unsubscribe = this.props.onAction(LOGIN_FAILED, (action) => Notifier.show(action.error));
        /*
        --------------------------or---------------------------------
        this.watchMeta = {
            ACTION_A: fn1,
            ACTION_B: [fn2, fn3];
        };
        this.unsubscribe = this.props.subscribeAction(this.watchMeta);
        --------------------------or---------------------------------
        // if you want to auto unsubscribe after once call.
        this.props.onActionOnce(ACTION_A, callMeOnceFunction);
        */
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }
    
    render() {
        // Your code ........
    }

}
```

### Documentation
Note:- All functions should first call with `dispatch`

- `subscribeAction(dispatch)(listenersObj)`  
It can register watcher for more than one actions.  
**Argument**  
`listenersObj`: It should be an object where keys will be action `type` and value will be listener or array of listeners. Example: `{ ACTION_A: func1, ACTION_B: [func2, func3] }`.  
**Returns**  
`unsubscribeFunc`: It returns function. Which should invoke to unsubscribe those listeners.

- `unsubscribeAction(dispatch)(listenersObj)`  
It can un-subscribe actions which subscribe by `subscribeAction` function. It takes same `listenersObj` used at time of subscription.  
**Argument**  
`listenersObj`: Same as above.

- `onAction(dispatch)(actionType, listener)`  
It can register a watcher/listener for a action.  
**Arguments**  
`actionType`: Type/name of action. Example, `const action = { type: ACTION_A }`. Here `ACTION_A` is actionType.  
`listener`: Function which will be invoke on action dispatch.  
**Returns**  
`unsubscribeFunc`: It returns function. Which should invoke to unsubscribe that listener.  

- `onActionOnce(dispatch)(actionType, listener)`  
It can register a watcher/listener for a action. And it will automatically un-subscribe after once invoke.  
**Arguments**  
`actionType`: Type/name of action. Example, `const action = { type: ACTION_A }`. Here `ACTION_A` is actionType.  
`listener`: Function which will be invoke on action dispatch.  
**Returns**  
`unsubscribeFunc`: It returns function. You can unsubscribe without once invoke.

### Development

Want to contribute? Great!

- Clone this repo
- Make changes
- Run test case `npm run test`
- Create pull request

### Todos

 - Write example application

License
----

MIT
