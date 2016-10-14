import { assert } from 'chai';  // eslint-disable-line import/no-extraneous-dependencies
import { spy } from 'sinon';  // eslint-disable-line import/no-extraneous-dependencies
import {
  actionNamespace,
  SUBSCRIBE_ACTIONS,
  UNSUBSCRIBE_ACTIONS,
  subscribeActions,
  unsubscribeActions,
  onAction,
  onActionOnce,
} from '../src/actionCreators';

describe('Checking variables.', () => {
  it('should test value of `actionNamespace`', () => {
    assert(actionNamespace === '@ACTION_WATCHER', 'Action namespace value has changed :(');
  });

  it('should test value of `SUBSCRIBE_ACTIONS`', () => {
    assert(SUBSCRIBE_ACTIONS === `${actionNamespace}/ADD`, 'SUBSCRIBE_ACTIONS\'s value has changed :(');
  });

  it('should test value of `UNSUBSCRIBE_ACTIONS`', () => {
    assert(UNSUBSCRIBE_ACTIONS === `${actionNamespace}/REMOVE`, 'UNSUBSCRIBE_ACTIONS\'s value has changed :(');
  });
});

describe('Checking action creators.', () => {
  let proxyDispatch;
  before(() => {
    proxyDispatch = spy();
  });
  beforeEach(() => {
    proxyDispatch.reset();
  });
  describe('Checking `subscribeActions`', () => {
    it('should test `subscribeActions` behaviour', () => {
      const listenerObj = {
        ACTION_A: () => true,
      };
      const unsubscribe = subscribeActions(proxyDispatch)(listenerObj);
      assert(proxyDispatch.calledOnce, 'call once failed');
      assert(proxyDispatch.calledWithMatch({
        type: SUBSCRIBE_ACTIONS,
        listenersObj: listenerObj,
      }), 'Call with mismatched');
      proxyDispatch.reset();
      unsubscribe();
      assert(proxyDispatch.calledOnce, 'call once failed');
      assert(proxyDispatch.calledWithMatch({
        type: UNSUBSCRIBE_ACTIONS,
        listenersObj: listenerObj,
      }), 'Call with mismatched');
    });
  });

  describe('Checking `unsubscribeActions`', () => {
    it('should test `unsubscribeActions` behaviour', () => {
      const listenerObj = {
        ACTION_A: () => true,
      };
      unsubscribeActions(proxyDispatch)(listenerObj);
      assert(proxyDispatch.calledOnce, 'call once failed');
      assert(proxyDispatch.calledWithMatch({
        type: UNSUBSCRIBE_ACTIONS,
        listenersObj: listenerObj,
      }), 'Call with mismatched');
    });
  });

  describe('Checking `onAction`', () => {
    it('should test `onAction` behaviour', () => {
      const listener = () => true;
      const action = 'ACTION_A';
      const unsubscribe = onAction(proxyDispatch)(action, listener);
      assert(proxyDispatch.calledOnce, 'call once failed');
      assert(proxyDispatch.calledWithMatch({
        type: SUBSCRIBE_ACTIONS,
        listenersObj: { [action]: listener },
      }), 'Call with mismatched');
      proxyDispatch.reset();
      unsubscribe();
      assert(proxyDispatch.calledOnce, 'call once failed');
      assert(proxyDispatch.calledWithMatch({
        type: UNSUBSCRIBE_ACTIONS,
        listenersObj: { [action]: listener },
      }), 'Call with mismatched');
    });
  });

  describe('Checking `onActionOnce`', () => {
    it('should test `onActionOnce` behaviour', () => {
      const listener = spy();
      const action = 'ACTION_A';
      onActionOnce(proxyDispatch)(action, listener);
      assert(proxyDispatch.calledOnce, 'call once failed');
      const wrapedListener = proxyDispatch.args[0][0].listenersObj[action];
      assert(proxyDispatch.calledWith({
        type: SUBSCRIBE_ACTIONS,
        listenersObj: { [action]: wrapedListener },
      }), 'Call with mismatched');
      proxyDispatch.reset();
      wrapedListener('abc');
      assert(listener.calledOnce, 'call once failed');
      assert(listener.calledWithMatch('abc'), 'call once failed');
      assert(proxyDispatch.calledWith({
        type: UNSUBSCRIBE_ACTIONS,
        listenersObj: { [action]: wrapedListener },
      }), 'Call with mismatched');
    });
  });
});
