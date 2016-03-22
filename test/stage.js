/* global describe, it */

import { prop } from '../src/accessors';
import { stage } from '../src/stage';

describe('The stage function', () => {
  it('takes an accessor, a state, and provides getters to the node', () => {
    const state = { hello: { to: 'you' } };
    const config = { accessor: prop('hello') };
    stage(config)(state).get(prop('to')).should.equal('you');
  });
});
