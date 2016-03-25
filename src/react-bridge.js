import React, { createElement } from 'react';

import { stage } from './stage';

const getPropsFromStore = (store, config = {}) => accessor =>
  stage(accessor, store.dispatch, config)(store.getState())
;

const mapPropsToAccessor = (props, accessorCreator) => {
  if (accessorCreator instanceof Function) {
    return accessorCreator(props);
  }
  return accessorCreator;
};

export const connectStaged = (accessorCreator, userConfig = {}) => WrappedComponent => {
  const config = Object.assign({ stagedMountPoint: 'staged' }, userConfig);

  const Container = (props, context) => createElement(
    WrappedComponent,
    Object.assign(
      {},
      props,
      getPropsFromStore(context.store, config)(
        mapPropsToAccessor(props, accessorCreator)
      )
    )
  );
  Container.contextTypes = { store: React.PropTypes.object };
  return Container;
};
