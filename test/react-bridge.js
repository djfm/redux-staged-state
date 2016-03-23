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
      props.should.include.keys('get', 'set', 'delete', 'bindings');
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

  it('should provide a value binding that gets the value from the state', () => {
    const store = createStore((state = { customer: { name: 'Bob' } }) => state);

    const VanillaCustomerForm = ({ bindings }) =>
      <input type="text" value={bindings('name').value} />
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
});
