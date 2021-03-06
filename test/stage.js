/* global describe, it */
import chai from 'chai';

import { stage } from '../src/stage';
import { SET_TYPE, DELETE_TYPE } from '../src/constants';

describe('The stage function', () => {
  it('takes an accessor and provides getters to the node', () => {
    const state = { hello: { to: 'you' } };
    stage('hello')(state).get('to').should.equal('you');
  });
  describe('a getter', () => {
    it('prefers the staged value when there is one', () => {
      const state = { hello: { to: 'you' }, staged: { hello: { to: 'you all' } } };
      stage(
        'hello',
        undefined,
        { stagedMountPoint: 'staged' }
      )(state).get('to').should.equal('you all');
    });
    it('accepts a default value', () => {
      const state = { hello: { to: 'you' } };
      stage('hello')(state).get('Alice', 'Bob').should.equal('Bob');
    });
  });
  describe('the pristine method', () => {
    it('tells you whether the staged element was changed - it was changed', () => {
      const state = { hello: { to: 'you' }, staged: { hello: { to: 'you all' } } };
      stage(
        'hello',
        undefined,
        { stagedMountPoint: 'staged' }
      )(state).pristine().should.equal(false);
    });
    it('tells you whether the staged element was changed - it wasn\'t changed', () => {
      const state = { hello: { to: 'you' }, staged: { hello: { to: 'you' } } };
      stage(
        'hello',
        undefined,
        { stagedMountPoint: 'staged' }
      )(state).pristine().should.equal(true);
    });
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
    it('the staged mount point does not alter set\'s behaviour', () => {
      const state = { hello: { to: 'you' } };
      const dispatch = chai.spy(action => {
        action.accessor.should.equal('hello.to');
        action.type.should.equal(SET_TYPE);
      });
      stage('hello', dispatch, { stagedMountPoint: 'staged' })(state).set('to', 'you all');
      dispatch.should.have.been.called();
    });
    it('takes an accessor and provides resetters to the node', () => {
      const state = { hello: { to: 'you' } };
      const dispatch = chai.spy(action => {
        action.accessor.should.equal('hello.to');
        action.type.should.equal(DELETE_TYPE);
      });
      stage('hello', dispatch)(state).reset('to');
      dispatch.should.have.been.called();
    });
    it('provides a bindings method (that is useful for integration with react)', () => {
      const bindings = stage('hello', () => undefined)({}).bindings;
      bindings('hello').should.respondTo('onChange');
    });
  });
  it('provides a stage method that replicates the current setup with a nested accessor', () => {
    const helpers = stage('hello')({ hello: { world: { is: 'nice' } } });
    helpers.stage('world').get('is').should.equal('nice');
  });
});
