import React, { createElement } from 'react';

import { stage } from './stage';

const getPropsFromStore = store => accessor =>
  stage(accessor, store.dispatch)(store.getState())
;

const mapPropsToAccessor = (props, accessorCreator) => {
  if (accessorCreator instanceof Function) {
    return accessorCreator(props);
  }
  return accessorCreator;
};

export const connectStaged = accessorCreator => WrappedComponent => {
  const Container = (props, context) => createElement(
    WrappedComponent,
    Object.assign(
      {},
      props,
      getPropsFromStore(context.store)(
        mapPropsToAccessor(props, accessorCreator)
      )
    )
  );
  Container.contextTypes = { store: React.PropTypes.object };
  return Container;
};
