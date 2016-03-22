/* global describe, it */
import chai from 'chai';

import { stage } from '../src/stage';
import { SET_TYPE } from '../src/constants';

describe('The stage function', () => {
  it('takes an accessor and provides getters to the node', () => {
    const state = { hello: { to: 'you' } };
    stage('hello')(state).get('to').should.equal('you');
  });
  describe('given a dispatch function', () => {
    it('takes an accessor and provides setters to the node', () => {
      const state = { hello: { to: 'you' } };
      const dispatch = chai.spy(action => {
        action.accessor.should.equal('hello.to');
        action.value.should.equal('you all');
        action.type.should.equal(SET_TYPE);
      });
      stage('hello', dispatch)(state).set('to', 'you all');
      dispatch.should.have.been.called();
    });
  });
});
