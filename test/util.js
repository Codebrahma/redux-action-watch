import { expect } from 'chai';  // eslint-disable-line import/no-extraneous-dependencies
import {
  isImmutable,
} from '../src/util';

describe('Checking utility functions.', () => {
  it('should test `isImmutable` function, to check whether `object` is immutable object or not', () => {
    const subject = {};

    expect(isImmutable(subject)).to.equal(false);
  });
});
