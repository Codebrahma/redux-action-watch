import { expect, assert } from 'chai';  // eslint-disable-line import/no-extraneous-dependencies
import { stub, spy } from 'sinon';  // eslint-disable-line import/no-extraneous-dependencies
import middleware from '../src/middleware';

describe('Checking middleware.', () => {
  describe('Checking middleware setup.', () => {
    it('should test to throw error on no reducer setup', () => {
      const stubGetState = stub();
      stubGetState.onCall(0).returns({});
      const store = { getState: stubGetState };
      const spyNextFn = spy();
      const action = { type: 'ACTION_A' };
      const setupedMiddleware = middleware('watcher');
      expect(setupedMiddleware(store)(spyNextFn).bind(null, action))
        .to
        .throw('Reducer has not configured');
    });
  });

  it('should test middleware behaviour', () => {
    const stubGetState = stub();
    const callback = () => (true);
    stubGetState.onCall(0).returns({
      watcher: {
        ACTION_A: [callback, undefined, 4, 'string'],  // test with non-func also
      },
    });
    const store = { getState: stubGetState };
    const spyNextFn = spy();
    const action = { type: 'ACTION_A' };
    const setupedMiddleware = middleware('watcher');
    setupedMiddleware(store)(spyNextFn)(action);
    assert(spyNextFn.calledOnce, 'Middleware is not able to call next fn');
    assert(spyNextFn.calledWith(action), 'Middleware is not able to call next with action object');
  });
});
