import React, { createElement } from 'react';

import { stage } from './stage';

const getPropsFromStore = store => accessor =>
  stage(accessor, store.dispatch)(store.getState())
;

export const connectStaged = accessor => WrappedComponent => {
  const Container = (props, context) => createElement(
    WrappedComponent,
    Object.assign({}, props, getPropsFromStore(context.store)(accessor))
  );
  Container.contextTypes = { store: React.PropTypes.object };
  return Container;
};
