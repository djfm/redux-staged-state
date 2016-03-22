/* global describe, it */
import deepFreeze from 'deep-freeze';

import { reducer } from '../src/reducer';
import { SET_TYPE } from '../src/constants';

describe('The reducer', () => {
  it('should set values in the staged state', () =>
    reducer(deepFreeze({}), {
      type: SET_TYPE,
      accessor: 'a',
      value: 1,
    }).should.deep.equal({ a: 1 })
  );
});
