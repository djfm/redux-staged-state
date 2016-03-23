/* global describe, it */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import jsdom from 'mocha-jsdom';
import chai from 'chai';

import { connectStaged } from '../src/react-bridge';

describe('The react bridge', () => {
  jsdom();

  it('should wrap a component, exposing the utility methods as props', () => {
    const store = createStore(() => ({}));

    const Component = chai.spy(props => {
      props.should.include.keys('get', 'set', 'delete');
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
});
