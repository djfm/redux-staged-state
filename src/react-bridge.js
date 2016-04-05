import React, { Component, createElement } from 'react';
import { stage } from './stage';
import { compose as composeAccessors } from './accessors';
import { shallowEqual } from './utils';

const getStagingPropsFromStore = (store, config = {}) => accessor =>
  stage(accessor, store.dispatch, config)(store.getState())
;

const mapPropsToAccessor = (props, accessorCreator) => {
  if (accessorCreator instanceof Function) {
    return accessorCreator(props);
  }
  return accessorCreator;
};

export const connectStaged = (accessorCreator, userConfig = {}) =>
  WrappedComponent => {
    const config = Object.assign({ stagedMountPoint: 'staged' }, userConfig);

    class ConnectStaged extends Component {
      componentDidMount() {
        if (!this.unsubscribe) {
          this.unsubscribe = this.context.store.subscribe(this.handleChange.bind(this));
          this.handleChange();
        }
      }

      componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribe = null;
      }

      getAccessor() {
        return mapPropsToAccessor(this.props, accessorCreator);
      }

      getStagingProps() {
        return getStagingPropsFromStore(this.context.store, config)(
          this.getAccessor()
        );
      }

      handleChange() {
        /**
         * If either the original value of the store state
         * or the staged version has changed, then update
         * the component.
         */

        if (!this.unsubscribe) {
          // do nothing if component not mounted
          return;
        }

        const originalAccessor = composeAccessors(this.getAccessor());
        const stagedAccessor = composeAccessors(
          config.stagedMountPoint,
          originalAccessor
        );

        const state = {
          original: originalAccessor.of(this.context.store.getState()).get(),
          staged: stagedAccessor.of(this.context.store.getState()).get(),
        };

        if (!this.state || !shallowEqual(state, this.state)) {
          this.setState(state);
        }
      }

      render() {
        return createElement(
          WrappedComponent,
          Object.assign(
            {},
            this.props,
            this.getStagingProps()
          )
        );
      }
   }

    ConnectStaged.contextTypes = { store: React.PropTypes.object };
    ConnectStaged.displayName = `ConnectStaged(${
      WrappedComponent.displayName || WrappedComponent.name || 'Component'
    })`;
    return ConnectStaged;
  }
;
