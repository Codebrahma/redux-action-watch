import { expect } from 'chai';  // eslint-disable-line import/no-extraneous-dependencies
import reducer from '../src/reducer';
import { SUBSCRIBE_ACTIONS, UNSUBSCRIBE_ACTIONS } from '../src/actionCreators';

describe('Checking reducer.', () => {
  const listenerA = () => (true);
  const listenerA1 = () => (true);
  const listenerA2 = () => (true);
  const listenerB = () => (true);
  const listenerC = () => (true);
  const listenerC1 = () => (true);

  it('should test reducer behaviour, if subcribe for actions', () => {
    const currentState = {};
    const resultState = {
      ACTION_A: [listenerA, listenerA1, listenerA2],
      ACTION_B: [listenerB],
      ACTION_C: [listenerC],
    };
    const resultState2 = Object.assign({}, resultState, {
      ACTION_C: [listenerC, listenerC1],
    });

    const newState = reducer(currentState, {
      type: SUBSCRIBE_ACTIONS,
      listenersObj: {
        ACTION_A: [listenerA, listenerA1, listenerA2],
        ACTION_B: [listenerB],
        ACTION_C: [listenerC],
      },
    });
    const newState2 = reducer(newState, {
      type: SUBSCRIBE_ACTIONS,
      listenersObj: {
        ACTION_C: listenerC1,
      },
    });

    expect(newState).to.deep.equal(resultState);
    expect(newState2).to.deep.equal(resultState2);
  });

  it('should test reducer behaviour, if un-subcribe for actions', () => {
    const currentState = {
      ACTION_A: [listenerA, listenerA1, listenerA2],
      ACTION_B: [listenerB],
      ACTION_C: [listenerC, listenerC1],
    };
    const resultState = {
      ACTION_A: [listenerA, listenerA2],
      ACTION_B: [],
      ACTION_C: [listenerC, listenerC1],
    };

    const newState = reducer(currentState, {
      type: UNSUBSCRIBE_ACTIONS,
      listenersObj: {
        ACTION_A: listenerA1,
        ACTION_B: [listenerB],
      },
    });

    expect(newState).to.deep.equal(resultState);
  });

  it('should test reducer behaviour, applies immutable state changes', () => {
    const currentState = {
      ACTION_A: [listenerA, listenerA1, listenerA2],
      ACTION_B: [listenerB],
      ACTION_C: [listenerC],
    };
    const resultState = {
      ACTION_A: [listenerA, listenerA1],
      ACTION_B: [listenerB],
      ACTION_C: [listenerC],
    };
    const expectedCurrentArrayLength = currentState.ACTION_A.length;
    const expectedResultArrayLength = expectedCurrentArrayLength - 1;

    const newState = reducer(currentState, {
      type: UNSUBSCRIBE_ACTIONS,
      listenersObj: {
        ACTION_A: [listenerA2],
      },
    });

    expect(newState).to.deep.equal(resultState);
    expect(currentState.ACTION_A.length).to.equal(expectedCurrentArrayLength);
    expect(newState.ACTION_A.length).to.equal(expectedResultArrayLength);
  });
});
