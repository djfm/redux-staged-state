/* global describe, it */

import { stage } from '../src/stage';

describe('The stage function', () => {
  it('takes an accessor and provides getters to the node', () => {
    const state = { hello: { to: 'you' } };
    stage('hello')(state).get('to').should.equal('you');
  });
});
