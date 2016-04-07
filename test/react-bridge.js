/* global describe, it */
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import jsdom from 'mocha-jsdom';
import chai from 'chai';

import { connectStaged } from '../src/react-bridge';
import { reducer } from '../src/reducer';

describe('The react bridge', () => {
  jsdom();

  it('should wrap a component, exposing the utility methods as props', () => {
    const store = createStore(() => ({}));

    const Component = chai.spy(props => {
      props.should.include.keys('get', 'set', 'reset', 'bindings', 'pristine');
      return <div></div>;
    });

    const WrappedComponent = connectStaged('a.b')(Component);

    ReactDOM.render(
      <Provider store={store}>
        <WrappedComponent />
      </Provider>,
      document.createElement('div')
    );

    Component.should.have.been.called();
  });

  it('connectStaged should also accept an accessor creator mapping props to an accessor', () => {
    const store = createStore(() => ({}));

    const Component = chai.spy(props => {
      props.should.include({ rootAccessor: 'a prop' });
      return <div></div>;
    });

    const WrappedComponent = connectStaged(({ testProp }) => testProp)(Component);

    ReactDOM.render(
      <Provider store={store}>
        <WrappedComponent testProp={'a prop'} />
      </Provider>,
      document.createElement('div')
    );

    Component.should.have.been.called();
  });

  it('should provide an onChange event handler builder that stages the new value', () => {
    const store = createStore(combineReducers({
      staged: reducer,
      customer: (state = ({ name: 'Bob' })) => state,
    }));

    const VanillaCustomerForm = ({ bindings }) =>
      <input type="text" onChange={bindings('name').onChange} />
    ;
    VanillaCustomerForm.propTypes = { bindings: React.PropTypes.func.isRequired };

    const CustomerForm = connectStaged('customer')(VanillaCustomerForm);

    const tree = ReactDOM.render(
      <Provider store={store}>
        <CustomerForm />
      </Provider>,
      document.createElement('div')
    );

    const input = ReactTestUtils.findRenderedDOMComponentWithTag(tree, 'input');
    input.value = 'Alice';
    ReactTestUtils.Simulate.change(input);

    store.getState().should.deep.equal({
      customer: { name: 'Bob' },
      staged: { customer: { name: 'Alice' } },
    });
  });

  it('the change of value should be reflected in the DOM even for connected components', () => {
    const store = createStore(combineReducers({
      staged: reducer,
      customer: (state = ({ name: 'Bob' })) => state,
    }));

    const VanillaCustomerForm = ({ bindings }) =>
      <input type="text" {...bindings('name')} />
    ;
    VanillaCustomerForm.propTypes = { bindings: React.PropTypes.func.isRequired };

    const CustomerForm = connectStaged('customer')(VanillaCustomerForm);

    const tree = ReactDOM.render(
      <Provider store={store}>
        <CustomerForm />
      </Provider>,
      document.createElement('div')
    );

    const input = ReactTestUtils.findRenderedDOMComponentWithTag(tree, 'input');
    input.value.should.equal('Bob');
    input.value = 'Alice';
    ReactTestUtils.Simulate.change(input);
    store.getState().should.deep.equal({
      customer: { name: 'Bob' },
      staged: { customer: { name: 'Alice' } },
    });
    input.value.should.equal('Alice');
  });

  it('should provide a value binding that gets the value from the state', () => {
    const store = createStore((state = { customer: { name: 'Bob' } }) => state);

    const VanillaCustomerForm = ({ bindings }) =>
      <input type="text" defaultValue={bindings('name').value} />
    ;
    VanillaCustomerForm.propTypes = { bindings: React.PropTypes.func.isRequired };

    const CustomerForm = connectStaged('customer')(VanillaCustomerForm);

    const tree = ReactDOM.render(
      <Provider store={store}>
        <CustomerForm />
      </Provider>,
      document.createElement('div')
    );

    const input = ReactTestUtils.findRenderedDOMComponentWithTag(tree, 'input');
    input.value.should.equal('Bob');
  });

  it('should provide a value binding that gets the staged value if there is one', () => {
    const initialState = {
      customer: {
        name: 'Bob',
      },
      staged: {
        customer: {
          name: 'Alice',
        },
      },
    };
    const store = createStore((state = initialState) => state);

    const VanillaCustomerForm = ({ bindings }) =>
      <input type="text" defaultValue={bindings('name').value} />
    ;
    VanillaCustomerForm.propTypes = { bindings: React.PropTypes.func.isRequired };

    const CustomerForm = connectStaged(
      'customer',
      undefined,
      { stagedMountPoint: 'staged' }
    )(VanillaCustomerForm);

    const tree = ReactDOM.render(
      <Provider store={store}>
        <CustomerForm />
      </Provider>,
      document.createElement('div')
    );

    const input = ReactTestUtils.findRenderedDOMComponentWithTag(tree, 'input');
    input.value.should.equal('Alice');
  });

  it('by default, the staged state is mounted at "staged"', () => {
    const initialState = {
      customer: {
        name: 'Bob',
      },
      staged: {
        customer: {
          name: 'Alice',
        },
      },
    };
    const store = createStore((state = initialState) => state);

    const VanillaCustomerForm = ({ bindings }) =>
      <input type="text" defaultValue={bindings('name').value} />
    ;
    VanillaCustomerForm.propTypes = { bindings: React.PropTypes.func.isRequired };

    const CustomerForm = connectStaged('customer')(VanillaCustomerForm);

    const tree = ReactDOM.render(
      <Provider store={store}>
        <CustomerForm />
      </Provider>,
      document.createElement('div')
    );

    const input = ReactTestUtils.findRenderedDOMComponentWithTag(tree, 'input');
    input.value.should.equal('Alice');
  });
});
